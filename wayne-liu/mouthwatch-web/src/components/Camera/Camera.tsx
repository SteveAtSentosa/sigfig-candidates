import * as React from 'react'

import { DefaultProps, Props } from './types'

import Controls from './Controls'
import { DataURLToBuffer } from '#/utils'
import SelectCaptureType from './SelectCaptureType'
import cn from 'classnames'
import { format } from 'date-fns'

const styles = require('./styles.scss')

class Camera extends React.PureComponent<Props> {

  constructor (props: Props) {
    super(props)
    this.feedHeight = props.height
    this.feedWidth = props.width

    this.onImportProvided(props)
    this.onVideoSaveProvided(props)

    if (props.videoOnly) {
      props.setCaptureType('video')
    }

    if (props.snapshotOnly) {
      props.setCaptureType('photo')
    }
  }

  private defaultRecorderOptions = {
    options: { mimeType: 'video/webm;codecs=vp8,opus' },
    ext: '.webm'
  }

  static defaultProps: DefaultProps = {
    height: 480,
    width: 640,
    onVideoCancel: (_file) => { /* no-op */ },
    onImport: (_file) => { /* no-op */ },
    onImageCapture: (_file) => { /* no-op */ },
    onVideoCapture: null,
    onVideoSave: null,
    videoOnly: false,
    snapshotOnly: false,
    showControls: false
  }

  private blobChunks: BlobPart[] = []
  private canvas = React.createRef<HTMLCanvasElement>()
  private liveFeed = React.createRef<HTMLVideoElement>()
  private mediaRecorder: MediaRecorder
  private recordedPreview = React.createRef<HTMLVideoElement>()

  public feedHeight: number
  public feedWidth: number

  componentDidMount () {
    this.initLiveFeed()
  }

  componentWillUnmount () {
    this.stopLiveFeed()
    this.stopPreview()
    this.props.reset()
  }

  componentDidUpdate (prevProps: Props) {
    if (!this.shouldShowRecorderPreview && !prevProps.isRecording) {
      this.stopPreview()
      this.blobChunks = []
      this.props.setVideoMode('liveFeed')
    }
  }

  private onImportProvided = ({ videoOnly, snapshotOnly, onImport }: Props) => {
    if ((videoOnly || snapshotOnly) && !onImport) {
      throw new Error('onImport prop necessary when not using \'videoOnly\' or \'snapshotOnly\'')
    }
  }

  private onVideoSaveProvided = ({ showControls, onVideoSave, onVideoCapture }: Props) => {
    if (showControls && !onVideoSave) {
      throw new Error('onVideoSave prop necessary when using \'showControls\' ')
    }

    if (!showControls && !onVideoCapture) {
      throw new Error('onVideoCapture prop necessary when not using \'showControls\' ')
    }
  }

  private get shouldShowRecorderPreview () {
    const { captureType, videoMode } = this.props
    const showRecordedPreview = (captureType === 'video') && (videoMode === 'recordedPreview')
    return showRecordedPreview
  }

  private handleOnCameraSwitch = () => {
    const { deviceType, facingMode, availableDevices, setFacingMode, setAvailableDevices } = this.props
    switch (deviceType) {
      case 'mobile':
        const mode = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(mode)
        return this.initLiveFeed()
      case 'desktop':
        const firstEntry = availableDevices.splice(0, 1)[0]
        const shiftedDevices = [...availableDevices, firstEntry]
        // turn off the other devices
        setAvailableDevices(shiftedDevices)
        this.stopLiveFeed()
        // re-focus the capture button
        const capture: HTMLElement = document.querySelector('#captureButton')
        capture.focus()
        return this.initLiveFeed()
      case 'unset':
        return
    }
  }

  private stopLiveFeed = () => {
    const { current: video } = this.liveFeed
    video.pause()
    if (video && video.srcObject && video.srcObject instanceof MediaStream) {
      video.srcObject && video.srcObject.getTracks().forEach(t => t.stop())
      video.src = null
    }
  }

  private stopPreview = () => {
    const { current: recordedPreview } = this.recordedPreview
    if (recordedPreview) {
      recordedPreview.pause()
      recordedPreview.src = null
    }
  }

  private mediaRecorderOnStart = (_event: Event) => {
    this.props.setRecording(true)
  }

  // NOTE: Save video
  private mediaRecorderOnStop = (_event: Event) => {
    const { setVideoMode, setRecording, setVideoFile, onVideoCapture, captureCameraMedia } = this.props
    const { options, ext } = this.defaultRecorderOptions
    const lastModified = new Date().getTime()
    const timeStamp = format(lastModified, 'YYYYDDMM-HHmmss')
    const videoFile = new File(this.blobChunks, timeStamp + ext, { type: options.mimeType, lastModified })
    this.blobChunks = []
    setRecording(false)
    setVideoFile(videoFile)
    this.setPreviewVideoSrc(videoFile)
    if (onVideoCapture) {
      captureCameraMedia(videoFile)
      onVideoCapture(videoFile)
      setVideoMode('liveFeed')
    } else {
      setVideoMode('recordedPreview')
    }

  }

  private setPreviewVideoSrc = (videoFile: File) => {
    const { current: recordedPreview } = this.recordedPreview
    const videoURL = URL.createObjectURL(videoFile)
    recordedPreview.src = videoURL
  }

  private mediaOnnDataAvailable = (event: BlobEvent) => this.blobChunks.push(event.data)

  private initLiveFeed = async () => {
    const { availableDevices, deviceType, facingMode, setAvailableDevices, setDeviceType } = this.props
    const { current: liveFeed } = this.liveFeed
      // Get access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const enumeratedDevices = await navigator.mediaDevices.enumerateDevices()
        // Grab all available media devices if we haven't already checked for available devices.
      const videoDevices: ConstrainDOMString[] = availableDevices.length ? availableDevices :
              enumeratedDevices.filter(d => d.kind === 'videoinput').map(d => d.deviceId)
        /// Tell the user he does not have any available devices.
      if (!videoDevices.length) {
        return this.failureNotification('No available devices. Check that device is not already in use.')
      }
      try {
          // Check if 'environment' value on facingMode is exists (This is only available on mobile)
        const constraints: MediaStreamConstraints = { video : (deviceType !== 'desktop') ? { facingMode: { exact: facingMode } } : { deviceId: videoDevices[0] } }
          // Attempt to connect video source. If this fails and produces an overcontrained error we know we're on mobile.
        const stream = await navigator.mediaDevices.getUserMedia({ ...constraints, audio: true })
        liveFeed.srcObject = stream
        setDeviceType(deviceType !== 'mobile' ? 'desktop' : 'mobile')
        await liveFeed.play()
      } catch (error) {
        console.error(error)
        switch (error.name) {
          case 'OverconstrainedError':
            setDeviceType('desktop')
            setAvailableDevices(videoDevices)
            return this.initLiveFeed()
          case 'NotReadableError':
            setAvailableDevices(videoDevices.slice(1, videoDevices.length - 1))
            return this.initLiveFeed()
          default:
            return this.failureNotification(error)
        }
      }
    }
  }

  private failureNotification = (message: string) => {
    return this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: {message}</div>) })
  }

  private successNotification = (message: string) => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>{message}</div>) })
  }

  private initRecorder = (stream: MediaStream) => {
    const { options } = this.defaultRecorderOptions
    const mediaRecorder = new MediaRecorder(stream, { mimeType: options.mimeType })
    mediaRecorder.onstart = this.mediaRecorderOnStart
    mediaRecorder.onstop = this.mediaRecorderOnStop
    mediaRecorder.ondataavailable = this.mediaOnnDataAvailable
    this.mediaRecorder = mediaRecorder
  }

  private handleOnVideoRecordStart = () => {
    const { current: liveFeed } = this.liveFeed
    const stream = liveFeed.srcObject as MediaStream

    this.initRecorder(stream)
    this.mediaRecorder.start()
  }

  private handleOnVideoRecordStop = () => {
    this.mediaRecorder.stop()
    this.mediaRecorder = null
  }

  private handleOnSnapshot = () => {
    const { current: canvas } = this.canvas
    const { current: liveFeed } = this.liveFeed
    const { captureCameraMedia, onImageCapture } = this.props
    const context = canvas.getContext('2d')
    context.drawImage(liveFeed, 0, 0, this.feedWidth, this.feedHeight)

    const uri = canvas.toDataURL()
    const buffer: Buffer = DataURLToBuffer(uri)

    const lastModified = new Date().getTime()
    const timeStamp = format(lastModified, 'YYYYDDMM-HHmmss')
    const image = new File([buffer], timeStamp + '.png', { type: 'image/png', lastModified })
    captureCameraMedia(image)
    this.successNotification('Snapshot added!')
    onImageCapture && onImageCapture(image)
  }

  private handleImport = (files: FileList) => {
    const { onImport, captureCameraMedia } = this.props
    const mediaFiles = Array.from(files)

    for (const file of mediaFiles) {
      captureCameraMedia(file)
    }
    this.successNotification('Media imported!')
    onImport(mediaFiles)
  }

  private handleOnSave = () => {
    const { captureCameraMedia, onVideoSave, videoFile, setVideoMode } = this.props
    captureCameraMedia(videoFile)
    this.successNotification('Video added!')
    onVideoSave(videoFile)
    setVideoMode('liveFeed')
    this.stopPreview()
  }

  private handleOnCancel = () => {
    const { setVideoFile, onVideoCancel, videoFile, setVideoMode } = this.props
    onVideoCancel(videoFile)
    setVideoFile(null)
    this.stopPreview()
    setVideoMode('liveFeed')
  }

  private get className () {
    return cn(styles.camera, {
      [styles.showRecordedPreview]: this.shouldShowRecorderPreview
    })
  }

  private get renderSelectCaptureType () {
    const { videoOnly, snapshotOnly } = this.props

    if (videoOnly || snapshotOnly) {
      return null
    }
    return (
      <SelectCaptureType onImport={this.handleImport}/>
    )
  }

  render () {
    return (
      <div className={this.className} style={ { height: this.feedHeight, width: this.feedWidth } }>
        {this.renderSelectCaptureType}
        <div className={styles.feed}>
          <video className={styles.liveFeed} ref={this.liveFeed} width={this.feedWidth} height={this.feedHeight} autoPlay muted />
          <video className={styles.recordedPreview} ref={this.recordedPreview} width={this.feedWidth} height={this.feedHeight} controls/>
          <canvas className={styles.canvas} width={this.feedWidth} height={this.feedHeight} ref={this.canvas} />
        </div>
        <Controls
          onVideoRecordStart={this.handleOnVideoRecordStart}
          onVideoRecordStop={this.handleOnVideoRecordStop}
          onSnapshot={this.handleOnSnapshot}
          onSave={this.handleOnSave}
          onCancel={this.handleOnCancel}
          onCameraSwitch={this.handleOnCameraSwitch}
          showExtraControls={this.props.showControls}
        />
      </div>
    )
  }
}

export default Camera
