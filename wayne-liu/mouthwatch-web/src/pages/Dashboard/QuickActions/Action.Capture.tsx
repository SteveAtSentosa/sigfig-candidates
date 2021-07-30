import * as React from 'react'

import { Action } from './Action.wrapper'
import CaptureModal from '#/components/Modal/CaptureModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface State {
  modalIsOpen: boolean
}

class Capture extends React.PureComponent<{}, State> {
  state: State = {
    modalIsOpen: false
  }

  private openModal = () => this.setState({ modalIsOpen: true })
  private closeModal = () => this.setState({ modalIsOpen: false })

  render () {
    return (
      <span className={styles.actionWrapper}>
        <Action
          icon={ <FontAwesomeIcon icon={faCamera}/> }
          label='Capture'
          onClick={this.openModal}
        />
        <CaptureModal
          isOpen={this.state.modalIsOpen}
          backdrop
          keyboard
          onHide={this.closeModal}/>
      </span>
    )
  }
}

export default Capture
