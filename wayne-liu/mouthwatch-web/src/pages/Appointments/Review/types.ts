import { Appt as Appointment, EntityId, Note, ProcedureFromForm as Procedure, ViewPermissions } from '#/types'
import { CreateNote, EditNote } from '#/actions/notes'

import { LoadList } from '#/actions/procedures'
import { OpenMediaViewer } from '#/actions/mediaViewer'
import { RouteComponentProps } from 'react-router-dom'

export interface Props {
  patientId: EntityId
  procedures: Procedure[]
  appointmentId: EntityId
  viewPerms: ViewPermissions
  appointment: Appointment
  fetchingAppointment: boolean
  editNote: typeof EditNote
  createNote: typeof CreateNote
  loadProcedures: typeof LoadList
  openMediaViewer: typeof OpenMediaViewer
}

export type OwnProps = Pick<Props, 'patientId' | 'appointmentId'> & RouteComponentProps
export type StateProps = Pick<Props, 'appointment' | 'fetchingAppointment' | 'procedures' | 'viewPerms'>
export type ActionProps = Pick<Props, 'editNote' | 'createNote' | 'loadProcedures' | 'openMediaViewer'>

export interface State {
  isNotePanelOpen: boolean
  isDeleteModalOpen: boolean
  isEditingNote: boolean
  isProcedureModalOpen: boolean
  currentNote: Note
  deletingNote: Note
}
