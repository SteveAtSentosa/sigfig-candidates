import * as Modal from '#/components/Modal'

import { CreateAppointment } from '#/actions/appointments'
import { Patient } from '#/types'

export interface OwnProps extends Modal.ModalProps {
  afterSubmit?: (e: any) => void
}

export interface ActionProps {
  createAppointment: typeof CreateAppointment
}

export interface StateProps {
  patients: Patient[]
}

export type Props = OwnProps & ActionProps & StateProps
