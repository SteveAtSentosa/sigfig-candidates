import * as React from 'react'
import { FormErrors, reduxForm } from 'redux-form'
import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import { TextInput } from '#/components/Form/Input'

const styles = require('./styles.scss')

export interface FormData {
  temporaryPassword: string
}
export type ConfirmErrors = FormErrors<FormData>

const validate = (values: FormData) => {
  const errors: ConfirmErrors = {}

  if (!values.temporaryPassword) {
    errors.temporaryPassword = 'Please enter an email address.'
  }
  return errors
}

export const Form = reduxForm<FormData>({
  validate,
  form: 'confirmRegister'
})((props) => (
    <div className={styles.register}>
    <h2>Register</h2>
      <div className={styles.registerFormContainer}>
      <form id={props.form} onSubmit={props.handleSubmit}>
        <div>
          <p>
            You have been emailed a temporary password.
            Enter it below to confirm your email address.
            Check your spam folder if you do not see it.
          </p>
          <Label htmlFor='temporaryPassword'>Temporary Password</Label>
          <Field
            component={TextInput}
            name='temporaryPassword'
            type='password'
          />
        </div>
      </form>
      <Button disabled={props.invalid} submit form={props.form}>Register</Button>
      </div>
    </div>
))
