import * as React from 'react'

import { AddNewAppointmentModal } from '#/components/Modal/AddNewAppointment'

export default class NewAppointmentButton extends React.Component<{}> {
  state = {
    modalIsOpen: false
  }
  openModal = () => this.setState({ modalIsOpen: true })
  closeModal = () => this.setState({ modalIsOpen: false })

  render () {
    return (
      <>
        <div onClick={this.openModal} style={{ cursor: 'pointer' }}>
          <img src='/static/images/icon_appointment_add.png' />
        </div>
        <AddNewAppointmentModal
          isOpen={this.state.modalIsOpen}
          close={this.closeModal}
        />
      </>
    )
  }
}
