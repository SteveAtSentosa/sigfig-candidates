import { ActionProps, StateProps } from './types'
import { ArchivePatient, ClearArchiveError } from '#/actions/patients'

import { AppState } from '#/redux'
import ArchiveModal from './ArchiveModal'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const mapState = (state: AppState): StateProps => {
  return {
    chatUsers: state.accounts.accounts,
    saving: state.patients.archive.saving,
    error: state.patients.archive.error
  }
}

const mapDispatch: ActionProps = {
  clearArchiveError: ClearArchiveError,
  archivePatient: ArchivePatient,
  showNotificationPopUp: ShowNotificationPopUp
}

const ConnectedArchivedModal = connect(mapState, mapDispatch)(ArchiveModal)
export default withRouter(ConnectedArchivedModal)
