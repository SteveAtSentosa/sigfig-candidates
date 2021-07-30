import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import CommunicationList from './CommunicationList'
import { ControlCommunicationList } from '#/actions/gchat'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    viewState: state.gchat.conversationList.viewState,
    loggedInAccount: state.auth.data.account
  }
}

export const mapDispatch: ActionProps = {
  controlCommunicationList: ControlCommunicationList
}

export default connect(mapState, mapDispatch)(CommunicationList)
