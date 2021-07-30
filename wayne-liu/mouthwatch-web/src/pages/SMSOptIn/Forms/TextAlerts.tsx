import { FormData, FormProps } from './types'
import { InjectedFormProps, reduxForm } from 'redux-form'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import { PhoneField } from '#/components/Form/CommonFields'
import { RadioInput } from '#/components/Form/Input'
import React from 'react'
import { validate } from './validation'

const styles = require('./styles.scss')

class TextAlertsForm extends React.PureComponent<InjectedFormProps<FormData, FormProps> & FormProps> {

  render () {
    const { form, handleSubmit, invalid, showPhoneField } = this.props
    return (
        <div className={styles.register}>
          <h2>Text Alerts</h2>
          <div className={styles.registerFormContainer}>
            <form id={form} onSubmit={handleSubmit}>
              <div>
                <p>
                  You can receive text message alerts about new messages, video
                  conferences, and upcoming appointments.
                </p>
                <Field
                  component={RadioInput}
                  name='send_text_alerts'
                  text='Yes - Notify me by SMS text message'
                  value={'yes'}
                  parse={() => true}
                />

                <Field
                  component={RadioInput}
                  name='send_text_alerts'
                  text='No - I prefer to be notified by email only'
                  value={'no'}
                  parse={() => false}
                />
                {
                  showPhoneField
                  ? <div className={styles.checkboxContainer}>
                      <Label htmlFor='phone'>Confirm your mobile phone number below.</Label>
                      <PhoneField name='phone' />
                    </div>
                  : null
                }
              </div>
            </form>
            <Button className={styles.submit} disabled={invalid} submit form={form}>Submit</Button>
          </div>
        </div>
    )
  }
}

export const Form = reduxForm<FormData, FormProps>({
  validate,
  forceUnregisterOnUnmount: true,
  form: 'registerTextAlerts'
})(TextAlertsForm)
