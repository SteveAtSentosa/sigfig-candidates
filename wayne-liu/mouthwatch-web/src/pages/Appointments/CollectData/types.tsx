import { AddItem, RemoveItem } from '#/actions/bulkSelect'
import { Appt as Appointment, Media, ViewPermissions } from '#/types'
import { ClearCurrentMedia, CreateMedia, SendAllMedia, SetCurrentMedia } from '#/actions/media'

import { LoadAppointment } from '#/actions/appointments'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'

export interface StateProps {
  fetchingMediaDict: { [id: string]: boolean }
  postingMedia: boolean
  selectedMediaId: string
  appointment: Appointment | void
  fetchingAppointment: boolean
  data: Array<Media>
  token: string
  error: Error
  uploaded: boolean
  viewPerms: ViewPermissions
}

export interface OwnProps {
  appointmentId: string
  patientId?: string
}

export interface ActionProps {
  setCurrentMedia: typeof SetCurrentMedia
  sendAllMedia: typeof SendAllMedia
  createMedia: typeof CreateMedia
  loadAppointment: typeof LoadAppointment
  showNotificationPopUp: typeof ShowNotificationPopUp
  addItem: typeof AddItem
  removeItem: typeof RemoveItem
  clearCurrentMedia: typeof ClearCurrentMedia
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export interface State {
  currentMedia: string
  pressed: boolean
  keydown: boolean
  key: string
  targetTagName: string
  deleteModalIsOpen: boolean
}

export type Props = OwnProps & StateProps & ActionProps
