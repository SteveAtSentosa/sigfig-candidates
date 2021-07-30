import { InjectedFormProps } from 'redux-form'

import { Group } from '#/types'

export interface FormProps {
  initialValues: Partial<FormValues>
  onSubmit?: (policy: FormValues) => void
  onDelete?: (policyId: string | undefined) => void
  form: string
  group?: Group
}

export interface FormValues {
  id?: string
  consent_policy?: string
  language?: string
  agree_button_text?: string
  decline_button_text?: string
  reconfirm?: boolean
}

export interface OwnProps {
}

export interface StateProps {}

export type Props = InjectedFormProps<FormValues, FormProps> & FormProps & StateProps & OwnProps

export interface State {
  policy?: string
}
