import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'

export default class PatientWelcomeModal extends React.PureComponent<Modal.BaseModalProps> {
  render () {
    const { close, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        {...modalProps}
      >
        <Modal.Header>Welcome to the TeleDent Patient Portal!</Modal.Header>
        <Modal.Body>
            <div>
              <p>Easily communicate with your providers from this portal. You can send messages, attach images and join a video conference from here. To view the message and respond, select their name in the sidebar.</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn onClick={close}>Okay</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}
