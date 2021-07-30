import * as React from 'react'

import { FormErrors, reduxForm } from 'redux-form'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import { TextInput } from '#/components/Form/Input'
import validator from 'validator'

const styles = require('./styles.scss')
export interface FormData {
  email: string
  one_time_password: string
}

export type Errors = FormErrors<FormData>

const validate = (values: FormData) => {
  const errors: Errors = {}

  if (!values.email) {
    errors.email = 'Required.'
  }

  if (values.email && !validator.isEmail(values.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!values.one_time_password) {
    errors.one_time_password = 'Please enter the password that was emailed to you.'
  }

  return errors
}

export const Form = reduxForm<FormData>({
  validate,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  form: 'register'
})((props) => (
  <div className={styles.register}>
    <h2>Register</h2>
    <div className={styles.registerFormContainer}>
      <form id={props.form} onSubmit={props.handleSubmit}>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Field
            component={TextInput}
            name='email'
            autoCapitalize='off'
          />
          <Label htmlFor='one_time_password'>One Time Password</Label>
          <Field
            component={TextInput}
            name='one_time_password'
            type='password'
          />
        </div>
      </form>
      <Button disabled={props.invalid} submit form={props.form}>Continue</Button>
    </div>
  </div>
))
