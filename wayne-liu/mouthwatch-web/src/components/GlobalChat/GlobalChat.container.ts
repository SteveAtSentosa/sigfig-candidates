import { ActionProps, StateProps } from './types'
import { CloseConversation, OpenConversation } from '#/actions/gchat'
import { MapStateToProps, connect } from 'react-redux'

import { AppState } from '#/redux'
import GlobalChat from './GlobalChat'

export const mapState: MapStateToProps<StateProps, {}, AppState> = (state) => {
  return {
    conversations: state.gchat.conversations,
    chatUsers: state.accounts.accounts
  }
}

export const mapDispatch: ActionProps = {
  openConversation: OpenConversation,
  closeConversation: CloseConversation
}

export default connect<StateProps, ActionProps>(mapState, mapDispatch)(GlobalChat)
