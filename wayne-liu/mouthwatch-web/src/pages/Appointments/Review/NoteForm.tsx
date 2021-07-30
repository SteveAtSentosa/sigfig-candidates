import { InjectedFormProps, reduxForm } from 'redux-form'
import { TextAreaInput, TextInput } from '#/components/Form/Input'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import React from 'react'

const styles = require('./styles.scss')

interface FormData {
  title?: string
  body?: string
}

interface FormProps {
  onCancel: () => void
}

const validate = (values) => {
  const errors: typeof values = {}

  if (!values.title) {
    errors.title = 'Required'
  }

  if (!values.body) {
    errors.body = 'Required'
  }

  return errors
}

const Form = reduxForm<FormData, FormProps>({
  form: 'add_new_note',
  validate
})((props: InjectedFormProps<FormData, FormProps> & FormProps) => (
  <>
    <form id='add_new_note' className={styles.form} onSubmit={values => {
      props.handleSubmit(values)
      props.reset()
    }}>
      <span className={styles.formLabel}>Title</span>
      <Field
        name='title'
        component={TextInput}
        maxLength={255}
      />
      <span className={styles.formLabel}>Note</span>
      <Field
        name='body'
        component={TextAreaInput}
        maxLength={60000}
      />
    </form>
    <div className={styles.formButtons}>
      <Button skinnyBtn className={styles.formButton} secondary onClick={props.onCancel}>Cancel</Button>
      <Button skinnyBtn className={styles.formButton} disabled={props.invalid} submit form='add_new_note'>Save</Button>
    </div>
  </>
))

export default Form
