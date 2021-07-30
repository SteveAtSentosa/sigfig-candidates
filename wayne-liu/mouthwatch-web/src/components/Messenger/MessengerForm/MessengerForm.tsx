import * as React from 'react'

import { DefaultProps, FormData, Props } from './types'
import { faFile, faMicrophone, faUpload, faVideoPlus } from '@fortawesome/pro-regular-svg-icons'
import { faFile as faFileSolid, faPaperPlane as faPaperPlaneSolid } from '@fortawesome/free-solid-svg-icons'

import { Attachment } from '#/components/Messenger'
import EssentialTooltip from '#/components/EssentialTooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayLoader } from '#/components/Loader'
import { Field as ReduxFormField } from 'redux-form'
import { VideoRecordingModal } from '#/components/Modal'
import cn from 'classnames'
import config from '#/config'
import uuid from 'uuid/v4'
import { hasPermission } from '#/utils'

const styles = require('./styles.scss')

class MessengerForm extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    treatmentPlans: []
  }

  private uploadRef = React.createRef<HTMLInputElement>()
  private textareaRef = React.createRef<ReduxFormField>()

  private onSubmit = ({ message }: FormData) => {
    const { sendMessageToChannel, selectedChannel, archiveChannel, attachments, uploadMessageAttachments } = this.props

    if (attachments.length > 0) {
      uploadMessageAttachments({ channelId: selectedChannel.id, message, attachments })
    } else {
      sendMessageToChannel({ channelId: selectedChannel.id, messageType: 'text', data: message })
    }
    archiveChannel({ channelId: selectedChannel.id, archived: false })
  }

  private onEnterPress = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    const { key, shiftKey } = evt
    if (key === 'Enter' && shiftKey === false && !this.invalidMessage && !this.shouldDisableMessages) {
      evt.preventDefault()
      this.props.handleSubmit(this.onSubmit)()
      this.props.change('message', '')
    }
  }

  private handleSend = (evt: React.MouseEvent<HTMLSpanElement>) => {
    evt.preventDefault()
    const { handleSubmit } = this.props
    if (!this.invalidMessage) {
      handleSubmit(this.onSubmit)()
      this.props.change('message', '')
    }
  }

  private handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { prepareAttachment } = this.props
    prepareAttachment({ file: e.target.files[0] })
  }

  private handleUploadClick = () => {
    this.uploadRef.current.click()
  }

  private get textAreaClassName () {
    return cn(styles.textarea, {
      [styles.withAttachments]: this.props.attachments.length > 0
    })
  }

  private get renderAttachments () {
    const { attachments } = this.props
    return (
      <div className={styles.attachmentThumbnails}>
        {attachments.map((attachment) => <Attachment key={uuid()} attachment={attachment}/>)}
      </div>
    )
  }

  private attachFile = (videoFile: File) => {
    this.props.prepareAttachment({ file: videoFile })
  }

  private get renderAttachmentMenuButton () {
    const { isAttachmentsMenuOpen, loggedInAccount: { is_patient } } = this.props
    return !is_patient && (
      <span title='Collected Data' onClick={this.handleAttachmentsMenu}>
        <FontAwesomeIcon icon={isAttachmentsMenuOpen ? faFileSolid : faFile}/>
      </span>
    )
  }

  private get renderAudioRecordingButton () {
    const { openAudioRecordingModal, loggedInAccount: { is_patient }, viewPerms } = this.props
    if (!window.MediaRecorder) return

    const enabled = hasPermission(viewPerms, 'video_audio_messages')
    return !is_patient && (
      <EssentialTooltip
        enabled={!enabled}
        content={<span><strong>Record audio messages</strong> within TeleDent and share them in real-time with patients and colleagues.</span>}
      >
        <span title='Audio Message' onClick={openAudioRecordingModal}>
          <FontAwesomeIcon icon={faMicrophone}/>
        </span>
      </EssentialTooltip>
    )
  }

  private get renderVideoMessageButton () {
    const { loggedInAccount: { is_patient }, openVideoRecordingModal, viewPerms } = this.props
    if (!window.MediaRecorder) return

    const enabled = hasPermission(viewPerms, 'video_audio_messages')
    return !is_patient && config.features.videoMessage && (
      <EssentialTooltip
        enabled={!enabled}
        content={<span><strong>Record video messages</strong> within TeleDent to capture demonstrations, appointments, and other important discussions.</span>}
      >
        <span title='Video Message' onClick={() => openVideoRecordingModal({ modal: 'videoRecord' })}>
          <FontAwesomeIcon icon={faVideoPlus}/>
        </span>
      </EssentialTooltip>
    )
  }

  private get renderUploadMediaButton () {
    const { viewPerms } = this.props
    const enabled = hasPermission(viewPerms, 'browser_media_upload')

    return (
      <EssentialTooltip
        enabled={!enabled}
        content={<span><strong>Upload images</strong> directly from your browser without leaving TeleDent to more easily share information.</span>}
      >
        <span title='Upload' onClick={this.handleUploadClick}>
          <FontAwesomeIcon icon={faUpload}/>
        </span>
      </EssentialTooltip>
    )
  }

  private handleAttachmentsMenu = () => {
    const { isAttachmentsMenuOpen, closeAttachmentsMenu, openAttachmentsMenu } = this.props
    if (isAttachmentsMenuOpen) {
      closeAttachmentsMenu()
    } else {
      openAttachmentsMenu()
    }
  }

  /*
    Invlaid message if:
    1. chat is disconnected
    2. current message is empty
    3. there are no attachments
  */
  private get invalidMessage () {
    const { currentMessage, attachments } = this.props
    return !(currentMessage && currentMessage.trim().length > 0) && attachments.length < 1
  }

  private get renderSendButton () {
    const sendClassName = cn(styles.sendButton, {
      [styles.disabled]: this.invalidMessage
    })

    return (
       <span title='Send' className={sendClassName} onClick={this.handleSend}>
         <FontAwesomeIcon icon={faPaperPlaneSolid} />
       </span>
    )
  }

  private get renderChatDisconnectedMessage () {
    return(
      <span className={styles.chatDisconnected}>
        Messaging is currently disconnected. Please wait for it to reconnect or click here to <a href='#' target='_self' onClick={this.refresh} >refresh</a>.
      </span>
    )
  }

  // force refresh
  private refresh = () => {
    window.location.href = this.props.location.pathname
  }

  componentDidUpdate (prevProps: Props) {
    const { selectedChannel, change, match: { params } } = this.props
    if (selectedChannel.id !== prevProps.selectedChannel.id && !params.accountId) {
      change('message', '')
    }
  }

  componentDidMount () {
    const { match, initialMessage, initialize } = this.props
    if (match.params.accountId && initialMessage) {
      initialize({ message: initialMessage })
    }
  }

  private get shouldDisableMessages () {
    const { webSocketReadyState, isSiteOnline } = this.props
    return (webSocketReadyState === 'CLOSED' || webSocketReadyState === 'CLOSING' || webSocketReadyState === 'CONNECTING') || !isSiteOnline
  }

  private get messageActionsClassName () {
    return cn(styles.messageActions, {
      [styles.disabled]: this.shouldDisableMessages
    })
  }

  render () {
    const { form, handleSubmit, attachments, uploadingAttachments } = this.props
    return (
      <OverlayLoader className={styles.overlayLoader} when={uploadingAttachments} size={30} transparent text='Uploading...'>
        <form id={form} onSubmit={handleSubmit(this.onSubmit)} onKeyDown={this.onEnterPress} className={styles.messengerForm}>
          <ReduxFormField
            className={this.textAreaClassName}
            component='textarea'
            name='message'
            withRef
            ref={this.textareaRef}
          />
          <div className={this.messageActionsClassName}>
            {this.renderAudioRecordingButton}
            {this.renderVideoMessageButton}
            {this.renderUploadMediaButton}
            {this.renderAttachmentMenuButton}
            {this.renderSendButton}
          </div>
          <input onChange={this.handleUploadChange} type='file' id='upload' ref={this.uploadRef} hidden accept='.ogg, .webm, .png, .jpeg, .jpg, .doc, .docx, .mov, .mp4, .pdf'/>
          {
            !!(attachments.length) &&
            <div className={styles.attachments}>
              <h5>Attachments</h5>
              {this.renderAttachments}
            </div>
          }
          <VideoRecordingModal attachVideoFile={this.attachFile} />
          { this.shouldDisableMessages && this.renderChatDisconnectedMessage }
        </form>
      </OverlayLoader>
    )
  }
}

export default MessengerForm
