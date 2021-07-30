import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { CreateMedia } from '#/actions/media'
import { connect } from 'react-redux'
import { AppState } from '#/redux'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { Appt as Appointment } from '#/types'
const styles = require('./styles.scss')

interface OwnProps {
  appointment: Appointment
  allowedDocumentTypes: string[]
}

interface StateProps {
  postingMedia: boolean
  error: Error
}

interface ActionProps {
  createMedia: typeof CreateMedia
  showNotificationPopUp: typeof ShowNotificationPopUp
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

class AddDocumentButton extends React.Component<OwnProps & ActionProps & StateProps> {
  fileInput = React.createRef<HTMLInputElement>()

  openFileInput = () => {
    this.fileInput.current.click()
  }

  componentDidMount () {
    const { appointment, allowedDocumentTypes } = this.props

    this.fileInput.current.onchange = (e: HTMLInputEvent) => {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        if (!allowedDocumentTypes.includes(file.type)) {
          this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: Invalid file type. Try again.</div>) })
          return
        }

        this.props.createMedia({
          file,
          association: 'appointment',
          association_id: appointment.id,
          type: 'exam-doc',
          multiple: !(i === e.target.files.length - 1),
          patientId: appointment.patient_id
        })
      }
    }
  }

  render () {
    return (
      <div>
        <div onClick={this.openFileInput}>
          <FontAwesomeIcon className={styles.icon} icon={faPlus} />
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
    showNotificationPopUp: ShowNotificationPopUp
  }
)(AddDocumentButton)
