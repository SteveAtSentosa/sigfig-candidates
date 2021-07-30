import * as Modal from '#/components/Modal'
import * as React from 'react'

import { FormData, FormProps, Props } from './types'
import { FormErrors, reduxForm } from 'redux-form'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextInput } from '#/components/Form/Input'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { isEmail } from 'validator'

const styles = require('./styles.scss')

const validate = (values: FormData) => {
  const errors: FormErrors<FormData> = {}
  if (!values.email) {
    errors.email = 'Please enter an email address.'
  }

  if (values.email && !isEmail(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  return errors
}

const Form: React.FunctionComponent<FormProps> = (props) => {

  return (
    <form id={props.form} onSubmit={props.handleSubmit}>
      Patient doesn't have an email associated with their account. Please provide one:
      <div>
        <Field
          className={styles.email}
          component={TextInput}
          isMulti
          name='email' />
        <Button disabled={props.invalid} className={styles.btnEmail} inline submit form={props.form}>Update</Button>
      </div>
    </form>
  )
}

const AddEmail = reduxForm<{}>({ validate })(Form)

class SendTreatmentPlanModal extends React.PureComponent<Props> {

  private sendTreatmentPlan = () => {
    const { treatmentPlanId, sendTreatmentPlanToPatient } = this.props
    sendTreatmentPlanToPatient({ treatmentPlanId, navigateToChat: this.navigateToProviderChat })
    this.closeModal()
  }

  private navigateToProviderChat = () => {
    const { history } = this.props
    history.push('/provider-chat/' + this.chatUser.id)
  }

  private updatePatient = (values: FormData) => {
    const { updatePatient, patientId } = this.props
    updatePatient({ id: patientId, patient: { email: { value: values.email, op: 'add' } }, updated_at: Date.now().toString() })
  }

  private closeModal = () => {
    this.props.closeModal({ modal: 'sendTreatmentPlan' })
  }

  get chatUser () {
    const { patientId, chatUsers } = this.props
    for (const chatUser of chatUsers) {
      if (chatUser.patient && chatUser.patient.id === patientId) {
        return chatUser
      }
    }
  }

  render () {
    const { isOpen } = this.props

    return (
      <Modal.Wrapper
        size='md'
        isOpen={isOpen}
        keyboard
        close={this.closeModal}
        onRequestClose={this.closeModal}
        backdrop
        className={styles.sendTreatmentPlanModal}
      >
        <Modal.Header>
          <h5 className={styles.heading}>Send Treatment Plan</h5>
          <span onClick={this.closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <h6>Do you want to send treatment to patient?</h6>
          {!this.chatUser && <AddEmail form='addEmail' onSubmit={this.updatePatient} />}
          <div>
            <Button disabled={!(this.chatUser)} inline className={styles.btn} onClick={this.sendTreatmentPlan}>Yes</Button>
            <Button inline secondary className={styles.btn} onClick={this.closeModal}>No</Button>
          </div>
        </Modal.Body>
      </Modal.Wrapper>
    )
  }
}

export default SendTreatmentPlanModal
