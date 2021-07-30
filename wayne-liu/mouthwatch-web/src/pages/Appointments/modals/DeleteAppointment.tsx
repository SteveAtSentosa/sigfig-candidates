import * as Modal from '#/components/Modal'
import * as React from 'react'

import { ClearDeleteError, DeleteAppointment } from '#/actions/appointments'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import { EntityId } from '#/types'
import Loader from '#/components/Loader'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { pick } from 'lodash'

const styles = require('./styles.scss')

interface Props extends Modal.BaseModalProps {
  patientId: EntityId
  appointmentId: EntityId
}
interface StateProps {
  deleting: boolean
  error: Error
}
interface ActionProps {
  deleteAppointment: typeof DeleteAppointment
  clearDeleteError: typeof ClearDeleteError
  showNotificationPopUp: typeof ShowNotificationPopUp
}

export class DeleteAppointmentModal extends React.Component<Props & StateProps & ActionProps & RouteComponentProps> {
  successAPIResult = () => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>Appointment deleted</div>) })
  }
  delete = () => {
    const { appointmentId, patientId } = this.props
    this.props.deleteAppointment({ id: appointmentId, patientId })
  }
  close = () => {
    this.props.clearDeleteError()
    this.props.close()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (!this.props.error) {
        this.close()
        this.successAPIResult()
        this.props.history.replace(`/patients/detail/${this.props.patientId}/appointments`)
      }
    }
  }

  render () {
    const { close, appointmentId, deleting, error, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        className={styles.wrapper}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>{error ? 'Unable to Delete Appointment' : 'Confirmation'}</Modal.Header>
        <Modal.Body>
          {
            deleting
            ?
            <Loader />
            :
            <div style={{ padding: '24px', textAlign: 'center' }}>
              {
                error
                ?
                <p>{error.message}</p>
                :
                <>
                  <p>Deleted appointments and their associated records cannot be recovered through the interface.</p>
                  <p>Are you sure you would like to delete this appointment?</p>
                </>
              }

            </div>
          }

        </Modal.Body>
        <Modal.Footer>
          {
            !deleting &&
            <Button skinnyBtn secondary onClick={this.close}>{error ? 'Close' : 'Cancel'}</Button>
          }
          {
            !deleting && !error &&
            <Button skinnyBtn onClick={this.delete}>Confirm</Button>
          }
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, Props, AppState>(
  (state) => ({
    deleting: state.appointments.delete.deleting,
    error: state.appointments.delete.error
  }),
  {
    deleteAppointment: DeleteAppointment,
    clearDeleteError: ClearDeleteError,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(DeleteAppointmentModal))
