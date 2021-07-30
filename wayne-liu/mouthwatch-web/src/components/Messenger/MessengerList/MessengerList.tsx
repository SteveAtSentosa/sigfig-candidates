import * as React from 'react'

import { Channel, UserToChannel } from '#/microservice-middleware'
import { Props, State } from './types'
import { faPlus, faTimes } from '@fortawesome/pro-light-svg-icons'
import { isEmpty, partition, sortBy } from 'lodash'
import { isMobileDevice, isPatient } from '#/utils'

import AccountAvatar from '#/components/AccountAvatar'
import { AddNewMessageModal } from '#/components/Modal'
import { BREAKPOINT_BS_SM } from '#/consts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from '#/components/Loader'
import MessengerSearchBar from '#/components/Messenger/SearchBar'
import { PartitionedChannels } from '#/actions/chat'
import ResizeDetector from 'react-resize-detector'
import ScrollableList from '#/components/ScrollableList'
import cn from 'classnames'
import { getNameForChat } from '#/utils/Chat'
import queryString from 'query-string'

const styles = require('./styles.scss')

class MessengerList extends React.Component<Props, State> {
  state: State = {
    isAddNewMessageModalOpen: false,
    initialized: false,
    width: 0
  }

  private handleOpenModal = () => {
    this.setState({ isAddNewMessageModalOpen: true })
  }

  private handleCloseModal = () => {
    this.setState({ isAddNewMessageModalOpen: false })
  }

  private renderUsersNames = (users: UserToChannel[]): JSX.Element => {
    const { loggedInAccount } = this.props
    const sortedUsers = sortBy(users, ['accountData.first_name', 'accountData.last_name'])
    const names = sortedUsers.map((user) => {
      return sortedUsers.length > 1 ?
        getNameForChat(user.accountData, loggedInAccount.is_patient)
        : getNameForChat(user.accountData, loggedInAccount.is_patient, true)
    }).join(', ')

    return (
      <div className={styles.userNames}>
        {names}
      </div>
    )
  }

  private renderUserAvatars = (users: UserToChannel[]): JSX.Element => {
    const { loggedInAccount } = this.props
    const avatarClassNames = cn(styles.avatarsContainer, {
      [styles.directMessage]: users.length === 1,
      [styles.groupMessageTwo]: users.length === 2,
      [styles.groupMessageThree]: users.length === 3,
      [styles.groupMessageMax]: users.length > 3
    })
    return (
      <div className={avatarClassNames}>
        {users.slice(0, 4).map(({ userId, accountData: { is_patient, patient_id } }, index) => {
          if (index === 3) {
            return (
              <div key={userId + ' user-avatars'} className={styles.plusUser}>
                {users.length}
              </div>
            )
          }
          return (
            <AccountAvatar
              key={userId + ' user-avatars'}
              className={styles.modalAvatar}
              entityId={is_patient ? patient_id : userId}
              showStatusIndicator={!loggedInAccount.is_patient}
              type={is_patient ? 'patient' : 'provider'}
            />
          )
        })}
      </div>
    )
  }

  private isChannelUnread = (channel: Channel): boolean => channel.userToChannels.some(uC => uC.unread)

  private selectAndMarkAsRead = (channelId: string, isUnread: boolean): () => void => () => {
    const { selectChannel, markChannelAsRead, clearAllAttachments, hide } = this.props
    selectChannel({ channelId })
    isUnread && markChannelAsRead({ channelId })
    // Clear any accountID in location path.
    clearAllAttachments()

    if (this.state.width < BREAKPOINT_BS_SM) {
      hide()
    }
  }

  private archiveChannelClick = (e, channelId) => {
    // prevent from trying to load the channel
    e.stopPropagation()
    const { archiveChannel, clearSelectedChannel, selectedChannel } = this.props
    archiveChannel({ channelId, archived: true })
    if (selectedChannel && selectedChannel === channelId) {
      clearSelectedChannel()
    }
  }

  private renderArchiveButton = (channelId: string): JSX.Element | null => {
    const { loggedInAccount } = this.props
    return (
      !loggedInAccount.is_patient &&
      <span className={styles.archiveButton} onClick={(e) => this.archiveChannelClick(e, channelId)}>
        <FontAwesomeIcon className={styles.closeChannel} icon={faTimes} />
      </span>
    )
  }

  private renderChannelItems = (channel: Channel): JSX.Element => {
    const { userToChannels, id: channelId, readOnly } = channel

    const { selectedChannel, loggedInAccount } = this.props
    if (userToChannels.some(user => typeof user === 'undefined')) return
    const [loggedInAccountChannel, otherUsersChannel ]: [UserToChannel[], UserToChannel[]] = partition(userToChannels, (u: UserToChannel) => u.userId === loggedInAccount.id)
    const { unread } = loggedInAccountChannel[0]
    const channelItemClassName = cn(styles.channelItem, {
      [styles.activeChannel]: selectedChannel === channelId,
      [styles.unreadChannel]: unread,
      [styles.readOnly]: readOnly
    })

    return (
      <div
        className={channelItemClassName}
        onClick={isMobileDevice() ? undefined : this.selectAndMarkAsRead(channelId, unread)}
        onTouchEnd={this.selectAndMarkAsRead(channelId, unread)}
      >
        {this.renderUserAvatars(otherUsersChannel)}
        {this.renderUsersNames(otherUsersChannel)}
        {this.renderArchiveButton(channelId)}
      </div>
    )
  }

  get channelsAreEmpty (): boolean {
    const { channels } = this.props
    const [providerChannels, patientChannels] = channels
    return isEmpty(providerChannels) && isEmpty(patientChannels)
  }

  get addNewMessageButton () {
    const { loggedInAccount } = this.props
    return (
      !isPatient(loggedInAccount) &&
      <div className={styles.addNewMessageContainer}>
        <button className={styles.newMessage} onClick={this.handleOpenModal}>
          <span><FontAwesomeIcon className={styles.plus} icon={faPlus} />New Message</span>
        </button>
      </div>
    )
  }

  get channelItems (): PartitionedChannels {
    return !this.channelsAreEmpty ? this.props.channels : ([[],[]] as PartitionedChannels)
  }

  private setInitialChannel () {
    const { location, microserviceChannels, loggedInAccount, history, channels } = this.props
    const query: {channelId?: string} = queryString.parse(location.search)
    if (query.channelId && loggedInAccount) {
      const channel = microserviceChannels.find(c => c.id === query.channelId)
      if (channel) {
        this.selectAndMarkAsRead(query.channelId, this.isChannelUnread(channel))()
      }
      const pushTo = !loggedInAccount.is_patient ? '/provider-chat' : '/patient-chat'
      history.replace(pushTo)
    } else if (!this.channelsAreEmpty && !this.props.selectedChannel) {
      const [providerChannels, patientChannels ] = channels
      const nonEmptyChannel = providerChannels[0] || patientChannels[0]
      this.props.selectChannel({ channelId: nonEmptyChannel.id })
      this.props.markChannelAsRead({ channelId: nonEmptyChannel.id })
    }
  }

  componentDidMount () {
    if (this.props.initialized) {
      this.setInitialChannel()
    }
  }

  componentDidUpdate (prevProps: Props) {
    const { initialized, location } = this.props
    const query: {channelId?: string} = queryString.parse(location.search)
    const prevQuery: {channelId?: string} = queryString.parse(prevProps.location.search)
    /* Check query param's channelId is changed */
    if ((!prevProps.initialized && initialized) || (query.channelId !== prevQuery.channelId)) {
      this.setInitialChannel()
    }
  }

  render () {
    const { loggedInAccount } = this.props
    return (
      <>
        <div className={styles.messengerList}>
          <div className={styles.searchBar}>
            <MessengerSearchBar type='contacts' form='filterForm'/>
          </div>
          {this.addNewMessageButton}
          <ScrollableList<Channel>
            items={this.channelItems}
            loading={!this.props.initialized}
            renderLoading={() => <Loader/>}
            isPatient={isPatient(loggedInAccount)}
          >
            {this.renderChannelItems}
          </ScrollableList>

          <ResizeDetector
            handleWidth
            querySelector={'body'}
            onResize={(width: number) => this.setState({ width })} />
        </div>
        <AddNewMessageModal
          close={this.handleCloseModal}
          onHide={this.handleCloseModal}
          isOpen={this.state.isAddNewMessageModalOpen}
          backdrop
          keyboard />
      </>
    )
  }
}

export default MessengerList
