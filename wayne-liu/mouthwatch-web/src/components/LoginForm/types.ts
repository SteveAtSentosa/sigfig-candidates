import { RouteComponentProps } from 'react-router'
import { FormErrors, InjectedFormProps } from 'redux-form'

export interface FormData {
  username: string
  password: string
  remember: boolean
  email: string
}

export interface OwnProps extends RouteComponentProps {
  onSubmit: (e: any) => void
  rememberMe?: boolean
  email?: boolean
}

export type Errors = FormErrors<FormData>

export type Props = InjectedFormProps<FormData, OwnProps> & OwnProps
