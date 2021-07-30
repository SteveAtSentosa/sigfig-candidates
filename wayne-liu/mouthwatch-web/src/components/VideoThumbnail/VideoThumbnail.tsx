import { Props } from './types'
import React from 'react'
import { getCompressedThumbnailPreview } from '#/utils/CheckMediaType'

const styles = require('./styles.scss')

export default class VideoThumbnail extends React.PureComponent<Props> {

  get thumbnailFilePathForMedia () {
    const { media, token } = this.props
    return getCompressedThumbnailPreview(media, token)
  }

  get objectURL () {
    return 'file' in this.props && URL.createObjectURL(this.props.file)
  }

  get videoURL () {
    return this.objectURL || this.thumbnailFilePathForMedia
  }

  componentWillUnmount () {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL)
    }
  }

  render () {
    return (
      <>
        <div className={styles.playButton}>
          <img src='/static/images/icon_video_play.png' />
        </div>
        <div className={styles.videoThumbnailContainer}>
          <video src={this.videoURL} style={{ width: '100%' }} />
        </div>
      </>
    )
  }
}
