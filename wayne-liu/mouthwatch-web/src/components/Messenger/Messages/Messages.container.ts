import { ActionProps, StateProps } from './types'
import {
  InitViewableMessages,
  SetViewableMessages,
  SyncMessages,
  UpdateScrollPosition,
  defaultMessageSubscriptionCountSelector,
  defaultViewableMessagesSelector,
  getChannelSubscriptions,
  getMessagesSyncedForChannel,
  getSelectedChannel,
  getViewableMessagesForChannel
} from '#/actions/chat'

import { AppState } from '#/redux'
import { LoginToSession } from '#/actions/video'
import Messages from './Messages'
import { SetSubscription } from '#/microservice-middleware'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    channel: getSelectedChannel(state),
    loggedInUser: state.auth.data.account,
    selectedChannel: state.chat.selectedChannel,
    scrollPositions: state.chat.scrollPositions,
    token: state.auth.data.token,
    channelSubscriptions: getChannelSubscriptions(state),
    viewableMessages: getViewableMessagesForChannel(state),
    messagesSynced: getMessagesSyncedForChannel(state),
    DEFAULT_VIEWABLE_MESSAGES: defaultViewableMessagesSelector(state),
    DEFAULT_MESSAGE_SUBSCRIPTION_COUNT: defaultMessageSubscriptionCountSelector(state)
  }
}

export const mapDispatch: ActionProps = {
  updateScrollPosition: UpdateScrollPosition,
  setSubscription: SetSubscription,
  initViewableMessages: InitViewableMessages,
  setViewableMessages: SetViewableMessages,
  syncMessages: SyncMessages,
  loginToSession: LoginToSession
}

export default connect(mapState, mapDispatch)(Messages)
