import { AppState } from '#/redux'
import ChatField from './ChatField'
import { StateProps } from './types'
import { connect } from 'react-redux'
import { getSelectedChannel } from '#/actions/chat'

export const mapState = (state: AppState): StateProps => {
  return {
    selectedChannel: getSelectedChannel(state)
  }
}

export default connect(mapState)(ChatField)
