import * as React from 'react'

import MessageBox, { HeaderOptions } from '#/components/MessageBox'

import AccountAvatar from '../AccountAvatar'
import { CommunicationList } from '#/components/GlobalChat'
import { Conversation } from '#/reducers/gchat'
import { Props } from './types'

const styles = require('./styles.scss')

class GlobalChat extends React.PureComponent<Props> {

  private handleConversationClick = ({ open, userId }: Conversation) =>
    (_e: React.MouseEvent<HTMLDivElement>) => {
      const { closeConversation, openConversation } = this.props
      return open ? closeConversation({ userId }) : openConversation({ userId })
    }

  private renderSingleConversation = (conversation: Conversation) => {
    const { first_name, last_name, id } = this.props.chatUsers[conversation.userId]

    const headerOptions: HeaderOptions = {
      leftSlot: () => <AccountAvatar type='provider' height={25} width={25} showStatusIndicator entityId={id}/>,
      middleSlot: () => <>{`${first_name} ${last_name}`}<span className={styles.notificationCount}><p>1</p></span></>
    }

    return (
      <MessageBox key={conversation.userId} header={headerOptions} onHeaderClick={this.handleConversationClick(conversation)} collapsed={!conversation.open}>
        <div>
          Content!
        </div>
      </MessageBox>
    )
  }

  private get renderConversations () {
    const { conversations } = this.props
    return (
      <div className={styles.conversations}>
        {conversations.map(this.renderSingleConversation)}
      </div>
    )
  }
  render () {
    return (
      <div className={styles.globalChat}>
        <CommunicationList/>
        { this.renderConversations }
      </div>
    )
  }
}

export default GlobalChat
