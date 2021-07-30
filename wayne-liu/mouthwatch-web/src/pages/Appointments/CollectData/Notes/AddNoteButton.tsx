import * as React from 'react'

import { Appt as Appointment, EntityId } from '#/types'

import AddNewNote from '#/components/Modal/AddNewNote'
import { AppState } from '#/redux'
import { CreateNote } from '#/actions/notes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadAppointment } from '#/actions/appointments'
import { connect } from 'react-redux'
import { faPlus } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface OwnProps {
  handleClick?: (e: any) => void
  appointmentId: EntityId
  appointment: Appointment | void
}

interface ActionProps {
  createNote: typeof CreateNote
  loadAppointment: typeof LoadAppointment
}

interface State {
  addModalIsOpen?: boolean
}

class AddNoteButton extends React.Component<OwnProps & ActionProps, State> {

  state = {
    addModalIsOpen: false
  }

  openModal = () => this.setState({ addModalIsOpen: true })
  closeModal = () => this.setState({ addModalIsOpen: false })

  createNote = (values) => {
    const valuesWithApptId = Object.assign({}, values, { appointment_id: this.props.appointmentId })
    this.props.createNote({ data: valuesWithApptId })
  }

  handleSubmit = (values) => {
    this.createNote(values)
    this.closeModal()
  }

  render () {
    return (
      <div>
        <div className={styles.addNoteButton} onClick={this.openModal}>
          <FontAwesomeIcon icon={faPlus}/>
          <span className={styles.title}>Add</span>
        </div>
        <div>
          <AddNewNote
            isOpen={this.state.addModalIsOpen}
            close={this.closeModal}
            handleSubmit={this.handleSubmit}
          />
        </div>
      </div>
    )
  }
}

export default connect<{}, ActionProps, OwnProps, AppState>(
  (state) => (state),
  {
    createNote: CreateNote,
    loadAppointment: LoadAppointment
  }
)(AddNoteButton)
