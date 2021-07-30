import * as React from 'react'

import { faCamcorder, faCameraAlt, faFileImport } from '@fortawesome/pro-light-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Props } from './types'
import cn from 'classnames'

const styles = require('./styles.scss')

class SelectDevice extends React.PureComponent<Props> {

  private import = React.createRef<HTMLInputElement>()

  private get className () {
    const { captureType } = this.props
    return {
      photo: cn({ [styles.selected]: captureType === 'photo' }),
      video: cn({ [styles.selected]: captureType === 'video' }),
      import: cn({ [styles.selected]: captureType === 'import' })
    }
  }

  private handlePhotoSelect = () => this.props.setCaptureType('photo')
  private handleVideoSelect = () => this.props.setCaptureType('video')
  private handleImportSelect = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const { current: importButton } = this.import
    this.props.setCaptureType('import')
    importButton.click()
  }

  private handleImportOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onImport(e.target.files)
    this.props.setCaptureType('photo')
  }

  private get renderVideoButton () {
    return (
      window.MediaRecorder &&
      <button className={this.className.video} onClick={this.handleVideoSelect}>
        <div><FontAwesomeIcon icon={faCamcorder} size='2x'/></div>
        <span>Video</span>
      </button>
    )

  }

  render () {
    return (
      <div className={styles.selectCaptureType}>
        <button className={this.className.photo} onClick={this.handlePhotoSelect}>
          <div><FontAwesomeIcon icon={faCameraAlt} size='2x'/></div>
          <span>Photo</span>
        </button>
        {this.renderVideoButton}
        <button className={this.className.import} onClick={this.handleImportSelect}>
          <div><FontAwesomeIcon icon={faFileImport} size='2x'/></div>
          <span>Import</span>
          <input type='file' id='import' ref={this.import} onChange={this.handleImportOnChange} multiple hidden accept='.webm, .jpeg, .jpg, .png' />
        </button>
      </div>
    )
  }
}

export default SelectDevice
