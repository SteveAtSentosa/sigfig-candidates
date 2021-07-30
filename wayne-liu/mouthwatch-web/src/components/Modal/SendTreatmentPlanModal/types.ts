import { AccountLookup, EntityId } from '#/types'

import { Channel } from '#/microservice-middleware'
import { CloseModal } from '#/actions/modals'
import { InjectedFormProps } from 'redux-form'
import { RouteComponentProps } from 'react-router-dom'
import { SendTreatmentPlanToPatient } from '#/actions/chat'
import { TreatmentPlanEntity } from '#/api'
import { UpdatePatient } from '#/actions/patients'

export interface FormData {
  email: string
}

export type FormProps = InjectedFormProps<FormData, {}>

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, RouteComponentProps {
  closeModal: typeof CloseModal
  sendTreatmentPlanToPatient: typeof SendTreatmentPlanToPatient
  updatePatient: typeof UpdatePatient
  isOpen: boolean
  chatUsers: AccountLookup
  channels: Channel[]
  treatmentPlanId: EntityId
  patientId: EntityId
  loggedInUser: string
  treatmentPlans: TreatmentPlanEntity[]
}

export type ActionProps = Pick<Props, 'closeModal' | 'sendTreatmentPlanToPatient' | 'updatePatient'>
export type StateProps = Pick<Props, 'isOpen' | 'chatUsers' | 'channels' | 'loggedInUser' | 'treatmentPlans' | 'treatmentPlanId'>
export type OwnProps = Pick<Props, 'patientId'>
