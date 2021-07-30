import * as React from 'react'
import Webcam from 'react-webcam'

const styles = require('./styles.scss')

export const DisplayWebcamImage = ({ src }) => (
  <div className={styles.avatar_image_wrapper}>
    <img className={styles.avatar_image} src={src} />
  </div>
)

type WebcamHelperProps = {
  onSaveCb: (e) => void
  onCancel: () => void
}
export default class WebcamHelper extends React.Component<WebcamHelperProps> {
  webcamRef = React.createRef<Webcam>()

  state = {
    showWebcam: true,
    showPhotoPreview: false,
    takenPhoto: null
  }

  onTakePhoto = () => {
    const imageSrc = (this.webcamRef as any).current.getScreenshot()
    this.setState({
      takenPhoto: imageSrc,
      showPhotoPreview: true,
      showWebcam: false
    })
  }
  cancel = () => {
    this.setState({
      showPhotoPreview: false,
      takenPhoto: null,
      showWebcam: true
    })
    this.props.onCancel()
  }
  savePhoto = () => {
    this.props.onSaveCb(this.state.takenPhoto)
    this.setState({
      showPhotoPreview: false,
      showWebcam: false
    })
    // callback
  }
  retakePhoto = () => {
    this.setState({
      showPhotoPreview: false,
      takenPhoto: null,
      showWebcam: true
    })
  }
  _renderShowPhotoArea = () => {
    if (!this.state.showWebcam) {
      return false
    }
    return (
      <div>
        <div className={styles.avatar_image_wrapper}>
          <Webcam
            audio={false}
            ref={this.webcamRef}
            screenshotFormat='image/jpeg'
            className={styles.avatar_image}
          />
        </div>
        <button onClick={this.cancel}>Cancel</button>
        <button onClick={this.onTakePhoto}>Take Photo</button>
      </div>
    )
  }
  _renderPhotoPreview = () => {
    if (!this.state.showPhotoPreview) {
      return false
    }
    return (
      <div>
        <DisplayWebcamImage src={this.state.takenPhoto} />
        <button onClick={this.cancel}>Cancel</button>
        <button onClick={this.retakePhoto}>Retake</button>
        <button onClick={this.savePhoto}>Save</button>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this._renderShowPhotoArea()}
        {this._renderPhotoPreview()}
      </div>
    )
  }
}
