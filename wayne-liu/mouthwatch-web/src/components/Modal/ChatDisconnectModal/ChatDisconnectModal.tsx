import * as Modal from '#/components/Modal'
import * as React from 'react'

import Button from '#/components/Button'
import { Props } from './types'
import { pick } from 'lodash'

const styles = require('./styles.scss')

class ChatDisconnectModal extends React.PureComponent<Props> {
  private handleRefresh = () => {
    this.props.disconnect()
    this.props.connect()
    this.closeModal()
  }

  private closeModal = () => {
    this.props.closeModal({ modal: 'chatDisconnect' })
  }

  render () {
    const { close, ...modalProps } = this.props

    return (
      <Modal.Wrapper
        size='sm'
        isOpen={true}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
        className={styles.chatDisconnectModal}
        onRequestClose={this.closeModal}
      >
        <Modal.Header>
          Messaging Disconnect
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <p>Messaging has disconnected please refresh before proceeding.</p>
          <Button onClick={this.handleRefresh}>Refresh</Button>
        </Modal.Body>
      </Modal.Wrapper>
    )
  }
}

export default ChatDisconnectModal
