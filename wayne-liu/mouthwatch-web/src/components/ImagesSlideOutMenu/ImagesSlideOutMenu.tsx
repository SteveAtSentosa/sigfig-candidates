import * as React from 'react'

import { Media, MediaDictionary } from '#/types'

import CollectedData from '#/pages/Patients/CollectedData'
import { LaunchFn } from '#/pages/MediaViewer/MediaViewer'
import { Props } from './types'
import SlideOutMenu from '#/components/SlideOutMenuCollectedImages'
import { keyBy } from 'lodash'

const styles = require('./styles.scss')

export default class ImagesSlideOutMenu extends React.PureComponent<Props> {

  launchMediaViewer = (fn: LaunchFn) => {
    fn()
    this.props.closeCollectedMediaMenu()
  }

  renderCaption = (media: Media, launchFn?: LaunchFn) => {
    return (
      <div className={styles.tp_image_caption}>
        <div><span className={styles.caption_heading}>Name</span>: {media.caption || media.file_name}</div>
        {
          media.tooth &&
          <div><span className={styles.caption_heading}>Tooth Number</span>: {media.tooth}</div>
        }
        {
          media.notes && media.notes.length > 0 &&
          <div><span className={styles.caption_heading}>Notes</span>: {media.notes.length} | <span className={styles.view_link} onClick={() => this.launchMediaViewer(launchFn)}>View</span></div>
        }
      </div>
    )
  }

  handleThumbnailClick = (e, media: Media) => {
    e.preventDefault()
    const { select, deselect, sectionId } = this.props
    return this.preprocessed.includes(media.id) ? deselect({ sectionId: sectionId, incomingMediaID: media.id }) : select({ sectionId: sectionId, incomingMediaID: media.id })
  }

  conditionalClassName = (media: Media) => {
    return this.preprocessed.includes(media.id) ? styles.image_selected : ''
  }

  saveChanges = () => {
    const { onAddImages, closeCollectedMediaMenu, media, existingMedia } = this.props
    const temp = media
          .filter(m => this.preprocessed.includes(m.id))
          .map(m => (this.formatMedia(m, existingMedia)))

    const mediaDictionary: MediaDictionary = keyBy(temp, o => o.data.id) as MediaDictionary
    onAddImages(mediaDictionary)
    closeCollectedMediaMenu()
  }

  formatMedia (media, existingMedia) {
    let caption = media.media_treatment_plan_caption || ''
    if (existingMedia && existingMedia[media.id]) {
      caption = existingMedia[media.id].caption
    }

    return { caption: caption, data: media }
  }

  get buttonText () {
    return this.preprocessed.length > 0 ? 'Add Image(s)' : 'Exit'
  }

  get preprocessed () {
    const preprocessed = this.props.preprocessed[this.props.sectionId] ? this.props.preprocessed[this.props.sectionId] : []
    return preprocessed
  }

  render () {
    const { patientId, token } = this.props
    return (
      <SlideOutMenu
        alignRight
        title='Collected Images'
        actionButtonText={this.buttonText}
        actionButtonCallback={this.saveChanges}
      >
        <CollectedData
          hideFilterBar
          hideUpload
          patientId={patientId}
          includedFilters={['image']}
          thumbnailOptions={{
            hideOptions: true,
            hideCaption: true,
            additionalData: this.renderCaption,
            handleClick: this.handleThumbnailClick,
            conditionalClassName: this.conditionalClassName,
            token,
            noCheckbox: true,
            aspectRatio: '4:3'
          }}
        />
      </SlideOutMenu>
    )
  }
}
