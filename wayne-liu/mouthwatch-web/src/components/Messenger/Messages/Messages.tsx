import * as React from 'react'

import { MediaMessageData, Message, VideoMessageData } from '#/microservice-middleware'
import { Props, State } from './types'
import { isEqual, last } from 'lodash'
import { isToday, isYesterday } from 'date-fns'

import AccountAvatar from '#/components/AccountAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Linkify from 'react-linkify'
import MediaImage from '#/components/Media/MediaImage'
import { checkSameDates } from '#/utils/Dates'
import cn from 'classnames'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { getNameForChat } from '#/utils/Chat'
import { getVideoSessionUrl } from '#/api/common'

// import ExportButton from '#/components/Media/ExportButton'

const styles = require('./styles.scss')

export const getLinkText = (value: string) => {
  const urlText = value.match(/\[.*?\]/g)
  const url = value.match(/\(.*?\)/g)

  if (urlText && url) {
    return {
      urlText: urlText[0].replace('[', '').replace(']', ''),
      url: url[0].replace('(', '').replace(')', '')
    }
  }
  return null
}

class Messages extends React.PureComponent<Props, State> {
  state: State = {
    loading: false
  }

  private messagesRef = React.createRef<HTMLDivElement>()

  componentDidMount () {
    /*
      On mount, the only two rendered children are the two (2) waypoints
      In this case, we need to wait for the messages to be rendered
    */
    this.messagesRef.current.addEventListener('scroll', this.onScroll)
    this.props.initViewableMessages({ after: () => setTimeout(this.updateScrollAfterSelectChannel, 100) })

  }

  componentDidUpdate (prevProps: Props) {
    const { selectedChannel, channelSubscriptions, channel } = this.props
    const { channel: { messages: prevChannelMessages } } = prevProps
    const { loading } = this.state

    if (prevProps.selectedChannel !== selectedChannel) {
      // This action checks to see if viewableMessages exists for the channel
      // If it does, it just runs the callback
      this.props.initViewableMessages({ isUnread: this.isUnread, after: () => setTimeout(this.updateScrollAfterSelectChannel, 100) })
    }

    /* Messages Loaded */
    if (channelSubscriptions) {
      /* Check New Message Arrived */
      const messagesAreNotEqual = !isEqual(this.lastChannelMessage, last(prevChannelMessages))
      if (channelSubscriptions.from === null && channelSubscriptions.to === null && messagesAreNotEqual) {
        this.updateMessages(true)
      } else if (!prevProps.channelSubscriptions) {
        this.updateMessages(true)
      }
      /* Previous messages loaded */
      if (channel.messages !== prevProps.channel.messages && loading) {
        this.updateMessages()
        this.setState({ loading: false })
      }
    }
  }

  componentWillUnmount () {
    this.messagesRef.current.removeEventListener('scroll', this.onScroll)
  }

  private onScroll = () => {
    if (this.messagesRef.current.scrollTop + this.messagesRef.current.clientHeight === this.messagesRef.current.scrollHeight) {
      this.paginateScrollingDown()
    } else if (this.messagesRef.current.scrollTop <= 50) {
      this.paginateScrollingUp()
    }
  }

  private get isUnread () {
    const { channel, loggedInUser } = this.props
    const { userToChannels } = channel
    const userToChannelsObj = userToChannels.find(u => u.userId === loggedInUser.id)
    return userToChannelsObj ? userToChannelsObj.unread : false
  }

  private updateScrollAfterSelectChannel = () => {
    const { selectedChannel, scrollPositions } = this.props
    if (!this.messagesRef || !this.messagesRef.current) {
      return
    } else if (typeof scrollPositions[selectedChannel] !== 'undefined' && !this.isUnread) {
      this.messagesRef.current.scrollTop = scrollPositions[selectedChannel]
    } else {
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight
    }
  }

  private linkifyDecorator = (href, text, key) => (
    <a href={href} key={key} target='_blank'>
      {text}
    </a>
  )

  private renderDownloadableThumbnail = (id: string, _index: number, _array: string[]) => {
    const { loggedInUser, token } = this.props
    return (
      <MediaImage key={id} id={id} token={token} loggedInUserId={loggedInUser.id} mediaIds={_array} />
    )
  }

  // private getMediaIdsAsItems = (mediaIds: string[]) => {
  //   return mediaIds.map((id) => ({ id: id }))
  // }

  private parseMediaMessage = (message: string) => {
    const mediaMessage: MediaMessageData = JSON.parse(message)
    return (
      <Linkify componentDecorator={this.linkifyDecorator}>
        <div className={styles.messageData}>
          {mediaMessage.message}
          <div className={styles.attachmentsPreview}>
            {mediaMessage.mediaIds.map(this.renderDownloadableThumbnail)}
          </div>
          {/* <ExportButton btnName='Download Attachments' zipName='Attachments' mediaIds={this.getMediaIdsAsItems(mediaMessage.mediaIds)}/> */}
        </div>
      </Linkify>
    )
  }

  private loginToConference = (room_id: string) => {
    const { token: authToken, loginToSession } = this.props
    const redirect_uri = getVideoSessionUrl(`/conference/${room_id}`, { authToken })
    return () => loginToSession({ redirect_uri })
  }

  private parseVideoMessage = (message: string) => {
    const videoMessage: VideoMessageData = JSON.parse(message)
    const invitationMessage = `${videoMessage.first_name} has invited you to a video call.`

    return (
      <div className={styles.messageData}>
        <div className={styles.videoMessage}>
          <div className={styles.videoIcon}>
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <p className={styles.videoText}>
            {invitationMessage}
          </p>
        </div>
        <div className={styles.videoLogin} onClick={this.loginToConference(videoMessage.room_id)}>
          <span>Click here</span> to join
        </div>
      </div>
    )
  }

  private parsedText = (message: string) => {
    const link = getLinkText(message)
    if (link) {
      const newMessage = message.split(':')[0]
      return (
        <div className={styles.messageData}>
          {newMessage + ':'} <a href={link.url + '?authToken=' + this.props.token} download>{link.urlText}</a>
        </div>
      )
    }

    return (
      <Linkify componentDecorator={this.linkifyDecorator}>
        <div className={styles.messageData}>{message}</div>
      </Linkify>
    )
  }

  private checkIfValidJSON = (text: string) => {
    try {
      const parsedJSON = JSON.parse(text)

      if (typeof parsedJSON === 'number' || parsedJSON === null || !parsedJSON) return false
      return true
    } catch (error) {
      return false
    }
  }

  getSnapshotBeforeUpdate (prevProps: Props) {
    if (prevProps.selectedChannel !== this.props.selectedChannel) {
      this.setState({ loading: false })
      this.props.updateScrollPosition({ channel: prevProps.selectedChannel, position: this.messagesRef.current.scrollTop })
    }

    return null
  }

  private get toId () {
    return this.firstViewableMessage && this.firstViewableMessage.id
  }

  private get fromId () {
    return this.lastViewableMessage && this.lastViewableMessage.id
  }

  private get firstViewableMessage () {
    const { viewableMessages } = this.props
    return viewableMessages && viewableMessages[0]
  }

  private get lastViewableMessage () {
    const { viewableMessages } = this.props
    return viewableMessages && viewableMessages[viewableMessages.length - 1]
  }

  private get firstChannelMessage () {
    const { channel: { messages } } = this.props
    return messages[0]
  }

  private get lastChannelMessage (): Message {
    const { channel: { messages } } = this.props
    return last(messages)
  }

  private get shouldSetNewSubscriptionScrollingUp () {
    // firstChannelMessage exists
    // AND firstViewableMessage exists
    // AND either:
    // firstViewableMessage === firstChannelMessage OR
    // firstViewableMessage is not included in channel.messages
    return Boolean(
      this.firstChannelMessage
      && this.firstViewableMessage
      && (this.firstViewableMessage.id === this.firstChannelMessage.id || !this.channelMessageIds.includes(this.firstViewableMessage.id))
    )
  }

  private get shouldSetNewSubscriptionScrollingDown () {
    // lastChannelMessage exists
    // AND lastViewableMessage exists
    // AND either:
    // lastViewableMessage === lastChannelMessage OR
    // lastViewableMessage is not included in channel.messages
    return Boolean(
      this.lastChannelMessage
      && this.lastViewableMessage
      && (this.lastViewableMessage.id === this.lastChannelMessage.id || !this.channelMessageIds.includes(this.lastViewableMessage.id))
    )
  }

  paginateScrollingUp = () => {
    const { channelSubscriptions } = this.props
    if (this.viewableMessageIds.includes(channelSubscriptions.first)) {
      // no-op
    } else if (this.shouldSetNewSubscriptionScrollingUp) {
      this.setNewSubscriptionTo()
    } else {
      this.updateMessages()
    }
  }

  paginateScrollingDown = () => {
    if (this.subscribedToNewMessages) {
      const { selectedChannel } = this.props
      // Sync to microservice messages
      this.props.syncMessages({ channelId: selectedChannel })
    } else if (this.shouldSetNewSubscriptionScrollingDown) {
      this.setNewSubscriptionFrom()
    } else {
      this.updateMessages()
    }
  }

  private setNewSubscriptionTo = () => {
    const { DEFAULT_MESSAGE_SUBSCRIPTION_COUNT } = this.props
    const { loading } = this.state
    if (loading) return

    this.props.setSubscription({
      from: null,
      to: this.toId,
      throughId: this.props.channel.id,
      throughType: 'channel',
      entityType: 'message',
      count: DEFAULT_MESSAGE_SUBSCRIPTION_COUNT
    })

    this.setState({ loading: true })
  }

  private setNewSubscriptionFrom = () => {
    const { DEFAULT_MESSAGE_SUBSCRIPTION_COUNT } = this.props

    const { loading } = this.state
    if (loading) return

    this.props.setSubscription({
      from: this.fromId,
      to: null,
      throughId: this.props.channel.id,
      throughType: 'channel',
      entityType: 'message',
      count: DEFAULT_MESSAGE_SUBSCRIPTION_COUNT
    })

    this.setState({ loading: true })
  }

  private updateMessages = (forceScrollBottom?: boolean) => {
    const { channel, selectedChannel, viewableMessages } = this.props

    // If messages didn't load
    if (!viewableMessages) return

    // Find the the last viewableMessage's id in channel.messages
    const fromIndex = channel.messages.findIndex(m => m.id === this.fromId)
    const appendArr = fromIndex !== -1 ? channel.messages.slice(fromIndex + 1) : []

    const lastIndex = channel.messages.findIndex(m => m.id === this.toId)
    const prependArr = lastIndex !== -1 ? channel.messages.slice(0, lastIndex) : []

    const currentScrollPosition = this.messagesRef.current.scrollHeight - this.messagesRef.current.scrollTop

    // If there are no viewableMessages, we should set channel.messages as viewable messages
    const newMessages = viewableMessages.length === 0 ? channel.messages : [...prependArr, ...viewableMessages, ...appendArr]

    this.props.setViewableMessages({ channelId: selectedChannel, messages: newMessages, after: () => {
      if (forceScrollBottom) {
        // Force scroll to bottom
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight
      } else {
        // Keep the current scroll position
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - currentScrollPosition
      }
    } })
  }

  private get subscribedToNewMessages () {
    const { channelSubscriptions } = this.props
    /*
      1) Both 'from' and 'to' set to null
      AND
      2) The last viewable message id === the last channel message id
      (It is possible for the first to be true while the second is not true)
      Note the error guarding for this.lastViewableMessage
    */
    return Boolean(
      channelSubscriptions
      && channelSubscriptions.from === null
      && channelSubscriptions.to === null
      && this.lastViewableMessage
      && this.lastViewableMessage.id === this.lastChannelMessage.id
    )
  }

  private get viewableMessageIds () {
    const { viewableMessages } = this.props
    return viewableMessages.map(message => message.id)
  }

  private get channelMessageIds () {
    const { channel } = this.props
    return channel.messages.map(message => message.id)
  }

  private renderDate = (message: Message) => {
    const date = new Date(message.createdAt)
    let dateLabel = ''
    if (isToday(date)) {
      dateLabel = 'TODAY'
    } else if (isYesterday(date)) {
      dateLabel = 'YESTERDAY'
    } else {
      dateLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
    }

    return (
      <div className={styles.dateContainer}>
        <div className={styles.dateDivider} />
        <div className={styles.dateLabel}>
          {dateLabel}
        </div>
        <div className={styles.dateDivider} />
      </div>
    )
  }

  private renderSingleMessage = (message: Message) => {
    const { userId } = message
    const { loggedInUser, channel } = this.props
    const chatUser = channel.userToChannels.find(uC => uC.userId === userId)
    if (chatUser) {
      const { is_patient, patient_id } = chatUser.accountData
      const messageClassName = cn(styles.message, {
        [styles.loggedInUser]: userId === loggedInUser.id,
        [styles.otherUsers]: userId !== loggedInUser.id
      })
      return (
        <div className={messageClassName} id={message.id}>
          <div className={styles.avatarContainer}>
            <AccountAvatar
              width={40}
              height={40}
              type={is_patient ? 'patient' : 'provider'}
              className={styles.avatar}
              entityId={is_patient ? patient_id : userId}
              showStatusIndicator={!loggedInUser.is_patient}
            />
          </div>
          <div className={styles.messageContainer}>
            <div className={styles.messageHeader}>
              <span className={styles.name}>{getNameForChat(chatUser.accountData, loggedInUser.is_patient, true)}</span>
              <span className={styles.time}>
                {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            {this.renderAndParseIncomingMessageData(message)}
          </div>
        </div>
      )
    }
  }

  private renderAndParseIncomingMessageData = (message: Message) => {
    if (this.checkIfValidJSON(message.data)) {
      switch (message.messageType) {
        case 'media':
          return this.parseMediaMessage(message.data)
        case 'video':
          return this.parseVideoMessage(message.data)
      }
    } else {
      return this.parsedText(message.data)
    }
  }

  private get renderMessages () {
    const { viewableMessages } = this.props
    return viewableMessages && viewableMessages.map((message, index) => {
      const isShowDate = index === 0 || !checkSameDates(new Date(message.createdAt), new Date(viewableMessages[index - 1].createdAt))

      return (
        <div key={message.id} >
          {isShowDate && this.renderDate(message)}
          {this.renderSingleMessage(message)}
        </div>
      )
    })
  }

  render () {
    return (
      <div className={styles.messages} id='messages' ref={this.messagesRef}>
        {this.renderMessages}
      </div>
    )
  }
}

export default Messages
