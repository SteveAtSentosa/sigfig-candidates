import { ActionProps, OwnProps, StateProps } from './types'
import { AddItem, RemoveItem } from '#/actions/bulkSelect'
import { ClearCurrentMedia, CreateMedia, SendAllMedia, SetCurrentMedia } from '#/actions/media'
import { LoadAppointment, selectors } from '#/actions/appointments'

import { AppState } from '#/redux'
import CollectData from './CollectData'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state, props) => ({
    appointment: selectors.getById(state, props.appointmentId),
    fetchingAppointment: state.appointments.fetching,
    postingMedia: state.media.posting,
    selectedMediaId: state.media.selectedMediaId,
    fetchingMediaDict: state.media.fetchingMediaDict,
    data: state.media.data,
    error: state.media.error,
    token: state.auth.data.token,
    uploaded: state.notificationPopUp.show,
    viewPerms: state.ui.permissions
  }),
  {
    setCurrentMedia: SetCurrentMedia,
    clearCurrentMedia: ClearCurrentMedia,
    sendAllMedia: SendAllMedia,
    createMedia: CreateMedia,
    loadAppointment: LoadAppointment,
    showNotificationPopUp: ShowNotificationPopUp,
    addItem: AddItem,
    removeItem: RemoveItem
  }
)(CollectData)
