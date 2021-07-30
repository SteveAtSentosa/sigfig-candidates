import * as React from 'react'

import { FormErrors, InjectedFormProps, reduxForm } from 'redux-form'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import Container from '#/components/Container'
import Copyright from '#/components/Copyright'
import Field from '#/components/Form/Field'
import { ForgotPassword } from '#/actions/password'
import Label from '#/components/Form/Label'
import Loader from '#/components/Loader'
import Logo from '#/components/Logo'
import Page from '#/components/Page'
import { RouteComponentProps } from 'react-router-dom'
import { TextInput } from '#/components/Form/Input'
import { connect } from 'react-redux'

const styles = require('./styles.scss')

export interface FormData {
  username: string
}

export type Errors = FormErrors<FormData>

const validate = (values: FormData) => {
  const errors: Errors = {}

  if (!values.username) {
    errors.username = 'Required.'
  }

  return errors
}

const Form = (props: InjectedFormProps) => {
  return (
    <form id='forgotPassword' className={styles.forgotPasswordForm} onSubmit={props.handleSubmit}>
      <Label htmlFor='username'>Username</Label>
      <Field
        className={styles.userNameField}
        component={TextInput}
        name='username'
      />
      <Button className={styles.submitButton} submit form='forgotPassword'>Submit</Button>
    </form>
  )
}

const ForgotPasswordForm = reduxForm({
  validate,
  form: 'forgotPassword'
})(Form)

type Props = RouteComponentProps

interface StateProps {
  loading: boolean
  status: boolean
  error: Error
}

interface ActionProps {
  forgot: typeof ForgotPassword
}

interface State {
  prevValues?: {
    username: string
  }
}

type ExpectedLocationState = { prevPath: string }

class ForgotPasswordPage extends React.Component<Props & StateProps & ActionProps, State> {

  submit = (values) => {
    this.setState({ prevValues: values })
    this.props.forgot(values)
  }

  resubmit = () => {
    const { prevValues } = this.state
    if (prevValues) {
      this.props.forgot(prevValues)
    }
  }

  // reroute user to '/patient-login' or '/'
  get loginLink () {
    const { history: { location } } = this.props
    const { state } = location
    // Type definition for state is {} | null | undefined
    const { prevPath } = state as ExpectedLocationState
    return prevPath || '/'
  }

  get headerText () {
    const { status } = this.props
    return !status ? 'Forgot Password' : 'Success!'
  }

  get instructionalCopy () {
    const { status } = this.props
    if (status) {
      return(
        <>
          An email has been sent to that email address. Click the link inside to reset your password. If you do not receive an email, check your spam folder or resubmit the form by clicking below.
          <Button className={styles.submitButton} onClick={this.resubmit}>Resubmit</Button>
        </>
      )
    }

    return 'To reset your password, enter the email address associated with the account. We will send you a link to confirm your identity.'
  }

  render () {
    const { loading, status, error } = this.props

    return (
      <Page title='Forgot Password' className={styles.forgotPassword}>
        <Container fullWidth className={styles.container}>
          <div className={styles.logoHolder}>
            <div className={styles.teledentLogo}><Logo /></div>
          </div>
          <div className={styles.forgot}>
            <h2>{this.headerText}</h2>
            <div className={styles.instructionalCopy}>{this.instructionalCopy}</div>
            { loading && <Loader /> }
            { error && <div className={styles.errorMessage}>Unable to find an account with that Username, please contact your administrator.</div> }
            { (!loading && !status) && <ForgotPasswordForm onSubmit={this.submit} /> }
          </div>
        </Container>
        <div className={styles.haveAccount}>
          <p>Already have an account?</p>
          <Button className={styles.loginBtn} onClick={() => this.props.history.push(this.loginLink)} secondary inline transparent>Login</Button>
        </div>
        <Copyright/>
      </Page>
    )
  }
}

export default connect<StateProps, ActionProps, {}, AppState>(
  (state) => ({
    loading: state.password.loading,
    status: state.password.status,
    error: state.password.error
  }),
  {
    forgot: ForgotPassword
  }
)(ForgotPasswordPage)
