import * as Modal from '#/components/Modal'
import * as React from 'react'

import AddNewAppointmentForm from '#/components/Form/Appointment/AddNewAppointmentForm'
import Button from '#/components/Button'
import { Props } from './types'
import { omit } from 'lodash'

const styles = require('./styles.scss')

const initialFormValues = {
  patient_provider_location: {
    patient_send_email: false,
    provider_send_email: false
  }
}

export default class AddNewAppointmentModal extends React.PureComponent<Props> {
  private addNewAppointment = (values) => {
    const { close, afterSubmit, createAppointment } = this.props

    createAppointment({ data: Object.assign(values, values.patient_provider_location) })

    if (afterSubmit) {
      afterSubmit(values)
    }
    close()
  }

  render () {
    const { close, afterSubmit, createAppointment, ...modalProps } = this.props

    return (
      <Modal.Wrapper
        size='md'
        close={close}
        backdrop
        keyboard
        {...omit(modalProps, 'patientProviderLocationValues')}
      >
        <Modal.Header>Add New Appointment</Modal.Header>
        <Modal.Body className={styles.addNewAppointmentModalBody}>
          <AddNewAppointmentForm
            form='addNewAppointment'
            onSubmit={this.addNewAppointment}
            initialValues={initialFormValues}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn secondary onClick={close}>Close</Button>
          <Button skinnyBtn submit form='addNewAppointment'>Add</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}
