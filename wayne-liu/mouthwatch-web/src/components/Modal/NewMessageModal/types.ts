import * as Modal from '#/components/Modal'

import { ArchiveChannel, Channel, User } from '#/microservice-middleware'
import { CreateChannelAutoSelect, SelectChannel } from '#/actions/chat'

import { InjectedFormProps } from 'redux-form'
import { Option } from 'react-select/lib/filters'
import { RegistrationStatus } from '#/types'

export interface FormData {
  users: Option[]
}

export type FormProps = InjectedFormProps<FormData, FieldProps> & FieldProps

export type ModifiedOption = { value: string, label: string, data: { is_patient: boolean, patient_id: string, status: RegistrationStatus } }
export interface FieldProps {
  disableAdding: boolean
  options: ModifiedOption[]
}

export interface DefaultProps {
  formValues: ModifiedOption[]
}

export interface Props extends Partial<DefaultProps>, Modal.BaseModalProps {
  createChannelAndAutoSelect: typeof CreateChannelAutoSelect
  chatUsers: User[]
  loggedInUserId: string
  archiveChannel: typeof ArchiveChannel
  channels: Channel[]
  selectChannel: typeof SelectChannel
  groupMessagingEnabled: boolean
}

export type ActionProps = Pick<Props, 'createChannelAndAutoSelect' | 'archiveChannel' | 'selectChannel'>
export type StateProps = Pick<Props, 'chatUsers' | 'loggedInUserId' | 'channels' | 'formValues' | 'groupMessagingEnabled'>
