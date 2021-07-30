import * as React from 'react'

import { Action } from './Action.wrapper'
import { AddNewAppointmentModal } from '#/components/Modal/AddNewAppointment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

export class NewAppointment extends React.Component<{}> {
  state = {
    modalIsOpen: false
  }
  openModal = () => this.setState({ modalIsOpen: true })
  closeModal = () => this.setState({ modalIsOpen: false })

  render () {
    return (
      <>
        <span className={styles.actionWrapper}>
          <Action
            icon={ <FontAwesomeIcon icon={faCalendarDay} /> }
            label='Appointment'
            onClick={this.openModal}
          />
        </span>
        <AddNewAppointmentModal
          isOpen={this.state.modalIsOpen}
          close={this.closeModal}
        />
      </>
    )
  }
}
