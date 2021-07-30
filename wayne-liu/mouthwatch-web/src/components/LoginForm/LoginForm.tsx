import * as React from 'react'

import { CheckboxInput, TextInput } from '#/components/Form/Input'
import { Errors, FormData, OwnProps, Props } from './types'

import { Button } from '@m***/library'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import { Link } from 'react-router-dom'
import { isEmail } from 'validator'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'

const styles = require('./styles.scss')

class Form extends React.PureComponent<Props> {

  private get renderEmailOrUsername () {
    const { email } = this.props
    const label = email ? 'Email' : 'Username'
    return (
    <>
      <Label htmlFor='username'>{label}</Label>
      <Field
        component={TextInput}
        autoCapitalize='off'
        name='username'/>
    </>
    )
  }

  private get renderRememberMe () {
    if (!this.props.rememberMe) return null

    return (
      <Field
        component={CheckboxInput}
        name='remember'
        text='Remember Me'/>
    )
  }

  render () {
    const { form, history } = this.props
    return (
      <form id={form} className={styles.loginForm} onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
        <div>

          {this.renderEmailOrUsername}

          <Label htmlFor='password'>Password</Label>
          <Field
            component={TextInput}
            name='password'
            type='password'
          />

          {this.renderRememberMe}

          <p>
            Forgot your password? <Link to={ { pathname: '/forgot-password', state: { prevPath: history.location.pathname } } }>Click here</Link>.
          </p>
          <Button skinnyBtn submit form='login'>Login</Button>
        </div>
      </form>
    )
  }
}

const validate = (values: FormData) => {
  const errors: Errors = {}

  if (!values.username) {
    errors.username = 'Please enter a username.'
  }

  if (!values.email) {
    errors.email = 'Please enter an email address.'
  }

  if (values.email && !isEmail(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Please enter a password.'
  }
  return errors
}

const LoginForm = withRouter(reduxForm<FormData, OwnProps>({
  form: 'login',
  enableReinitialize: true,
  validate
})(Form))

export default LoginForm
