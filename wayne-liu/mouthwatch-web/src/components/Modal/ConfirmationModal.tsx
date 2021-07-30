import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'
import { omit } from 'lodash'

interface Props extends Modal.BaseModalProps {
  onConfirm: () => void
  confirmationCopy: string
}

export class ConfirmationModal extends React.PureComponent<Props> {
  close = () => {
    this.props.close()
  }

  confirm = () => {
    this.props.onConfirm()
    this.close()
  }

  render () {
    const { confirmationCopy, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        {...omit(modalProps, 'onConfirm', 'confirmationCopy')}
      >
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>
          <p>{confirmationCopy}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn secondary onClick={this.close}>Cancel</Button>
          <Button skinnyBtn onClick={this.confirm}>Confirm</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default ConfirmationModal
