import * as Modal from '#/components/Modal'
import * as React from 'react'

import AddNewTaskForm from '#/components/Form/Task/AddNewTaskForm'
import Button from '#/components/Button'
import { omit } from 'lodash'

const styles = require('./styles.scss')

interface Props {
  isOpen: boolean
  close: () => void
  handleSubmit: (values: any) => any
}

const AddNewTaskModal = (props: Props) => {
  const { close, ...modalProps } = props
  return (
    <Modal.Wrapper
      close={close}
      keyboard
      backdrop
      {...omit(modalProps, 'handleSubmit')}
    >
      <Modal.Header>Add New Task</Modal.Header>
      <Modal.Body className={styles.addNewTaskModalBody}>
        <AddNewTaskForm form='addNewTask' onSubmit={props.handleSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button skinnyBtn onClick={props.close} secondary>Cancel</Button>
        <Button skinnyBtn submit form='addNewTask'>Add</Button>
      </Modal.Footer>
    </Modal.Wrapper>
  )
}

export default AddNewTaskModal
