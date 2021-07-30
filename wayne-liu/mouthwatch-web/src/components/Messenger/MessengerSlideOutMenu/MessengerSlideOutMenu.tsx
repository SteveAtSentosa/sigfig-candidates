import * as React from 'react'

import { AttachedFile, Media } from '#/types'
import { Props, State } from './types'

import AddAttachmentsMenu from './AddAttachmentsMenu'
import SlideOutMenu from '#/components/SlideOutMenuCollectedImages'
import { ThumbnailOptions } from '#/components/Media/Thumbnail'
import { uniq } from 'lodash'

const styles = require('./styles.scss')

export default class ImagesSlideOutMenu extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)

    this.state = {
      selectedMedia: props.attachments.filter(a => 'media' in a).map(a => a.media.id)
    }
  }

  launchMediaViewer = (fn: () => void) => {
    fn()
    this.props.closeAttachmentsMenu()
  }

  renderCaption = (media: Media, launchFn: () => void) => {
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

  select = (id: string) => this.setState({ selectedMedia: [ ...this.state.selectedMedia, id ] })

  deselect = (id: string) => {
    this.setState({ selectedMedia: this.state.selectedMedia.filter(mediaID => mediaID !== id) })
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.isOpen && !prevProps.isOpen) {
      const attachments = this.attachedMediaIds
      this.setState({ selectedMedia: uniq([...attachments, ...this.state.selectedMedia]) })
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({ selectedMedia: [] })
    }
  }

  private get attachedMediaIds () {
    const { attachments } = this.props
    return attachments
      .filter(a => 'media' in a)
      .map(a => a.media.id)
  }

  private get attachedUploadedFiles (): AttachedFile[] {
    const { attachments } = this.props
    return attachments.filter(a => 'file' in a)
  }

  handleThumbnailClick = (e, media: Media) => {
    e.preventDefault()
    const { selectedMedia } = this.state
    return selectedMedia.includes(media.id) ? this.deselect(media.id) : this.select(media.id)
  }

  conditionalClassName = (media: Media) => {
    return this.state.selectedMedia.includes(media.id) ? styles.image_selected : ''
  }

  clearSelectedMedia = () => {
    this.setState({ selectedMedia: [] })
  }

  saveChanges = () => {
    const { addAttachments, clearAllAttachments, closeAttachmentsMenu, media } = this.props
    const attachments: Media[] = this.state.selectedMedia.map(id => media.find(m => m.id === id))
    const attachedFiles: AttachedFile[] = attachments.map(a => ({ media: a } as AttachedFile)).concat(this.attachedUploadedFiles)
    clearAllAttachments()
    addAttachments(attachedFiles)
    closeAttachmentsMenu()
  }

  get buttonText () {
    return this.state.selectedMedia.length > 0 ? 'Add Attachment(s)' : 'Exit'
  }

  get slideoutMenuTitle () {
    const { patientInChatUsers } = this.props
    if (patientInChatUsers) {
      const { first_name, last_name } = patientInChatUsers.accountData
      return `Add Attachments - ${first_name} ${last_name}`
    }
    return 'Add Attachments'
  }

  private get thumbnailOptions (): ThumbnailOptions {
    const { token } = this.props
    return ({
      hideOptions: true,
      hideCaption: true,
      additionalData: this.renderCaption,
      handleClick: this.handleThumbnailClick,
      conditionalClassName: this.conditionalClassName,
      token,
      noCheckbox: true,
      aspectRatio: '4:3'
    })
  }

  render () {
    const { patientInChatUsers, isOpen, closeAttachmentsMenu } = this.props
    return (
      <SlideOutMenu
        alignRight
        title={this.slideoutMenuTitle}
        actionButtonText={this.buttonText}
        actionButtonCallback={this.saveChanges}
        isOpen={isOpen}
        closeMenu={closeAttachmentsMenu}
        className={styles.menu}
        disableOverlayClick
        overlayClassName={styles.overlay}
      >
        <AddAttachmentsMenu
          patientId={patientInChatUsers && patientInChatUsers.accountData.patient_id}
          thumbnailOptions={this.thumbnailOptions}
          clearSelectedMedia={this.clearSelectedMedia}
        />
      </SlideOutMenu>
    )
  }
}
