import * as React from 'react'

import { InjectedFormProps, reduxForm } from 'redux-form'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import Container from '#/components/Container'
import Copyright from '#/components/Copyright'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import Loader from '#/components/Loader'
import Logo from '#/components/Logo'
import Page from '#/components/Page'
import { ResetPassword } from '#/actions/password'
import { RouteComponentProps } from 'react-router'
import { RouteProps } from '#/types'
import { TextInput } from '#/components/Form/Input'
import { connect } from 'react-redux'
import { validatePasswordWithMessages } from '#/utils'

const styles = require('./styles.scss')

const validate = (values) => {
  const errors: typeof values = {}

  if (!values.new_password) {
    errors.new_password = 'Required.'
  }

  if (values.new_password) {
    const validatePasswordMessages = validatePasswordWithMessages(values.new_password)
    if (validatePasswordMessages) {
      errors.new_password = validatePasswordMessages
    }
  }

  if (!values.new_password_confirm) {
    errors.new_password_confirm = 'Required.'
  }

  if (values.new_password !== values.new_password_confirm) {
    errors.new_password_confirm = 'Passwords must match.'
  }

  return errors
}

const Form = (props: InjectedFormProps) => {
  return (
    <form id='resetPassword' className={styles.forgotPasswordForm} onSubmit={props.handleSubmit}>
      <div>
        <Label htmlFor='new_password'>New password</Label>
        <Field
          component={TextInput}
          name='new_password'
          type='password'
        />
        <Label htmlFor='new_password_confirm'>Confirm password</Label>
        <Field
          component={TextInput}
          name='new_password_confirm'
          type='password'
        />
        <Button submit form='resetPassword'>Submit</Button>
      </div>
    </form>
  )
}

const ResetPasswordForm = reduxForm({
  form: 'resetPassword',
  validate
})(Form)

interface StateProps {
  loading: boolean
  status: boolean
  error: Error
}

interface ActionProps {
  reset: typeof ResetPassword
}

class ResetPasswordPage extends React.Component<RouteProps & StateProps & ActionProps & RouteComponentProps> {

  submit = (token) => (values) => {
    const password = values.new_password
    this.props.reset({ token, password })
  }

  get instructionalCopy () {
    const { status } = this.props
    if (status) {
      return(
        <>
          Your password has been reset. Please try logging in.
        </>
      )
    } else {
      return null
    }
  }

  render () {
    const { loading, status, error, match } = this.props

    return (
      match.params.token &&
      <Page title='Reset Password' className={styles.forgotPassword}>
        <Container fullWidth className={styles.container}>
          <div className={styles.logoHolder}>
            <div className={styles.teledentLogo}><Logo /></div>
          </div>
          <div className={styles.forgot}>
            <h2>Reset Password</h2>
            <div className={styles.instructionalCopy}>{this.instructionalCopy}</div>
            { loading && <Loader /> }
            { error && <div className={styles.errorMessage}>Something went wrong. Please try again or contact your administrator. Error: {error.message}</div> }
            { (!loading && !status) && <ResetPasswordForm onSubmit={this.submit(match.params.token)} /> }
          </div>
        </Container>
        <div className={styles.haveAccount}>
          <p>Back to login page</p>
          <Button className={styles.loginBtn} onClick={() => this.props.history.push('/')} secondary inline transparent>Login</Button>
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
    reset: ResetPassword
  }
)(ResetPasswordPage)
