import * as Modal from '#/components/Modal'
import * as React from 'react'
import * as mime from 'mime-types'
import * as vmsg from 'vmsg'

import { Props, State } from './types'
import { faCircle, faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons'

import Button from '#/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { debounce } from 'lodash'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { format } from 'date-fns'
import { sanitizeFilename } from '#/utils'

const styles = require('./styles.scss')

const recorder = new vmsg.Recorder({
  wasmURL: '/static/vmsg.wasm'
})

class AudioRecordingModal extends React.PureComponent<Props, State> {

  state: State = {
    blob: null,
    title: '',
    isLoading: false,
    isRecording: false,
    recording: null,
    secondsRecorded: undefined,
    isPlaying: false,
    isAboutToNavigate: false,
    audioData: new Uint8Array(0)
  }

  /* Properties for audio analysis */
  audioContext: AudioContext
  analyser: AnalyserNode
  dataArray: Uint8Array
  source: MediaStreamAudioSourceNode
  rafId: number
  THRESHOLD = 180
  TIME_BETWEEN_ALERTS = 30000
  silenceTimer: NodeJS.Timeout

  /* Properties for audio recording */
  timer: NodeJS.Timeout
  elapsedTime: number
  audio = new Audio()
  unsubscribeFromHistory

  alertUserOfNoSpeechDetected = debounce(() => {
    alert('You haven\'t spoken in a while, if there\'s no speech detected in the next 30 seconds recording will stop.')
    this.silenceTimer = setTimeout(this.stopRecording, this.TIME_BETWEEN_ALERTS)
  }, this.TIME_BETWEEN_ALERTS, { trailing: true })

  /* Audio analysis methods */
  initAnalyser = (stream: MediaStream) => {
    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.source = this.audioContext.createMediaStreamSource(stream)
    this.source.connect(this.analyser)
    this.tick()
  }

  disconnectAnalyser = () => {
    cancelAnimationFrame(this.rafId)
    this.analyser.disconnect()
    this.source.disconnect()
  }

  /* Runs 60 fps */
  tick = () => {
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(this.dataArray)
    this.setState({ audioData: this.dataArray })
    this.rafId = requestAnimationFrame(this.tick)
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: e.target.value })
  }

  handleDiscard = () => {
    this.setState({
      isLoading: false,
      isRecording: false,
      recording: null,
      title: '',
      secondsRecorded: undefined
    })
  }

  componentWillUnmount () {
    this.setState({
      blob: null,
      title: '',
      isLoading: false,
      isRecording: false,
      recording: null,
      secondsRecorded: undefined,
      isPlaying: false,
      isAboutToNavigate: false,
      audioData: new Uint8Array(0)
    })
  }

  handlePlayPause = async () => {
    if (this.state.isPlaying) {
      this.audio.pause()
      this.setState({ isPlaying: false })
    } else {
      this.audio.currentTime = 0
      await this.audio.play()
      this.setState({ isPlaying: true })
    }
  }

  stopRecording = async () => {
    this.disconnectAnalyser()
    clearTimeout(this.silenceTimer)
    this.alertUserOfNoSpeechDetected.cancel()
    const blob = await recorder.stopRecording()
    const dateFormat = format(new Date(), 'MM-DD-YYYY, HH:mm')
    const url = URL.createObjectURL(blob)
    this.audio.src = url
    this.setState({
      blob,
      isLoading: false,
      isRecording: false,
      recording: url,
      title: `Audio recording [${dateFormat}]`
    })
    clearInterval(this.timer)
  }

  handleAudioEnded = () => this.setState({ isPlaying: false })

  startRecording = async () => {
    await recorder.initAudio()
    this.audio.onended = this.handleAudioEnded
    this.initAnalyser((recorder as any).stream)
    await recorder.initWorker()
    recorder.startRecording()
    this.setState({
      isLoading: false,
      isRecording: true
    })
    this.elapsedTime = 0
    this.timer = setInterval(() => {
      this.elapsedTime++
      const date = new Date(null)
      date.setSeconds(this.elapsedTime)
      this.setState({ secondsRecorded: format(date, 'mm:ss') })
    }, 1000)

    this.alertUserOfNoSpeechDetected()
  }

  handleSubmit = async () => {
    const { isRecording, title } = this.state
    const { prepareAttachment } = this.props
    isRecording && await this.stopRecording()

    const duration = this.audio.duration * 1000

    const fileName = `${sanitizeFilename(title)}.mp3`
    const file = new File([this.state.blob], fileName, { type: mime.lookup(fileName) as string })
    prepareAttachment({ file, duration })
    await this.closeModal()
  }

  record = async () => {
    const { isRecording } = this.state
    this.setState({ isLoading: true })

    try {
      if (isRecording) {
        await this.stopRecording()
      } else {
        await this.startRecording()
      }
    } catch (error) {
      console.error(error)
      this.setState({ isLoading: false, secondsRecorded: '' })
      clearInterval(this.timer)
    }
  }

  get renderPausePlay () {
    const { recording, secondsRecorded, isPlaying, isRecording } = this.state
    return (
      <>
        {secondsRecorded && <span className={styles.duration}>Duration: {secondsRecorded}</span>}
        {recording && !isRecording &&
          <Button noOutline inline className={styles.playPause} onClick={this.handlePlayPause}>
            <FontAwesomeIcon size='sm' icon={isPlaying ? faPauseCircle : faPlayCircle} />
          </Button>
        }
      </>
    )
  }

  reset = () => this.setState({
    blob: null,
    title: '',
    isLoading: false,
    isRecording: false,
    recording: null,
    secondsRecorded: undefined,
    isPlaying: false,
    isAboutToNavigate: false,
    audioData: new Uint8Array(0)
  })

  closeModal = async () => {
    const { isRecording } = this.state
    isRecording && await this.stopRecording()
    this.reset()
    this.props.closeModal()
  }

  get recordingText () {
    const { isRecording, recording } = this.state
    if (isRecording) {
      return 'Recording...'
    } else if (recording) {
      return 'Re-Record'
    } else {
      return 'Record'
    }
  }

  render () {
    const { modalState } = this.props
    const { isRecording, title } = this.state
    return (
      <Modal.Wrapper
        size='md'
        isOpen={modalState === 'open'}
        onRequestClose={this.closeModal}
        keyboard
        backdrop
        className={styles.audioRecordingModal}
      >
        <Modal.Header>
          <h5 className={styles.heading}>Record Audio Message</h5>
          <span onClick={this.closeModal}>
            <FontAwesomeIcon size='lg' icon={faTimes} />
          </span>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <div className={styles.recordingContainer}>
            <Button className={styles.recordButton} onClick={this.record}>
              <span className={isRecording ? styles.recording : undefined} >
                <FontAwesomeIcon size='xs' icon={faCircle} />
              </span>
              <span>{this.recordingText}</span>
            </Button>
            {this.renderPausePlay}
            <div className={styles.title}>
              <label htmlFor='usr'>Title:</label>
              <input type='text' className='form-control' value={title} onChange={this.handleTitleChange} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn className={styles.cancel} inline secondary onClick={this.closeModal}>Close</Button>
          <Button skinnyBtn inline onClick={this.handleSubmit} disabled={isRecording}>Attach</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default AudioRecordingModal
