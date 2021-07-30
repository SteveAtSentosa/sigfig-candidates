import * as Modal from '#/components/Modal'

import { CreateAppointment } from '#/actions/appointments'
import { Omit } from '#/types'

export interface Props extends Modal.BaseModalProps {
  createAppointment: typeof CreateAppointment
  loggedInUserId: string
}

export type StateProps = Pick<Props, 'loggedInUserId'>
export type ActionProps = Pick<Props, 'createAppointment'>
export type OwnProps = Omit<Props, 'loggedInUserId' | 'createAppointment'>
