import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { TextAreaInput, TextInput } from '#/components/Form/Input'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'

import { pick } from 'lodash'

const styles = require('./styles.scss')

interface Props {
  isOpen: boolean
  close: () => void
  handleSubmit: (values: any) => void
  initialValues?: any
  editNote?: boolean
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

interface FormProps {
  headerText: string
  formAction: string
}

const Form = reduxForm<{}, FormProps>({
  form: 'add_new_note',
  validate
})((props: InjectedFormProps & FormProps) => (
  <>
    <Modal.Header>{props.headerText}</Modal.Header>
    <Modal.Body>
      <form id={props.formAction} onSubmit={props.handleSubmit}>
        <div>
          <Grid>
            <Column col={12}>
              <div className={styles.newTaskSection}>
                <strong>Title: </strong>
                <Field
                  name='title'
                  component={TextInput}
                  maxLength={255}
                />
              </div>
              <div className={styles.noteBodyTextArea}>
                <strong>Body: </strong>
                <Field
                  name='body'
                  maxLength={60000}
                  component={TextAreaInput}
                />
              </div>
            </Column>
          </Grid>
        </div>
      </form>
    </Modal.Body>
  </>

))

const AddNewNoteModal = (props: Props) => {
  const { close, initialValues, editNote, ...modalProps } = props
  const buttonText = editNote ? 'Save' : 'Add Note'
  const headerText = editNote ? 'Save' : 'Add New Note'
  const cancelButtonText = editNote ? 'Discard' : 'Cancel'
  const formAction = editNote ? 'edit_note' : 'add_new_note'

  return (
    <Modal.Wrapper
      size='md'
      onHide={close}
      backdrop
      keyboard
      {...pick(modalProps, Modal.keysOfBaseModalProps)}
    >
      <Form formAction={formAction} headerText={headerText} initialValues={initialValues} onSubmit={props.handleSubmit} />
      <Modal.Footer>
        <Button skinnyBtn onClick={props.close} secondary>{cancelButtonText}</Button>
        <Button skinnyBtn form={formAction}>{buttonText}</Button>
      </Modal.Footer>
    </Modal.Wrapper>
  )
}

export default AddNewNoteModal
