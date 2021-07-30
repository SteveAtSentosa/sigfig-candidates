import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'
import { CaptureForm } from '#/components/QuickCreate'
import { Props } from './types'
import { pick } from 'lodash'

const styles = require('./styles.scss')

export default class CaptureModal extends React.PureComponent<Props> {

  getAppointmentData () {
    return ({
      appointment_start: new Date(),
      provider_id: this.props.loggedInUserId
    })
  }

  onSubmit = (values) => {
    this.props.createAppointment({ data: Object.assign(values, this.getAppointmentData()), redirectToCapture: true })
  }

  render () {
    const { close, createAppointment, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        onRequestClose={close}
        keyboard
        backdrop
        className={styles.captureModal}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>Add New Appointment</Modal.Header>
        <Modal.Body className={styles.body}>
          <CaptureForm onSubmit={this.onSubmit} />
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn submit form='captureCreate'>Start Capture</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}
