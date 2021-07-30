import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessengerForm from '#/components/Messenger/MessengerForm'
import { Props } from './types'
import cn from 'classnames'
import { faArchive } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./styles.scss')

export default class ChatField extends React.PureComponent<Props> {

  private get renderInactiveChannelText () {
    return (
      <div className={styles.inactiveChannelText}>
        <FontAwesomeIcon icon={faArchive}/>
        <span className={styles.text}>You are viewing archived messages. You can no longer message this account.</span>
      </div>
    )
  }

  private get chatFieldClassName () {
    return cn(styles.chatfield, {
      [styles.readOnly]: this.props.selectedChannel.readOnly
    })
  }

  render () {
    const { selectedChannel } = this.props
    if (!selectedChannel) return null
    return (
      <div className={this.chatFieldClassName}>
        {selectedChannel.readOnly ? this.renderInactiveChannelText : <MessengerForm form='messengerForm'/>}
      </div>
    )
  }
}
