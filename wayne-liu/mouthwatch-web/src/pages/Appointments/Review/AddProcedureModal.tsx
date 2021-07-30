import * as Modal from '#/components/Modal'
import * as React from 'react'

import AddProcedure from '#/components/AddProcedure'
import Button from '#/components/Button'
import { EntityId } from '#/types'

interface Props {
  showModal: boolean
  closeModal: () => void
  patientId: EntityId
  appointmentId: EntityId
}

class AddProcedureModal extends React.Component<Props> {
  state = {
    existingSelection: [],
    showCreateNewProcedure: false
  }

  render () {
    const { closeModal, showModal, patientId, appointmentId } = this.props
    return (
      <Modal.Wrapper
        onHide={closeModal}
        backdrop
        keyboard
        isOpen={showModal}>
        <Modal.Header>
          Add Procedure
        </Modal.Header>
        <Modal.Body>
          <AddProcedure
            fetchPatientData
            patientId={patientId}
            afterSubmit={closeModal}
            appointmentId={appointmentId}
            initialValues={{ status: 'Proposed' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Cancel</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default AddProcedureModal
