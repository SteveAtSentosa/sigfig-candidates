import * as React from 'react'

import ChatField from './ChatField'
import Messages from './Messages'
import MessengerSlideOutMenu from './MessengerSlideOutMenu'
import MessengerToolbar from './Toolbar'
import { Props } from './types'
import cn from 'classnames'

const styles = require('./styles.scss')

export default class Messenger extends React.PureComponent<Props> {

  private get renderMessageDirective () {
    return <div className={styles.emptyChannel}>Select a message to begin.</div>
  }

  private get messengerClassName () {
    return cn(styles.messenger, {
      [styles.slideoutOpen]: this.props.isAttachmentMenuOpen
    })
  }

  private get chatBoxClassName () {
    return cn(styles.chatbox, {
      [styles.hasAttachments]: this.props.attachments.length > 0
    })
  }

  private get chatFieldContainerClassName () {
    return cn(styles.chatFieldContainer, {
      [styles.forPatient]: this.props.loggedInUser.is_patient
    })
  }

  render () {
    const { selectedChannel } = this.props
    if (!selectedChannel) return this.renderMessageDirective
    return (
      <div className={this.messengerClassName}>
        <MessengerToolbar/>
        <div className={this.chatBoxClassName}>
          <Messages/>
          <div className={this.chatFieldContainerClassName}>
            <ChatField />
          </div>
        </div>
        <MessengerSlideOutMenu/>
      </div>
    )
  }
}
