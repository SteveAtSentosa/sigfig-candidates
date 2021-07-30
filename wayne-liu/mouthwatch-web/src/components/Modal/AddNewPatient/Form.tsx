import * as React from 'react'

import { CheckboxInput, TextInput } from '#/components/Form/Input'
import { FormErrors, InjectedFormProps, reduxForm } from 'redux-form'
import { FormProps, FormValues } from './types'

import { DateField } from '#/components/DatePicker'
import Field from '#/components/Form/Field'
import { GroupsFormSection } from '#/components/Form/FormSections'
import { RequiredIndicator } from '#/components/Form/RequiredIndicator'
import { validateGroupsAndPractices } from '#/components/Form/FormSections/GroupsFormSection'
import validator from 'validator'

const styles = require('./styles.scss')

const validate = (values: FormValues) => {
  let errors: FormErrors<FormValues> = {}

  if (!values.first_name) {
    errors.first_name = 'Please enter a first name'
  }
  if (!values.last_name) {
    errors.last_name = 'Please enter a last name'
  }
  const dateEntered = new Date(values.dob)
  if (!values.dob) {
    errors.dob = 'Please enter a valid date of birth'
  } else if (dateEntered.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
    errors.dob = 'Please enter a valid date of birth'
  }
  if (values.email && !validator.isEmail(values.email)) {
    errors.email = 'Please enter a valid email'
  }

  const { groups, practices } = values
  const groups_practices = Object.assign({}, { groups, practices })
  errors = { ...errors, ...validateGroupsAndPractices(groups_practices) }

  return errors
}

export default reduxForm<FormValues, FormProps>({
  form: 'addNewPatient',
  validate
})((props: InjectedFormProps<FormValues, FormProps> & FormProps) => {
  return (
    <form id='addNewPatient' onSubmit={props.handleSubmit}>
      <div className={styles.modalContentContainer}>

        <div className={styles.fieldRow}>
          <div className={styles.fieldSection}>
            <label>First Name<RequiredIndicator /></label>
            <Field
              name='first_name'
              component={TextInput}
            />
          </div>
          <div className={styles.fieldSection}>
            <label>Middle Name</label>
            <Field
              name='middle_name'
              component={TextInput}
            />
          </div>
          <div className={styles.fieldSection}>
            <label>Last Name<RequiredIndicator /></label>
            <Field
              name='last_name'
              component={TextInput}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldSection}>
            <label>Gender</label>
            <Field
              name='gender'
              component={TextInput}
            />
          </div>
          <div className={styles.fieldSection}>
            <label>DOB<RequiredIndicator /></label>
            <Field
              name='dob'
              component={DateField}
              dateFormat='MM/dd/yyyy'
              strictParsing
              placeholderText='mm/dd/yyyy'
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <GroupsFormSection
            changeSelectedGroupId={props.changeSelectedGroupId}
            reduxFormChange={props.change}
            groupOptions={props.groupOptions}
            practiceOptions={props.practiceOptions}
          />
        </div>

        { props.isUnderage &&
          <span>This patient is a minor and email will be used for contacting the guardian.</span>
        }

        <div className={styles.fieldRow}>
          <div className={styles.fieldEmailSection}>
            <label>Email</label>
            <Field
              name='email'
              component={TextInput}
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldSubSection}>
            <Field
              name='send_invite'
              component={CheckboxInput}
              labelClass='inviteFieldLabel'
              text='Invite to patient portal'
              disabled={!props.hasValidEmail}
            />
          </div>
        </div>

      </div>
    </form>
  )
})
