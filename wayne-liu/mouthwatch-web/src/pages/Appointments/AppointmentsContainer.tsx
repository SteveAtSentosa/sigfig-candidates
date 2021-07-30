import * as React from 'react'

import { AddNewAppointmentModal } from '#/components/Modal/AddNewAppointment'
import AppointmentsTable from './AppointmentsTable'
import Button from '#/components/Button'
import { Heading2 as Heading } from '#/components/Heading'

const styles = require('./styles.scss')

export default class AppointmentsContainer extends React.Component<{}> {
  state = {
    modalIsOpen: false
  }
  openModal = () => this.setState({ modalIsOpen: true })
  closeModal = () => this.setState({ modalIsOpen: false })

  render () {
    return (
      <div className={styles.appointmentsContainer}>
        <header>
          <div className={styles.heading}>
            <Heading>Appointments</Heading>
          </div>
          <div className={styles.button}>
            <Button skinnyBtn onClick={this.openModal}>New Appointment</Button>
          </div>
        </header>
        {
          <AppointmentsTable showSearch showPagination />
        }
        <AddNewAppointmentModal
          isOpen={this.state.modalIsOpen}
          close={this.closeModal}
        />
      </div>
    )
  }
}
