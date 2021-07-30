import { FormErrors } from 'redux-form'

export type Errors = FormErrors<FormData>

export interface FormData {
  send_text_alerts: boolean
  phone: string
}

export interface FormProps {
  showPhoneField: boolean
}
