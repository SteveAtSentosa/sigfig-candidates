import * as React from 'react'

import { getCompressedThumbnailPreview, isVideo } from '#/utils/CheckMediaType'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Props } from './types'
import { AttachedFile, Media } from '#/types'
import VideoThumbnail from '#/components/VideoThumbnail'
import { faTimes } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

class Attachment extends React.PureComponent<Props> {

  private get hasMedia () {
    const { attachment } = this.props
    return 'media' in attachment
  }

  private get objectURL () {
    const { attachment } = this.props
    if (this.hasMedia) {
      return null
    } else {
      const propertiesObj = JSON.parse(attachment.properties)
      return propertiesObj.type === 'chat-img' && URL.createObjectURL(attachment.file)
    }
  }

  private get caption () {
    return this.hasMedia ? this.props.attachment.media.file_name : this.props.attachment.file.name
  }

  componentWillUnmount () {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL)
    }
  }

  thumbnailPathForMedia = (media: Media) => {
    const { token } = this.props
    return getCompressedThumbnailPreview(media, token)
  }

  thumbnailPathForFile = (type: string) => {
    // Uploaded attached files MUST have a type of chat-*
    if (type === 'chat-img') {
      return this.objectURL
    } else if (type === 'chat-audio') {
      return '/static/images/mediaMp3.svg'
    } else if (type === 'chat-doc') {
      return '/static/images/mediaDoc.svg'
    } else if (type === 'chat-pdf') {
      return '/static/images/media_doc.svg'
    }
  }

  handleRemoveAttachment = () => {
    const { attachment, removeAttachments } = this.props
    removeAttachments([attachment])
  }

  renderThumbnailFromMedia = (media: Media) => {
    // For media objects
    const { token } = this.props
    return isVideo(media) ? <VideoThumbnail media={media} token={token}/> : <img src={this.thumbnailPathForMedia(media)}/>
  }

  renderThumbnailFromFile = (attachment: AttachedFile) => {
    // For uploaded files
    const { properties, file } = attachment
    const propertiesObj = JSON.parse(properties)
    return propertiesObj.type === 'chat-vid' ? <VideoThumbnail file={file} /> : <img src={this.thumbnailPathForFile(propertiesObj.type)}/>
  }

  renderAttachment = () => {
    const { attachment } = this.props
    return this.hasMedia ? this.renderThumbnailFromMedia(attachment.media) : this.renderThumbnailFromFile(attachment)
  }

  render () {
    return (
      <div className={styles.attachment} onClick={this.handleRemoveAttachment}>
        {this.renderAttachment()}
        <span className={styles.overlay}>
          <FontAwesomeIcon icon={faTimes} size='lg'/>
        </span>
        <div className={styles.caption}>{this.caption}</div>
      </div>
    )
  }
}

export default Attachment
