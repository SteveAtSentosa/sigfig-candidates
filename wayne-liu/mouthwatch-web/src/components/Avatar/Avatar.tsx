import * as React from 'react'
import WebcamHelper from './Webcam'
import FileInput from './FileInput'

export type AvatarType = 'default' | 'file' | 'webcam'
type AvatarProps = {
  onWebcam: (data: any) => void
  onFile: (data: any) => void
  onDefault: (data: any) => void
}

export default class Avatar extends React.Component<AvatarProps> {
  fileInputRef = React.createRef<FileInput>()

  state = {
    startWebcam: false,
    startFileChoice: false
  }

  useDefault = () => {
    // base avatar
    this.props.onDefault('default')
  }

  webcamSaved = (data) => {
    // base64
    this.setState({ startWebcam: false })
    this.props.onWebcam(data)
  }

  fileChoiceSaved = (data) => {
    this.setState({ startFileChoice: false })
    this.props.onFile(data)
  }

  render () {
    if (this.state.startWebcam) {
      return (
        <WebcamHelper
          onCancel={() => {
            this.setState({ startWebcam: false })
          }}
          onSaveCb={this.webcamSaved}
        />
      )
    }
    if (this.state.startFileChoice) {
      return (
        <FileInput
          onCancel={() => {
            this.setState({ startFileChoice: false })
          }}
          onSaveCb={this.fileChoiceSaved}
          ref={this.fileInputRef}
        />
      )
    }
    return (
      <div>
        <ul>
          <li><button onClick={this.useDefault}>Use Default Icon</button></li>
          <li><button onClick={() => this.setState({ startWebcam: true })}>Take Photo</button></li>
          <li>
            <button onClick={() => {
              this.setState({ startFileChoice: true }, () => {
                (this.fileInputRef as any).current.chooseFile()
              })
            }}>
              Choose Photo
            </button>
          </li>
        </ul>
      </div>
    )
  }
}
