import * as React from 'react'

import { faCamera, faCircle, faStop } from '@fortawesome/free-solid-svg-icons'

import Button from '#/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Props } from './types'
import cn from 'classnames'
import { faCameraAlt } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

class Controls extends React.PureComponent<Props> {

  private handleVideoRecordStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.setRecording(true)
    this.props.onVideoRecordStart()
    event.currentTarget.focus()
  }

  private handleVideoRecordStop = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.setRecording(false)
    this.props.onVideoRecordStop()
    event.currentTarget.focus()
  }

  private get renderVideoRecord () {
    const { captureType, videoMode, isRecording } = this.props
    if (captureType === 'video' && videoMode === 'liveFeed') {
      return (
        <button id='captureButton' className={styles.recordButton} onClick={ isRecording ? this.handleVideoRecordStop : this.handleVideoRecordStart}>
          <FontAwesomeIcon size='lg' icon={ isRecording ? faStop : faCircle } />
        </button>
      )
    }
  }

  private handleSnapshot = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.onSnapshot()
    event.currentTarget.focus()
  }

  private get renderSnapshot () {
    const { captureType } = this.props
    if (captureType === 'photo') {
      return (
        <button id='captureButton' className={styles.snapshotButton} onClick={this.handleSnapshot} autoFocus>
          <FontAwesomeIcon size='lg' icon={ faCameraAlt } />
        </button>
      )
    }
  }

  private get renderVideoCompleteButtons () {
    const { captureType, videoMode, onCancel, onSave } = this.props
    if (captureType === 'video' && videoMode === 'recordedPreview') {
      return (
        <div className={styles.btnsWrapper}>
          <Button skinnyBtn className={styles.startOverBtn} inline onClick={onCancel}>Start Over</Button>
          <Button skinnyBtn inline onClick={onSave}>Attach</Button>
        </div>
      )
    }
  }

  private get className () {
    const { availableDevices, isRecording } = this.props
    return cn(styles.controls, {
      [styles.devicesUnavailable]: availableDevices.length === 1,
      [styles.isRecording]: isRecording
    })
  }

  render () {
    return (
      <>
        <div className={this.className}>
          <span className={styles.changeCamera} onClick={this.props.onCameraSwitch}>
            <FontAwesomeIcon size='2x' icon={faCamera} />
            <p>Change Camera</p>
          </span>
          {this.renderSnapshot}
          {this.renderVideoRecord}
        </div>
        {this.props.showExtraControls && this.renderVideoCompleteButtons}
      </>
    )
  }
}

export default Controls
