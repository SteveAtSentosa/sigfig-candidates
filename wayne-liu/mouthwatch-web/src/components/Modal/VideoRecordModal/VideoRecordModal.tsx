import * as Modal from '#/components/Modal'
import * as React from 'react'

import Camera from '#/components/Camera'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Props } from './types'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { pick } from 'lodash'

const styles = require('./styles.scss')

class VideoRecordModal extends React.PureComponent<Props> {
  private handleVideoSave = (videoFile: File) => {
    this.props.attachVideoFile(videoFile)
    this.closeModal()
  }

  private closeModal = () => {
    this.props.closeModal({ modal: 'videoRecord' })
  }

  render () {
    const { close, ...modalProps } = this.props

    return (
      <Modal.Wrapper
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
        keyboard
        backdrop
        onRequestClose={this.closeModal}
      >
        <Modal.Header>
          Record Video Message
          <span onClick={() => this.props.closeModal({ modal: 'videoRecord' })}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          {modalProps.isOpen && <Camera width={533} height={400} videoOnly showControls onVideoSave={this.handleVideoSave} />}
        </Modal.Body>
      </Modal.Wrapper>
    )
  }
}

export default VideoRecordModal
