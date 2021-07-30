import { CheckboxInputWithHtmlLabel, TextInput } from '#/components/Form/Input'
import { FormErrors, InjectedFormProps, reduxForm } from 'redux-form'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import { GroupConsentPolicy } from '#/types'
import { GroupConsentPolicyModal } from '#/components/Modal'
import Label from '#/components/Form/Label'
import React from 'react'
import { validatePasswordWithMessages } from '#/utils'

const styles = require('./styles.scss')

export interface FormData {
  password: string
  confirmPassword: string
}

export type Errors = FormErrors<FormData>

const validate = (values: FormData) => {
  const errors: Errors = {}
  const { password, confirmPassword, termsAgreed, consentPolicyAgreed } = values

  if (!password) {
    errors.password = 'Required'
  } else {
    const validatePasswordMessages = validatePasswordWithMessages(password)
    if (validatePasswordMessages) {
      errors.password = validatePasswordMessages
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Required'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  if (!termsAgreed) {
    errors.termsAgreed = 'Required.'
  }

  if (!consentPolicyAgreed) {
    errors.consentPolicyAgreed = 'Required.'
  }

  return errors
}

export interface FormData {
  password: string
  confirmPassword: string
  termsAgreed: boolean
  consentPolicyAgreed: boolean
}

interface FormProps {
  consentPolicies: GroupConsentPolicy[]
}

class PwForm extends React.PureComponent<InjectedFormProps<FormData, FormProps> & FormProps> {
  state = {
    consentPolicyModalOpen: false
  }

  handleConsentPolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    this.setState({ consentPolicyModalOpen: true })
  }

  render () {
    const { form, handleSubmit, invalid, consentPolicies } = this.props
    return (
      <>
        <div className={styles.register}>
        <h2>Set Your Password</h2>
          <div className={styles.registerFormContainer}>
          <form id={form} onSubmit={handleSubmit}>
            <div>
              <p>
                Set your password below and you'll be ready to
                start talking with your provider. Passwords must
                be at least 10 characters and contain one uppercase,
                one lowercase, and one special character.
              </p>
              <Label htmlFor='password'>New Password</Label>
              <Field
                component={TextInput}
                name='password'
                type='password'
              />
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Field
                component={TextInput}
                name='confirmPassword'
                type='password'
              />
              <div className={styles.checkboxContainer}>
                <Field
                  component={CheckboxInputWithHtmlLabel}
                  name='termsAgreed'
                  id='termsAgreed'
                  type='checkbox'
                  className={styles.field}
                  checkboxClass={styles.checkbox}
                  htmlContent={
                    <>
                      I agree to the privacy policy and the terms and conditions.
                    </>
                  }
                />
                <Field
                  component={CheckboxInputWithHtmlLabel}
                  name='consentPolicyAgreed'
                  id='consentPolicyAgreed'
                  type='checkbox'
                  checkboxClass={styles.checkbox}
                  htmlContent={
                    <>
                      I have read and understand the <a href='#' onClick={this.handleConsentPolicyClick}>consent policy</a> and, on my own behalf or on behalf of my dependents, agree to receive services.
                    </>
                  }
                />
              </div>
            </div>
          </form>
          <Button className={styles.submit} disabled={invalid} submit form={form}>Submit</Button>
          </div>
        </div>
        <GroupConsentPolicyModal
          isOpen={this.state.consentPolicyModalOpen}
          consentPolicies={consentPolicies}
          close={() => this.setState({ consentPolicyModalOpen: false })}
          agree={() => {
            this.setState({ consentPolicyModalOpen: false })
            this.props.change('consentPolicyAgreed', true)
          }}
        />
      </>
    )
  }
}

export const Form = reduxForm<FormData, FormProps>({
  validate,
  forceUnregisterOnUnmount: true,
  form: 'register'
})(PwForm)
