import * as Modal from '#/components/Modal'
import * as React from 'react'

import { EntityId, Note } from '#/types'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import { DeleteNote } from '#/actions/notes'
import Loader from '#/components/Loader'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { pick } from 'lodash'

interface Props extends Modal.BaseModalProps {
  note: Note
  mediaId?: EntityId
  patientId?: EntityId
  appointmentId?: EntityId
}

interface StateProps {
  deleting: boolean
  error: Error
  message: string
}

interface ActionProps {
  deleteNote: typeof DeleteNote
  showNotificationPopUp: typeof ShowNotificationPopUp
}

export class DeletePatientModal extends React.Component<Props & StateProps & ActionProps & RouteComponentProps> {
  successAPIResult = () => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>Note deleted successfully!</div>) })
  }

  failureAPIResult = (error: Error) => {
    return this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: {error.message}</div>) })
  }

  delete = () => {
    const { note, appointmentId, mediaId, patientId } = this.props
    if (note) {
      this.props.deleteNote({ id: note.id, appointmentId: appointmentId, mediaId: mediaId, patientId: patientId })
    }
  }

  close = () => {
    this.props.close()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (!this.props.error) {
        this.close()
        this.successAPIResult()
      } else {
        this.close()
        this.failureAPIResult(this.props.error)
      }
    }
  }

  render () {
    const { close, note, deleting, error, message, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>
          {
            deleting
              ?
              <Loader />
              :
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <p>
                  {message && message} Deleted notes and their associated records cannot be recovered through the interface.
            </p>
                <p>Are you sure you would like to delete this note?</p>
              </div>
          }

        </Modal.Body>
        <Modal.Footer>
          {
            !deleting &&
            <>
              <Button skinnyBtn secondary onClick={this.close}>{error ? 'Close' : 'Cancel'}</Button>
              <Button skinnyBtn onClick={this.delete}>Confirm</Button>
            </>
          }
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, Props, AppState>(
  (state) => ({
    deleting: state.notes.delete.deleting,
    error: state.patients.delete.error,
    message: state.patients.delete.message
  }),
  {
    deleteNote: DeleteNote,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(DeletePatientModal))
