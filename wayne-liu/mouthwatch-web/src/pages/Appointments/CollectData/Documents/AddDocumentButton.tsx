import * as React from 'react'

import { AppState } from '#/redux'
import { Appt as Appointment } from '#/types'
import { CreateMedia } from '#/actions/media'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadAppointment } from '#/actions/appointments'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { faPlus } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface OwnProps {
  handleClick?: (e: any) => any
  appointmentId?: string
  appointment: Appointment | void
}

interface StateProps {
  postingMedia: boolean
  error: Error
}

interface ActionProps {
  createMedia: typeof CreateMedia
  loadAppointment: typeof LoadAppointment
  showNotificationPopUp: typeof ShowNotificationPopUp
}

interface State {
  docModalIsOpen?: boolean
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

class AddDocumentButton extends React.Component<OwnProps & ActionProps & StateProps, State> {

  state = {
    docModalIsOpen: false
  }

  allowedDocumentTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/rtf',
    'text/rtf',
    'model/stl',
    'application/octet-stream'
  ]

  fileInput = React.createRef<HTMLInputElement>()

  openFileInput = () => {
    this.fileInput.current.click()
  }

  componentDidMount () {
    const { appointment } = this.props
    this.fileInput.current.onchange = (e: HTMLInputEvent) => {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        if (!this.allowedDocumentTypes.includes(file.type)) {
          this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: Invalid file type. Try again.</div>) })
          return
        }
        this.props.createMedia({
          file,
          association: 'appointment',
          association_id: this.props.appointmentId,
          type: 'exam-doc',
          multiple: !(i === e.target.files.length - 1),
          patientId: appointment && appointment.patient_id
        })
      }
    }
  }

  render () {
    return (
      <div>
        <div className={styles.button} onClick={this.openFileInput}>
          <FontAwesomeIcon icon={faPlus}/>
          <span className={styles.title}>Add</span>
        </div>
        <input type='file' id='document' ref={this.fileInput} multiple hidden />
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    postingMedia: state.media.posting,
    error: state.media.error
  }),
  {
    createMedia: CreateMedia,
    loadAppointment: LoadAppointment,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(AddDocumentButton)
