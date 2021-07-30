import * as React from 'react'

import { Media, Note } from '#/types'
import { faPlayCircle, faPlus } from '@fortawesome/pro-regular-svg-icons'

import DeleteMediaModal from '#/components/Media/DeleteMedia'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ImageActionMenu from './ImageActionMenu'
import NoteActionMenu from './NoteActionMenu'
import NotesTable from '#/components/Table/NotesTable'
import ToothModal from '#/components/Modal/ToothModal'
import cn from 'classnames'
import { getCompressedThumbnailPreview } from '#/utils/CheckMediaType'
import { getLambdaMediaSrc } from '#/utils'
import { orderBy } from 'lodash'

const styles = require('./styles.scss')

interface OwnProps {
  media: Media
  token: string
  patientId: string
  appointmentId: string
  isSelected: boolean
  onOpenInMediaViewer: (media: Media, notesOpen: boolean) => void
  onAddToothNumber: (media: Media, values: string[]) => void
  onSelect: (media: Media) => void
}

interface State {
  isToothModalOpen: boolean
  toothModalValues: Array<{ label: string, value: string }>
  isDeleteModalOpen: boolean
}

class CollectedImage extends React.PureComponent<OwnProps, State> {

  state = {
    isToothModalOpen: false,
    toothModalValues: [],
    isDeleteModalOpen: false
  }

  videoPlayerRef = React.createRef<HTMLVideoElement>()

  get thumbnailFilePath () {
    const { media , token } = this.props
    return getCompressedThumbnailPreview(media, token)
  }

  get rawFilePath () {
    const { media: { id }, token } = this.props
    return getLambdaMediaSrc(id, token)
  }

  get toothNumbers () {
    const { media: { tooth } } = this.props

    if (!tooth) {
      return ''
    }

    return tooth.join(', ')
  }

  get orderedNotes () {
    const { media: { notes } } = this.props
    return orderBy(notes, ['created_at'], ['desc'])
  }

  get notesHeaderButton () {
    return (
      <span className={cn(styles.icon, styles.plusButton)} onClick={this.handleAddNote}>
        <FontAwesomeIcon icon={faPlus} size='lg' />
      </span>
    )
  }

  openToothModal = () => {
    const { media } = this.props
    this.setState({
      isToothModalOpen: true,
      toothModalValues: media.tooth ? media.tooth.map(t => ({ label: t, value: t })) : []
    })
  }

  closeToothModal = () => this.setState({ isToothModalOpen: false })

  openDeleteModal = () => {
    this.setState({ isDeleteModalOpen: true })
  }

  closeDeleteModal = () => {
    this.setState({ isDeleteModalOpen: false })
  }

  handleMediaView = () => {
    const { media, onOpenInMediaViewer } = this.props
    onOpenInMediaViewer(media, false)
  }

  handleAddNote = () => {
    const { media, onOpenInMediaViewer } = this.props
    onOpenInMediaViewer(media, true)
  }

  handleAddToothNumber = (values: string[]) => {
    const { media, onAddToothNumber } = this.props
    onAddToothNumber(media, values)
    this.closeToothModal()
  }

  handleImageSelect = () => {
    const { media, isSelected, onSelect } = this.props
    onSelect(isSelected ? null : media)
    // this prevents the video from autoplaying when enlarged
    // also pauses the video when deselected
    setTimeout(() => {
      this.videoPlayerRef.current.controls = !isSelected
      this.videoPlayerRef.current.pause()
    }, 500)
  }

  notesActionRenderer = (rowData: Note) => {
    return (
      <NoteActionMenu
        note={rowData}
        onViewNote={this.handleAddNote}
      />
    )
  }

  renderPlayPauseButton = () => {
    const { isSelected } = this.props
    if (isSelected) return null
    return <FontAwesomeIcon icon={faPlayCircle} size='3x' />
  }

  renderThumbnail = () => {
    const { media, isSelected } = this.props
    const { type } = media
    if (type === 'exam-img') {
      return (
        <img
          className={(isSelected ? styles.selectedImage : styles.thumbnail)}
          src={isSelected ? this.rawFilePath : this.thumbnailFilePath}
          onClick={this.handleImageSelect}
        />
      )
    } else {
      return (
        <>
        <div className={styles.playButton}>
          {this.renderPlayPauseButton()}
        </div>
        <video
          className={(isSelected ? styles.selectedImage : styles.thumbnail)}
          poster={this.thumbnailFilePath}
          src={this.rawFilePath}
          onClick={this.handleImageSelect}
          ref={this.videoPlayerRef}
        >
          HTML5 Video is not supported in this browser.
        </video>
        </>
      )
    }
  }

  render () {
    const { media, patientId, appointmentId, isSelected } = this.props
    const { toothModalValues, isToothModalOpen, isDeleteModalOpen } = this.state
    const { file_name, notes } = media

    return (
      <div className={cn(styles.collectedImage, { [styles.preview]: isSelected })}>
        {this.renderThumbnail()}
        <div className={styles.imageInfo}>
          <span className={styles.boldInfo}>{ file_name }</span>
        </div>
        <div className={styles.imageInfo}>
          <span className={styles.boldInfo}>Tooth Number: </span>
          <span>{ this.toothNumbers }</span>
          <span className={styles.separator}>|</span>
          <span className={styles.action} onClick={this.openToothModal}>Add</span>
        </div>
        <div className={styles.imageInfo}>
          <span className={styles.boldInfo}>Notes: </span>
          <span>{ notes.length }</span>
          <span className={styles.separator}>|</span>
          <span className={styles.action} onClick={this.handleAddNote}>Add</span>
          {
            notes.length > 0 &&
            <>
              <span className={styles.separator}>|</span>
              <span className={styles.action} onClick={this.handleAddNote}>View</span>
            </>
          }
        </div>
        <div className={styles.menuWrapper}>
          <ImageActionMenu
            onOpenInMediaViewer={this.handleMediaView}
            onAddNote={this.handleAddNote}
            onAddToothNumber={this.openToothModal}
            onDelete={this.openDeleteModal}
          />
        </div>

        {
          isSelected &&
          <div className={styles.tableWrapper}>
            <NotesTable
              appointmentId={appointmentId}
              data={this.orderedNotes}
              fetching={false}
              actionColumnRenderer={this.notesActionRenderer}
              showNoteBody
              hideBorder
            />
            { this.notesHeaderButton }
          </div>
        }

        {
          isToothModalOpen &&
          <ToothModal
            isOpen={isToothModalOpen}
            initialValues={toothModalValues}
            handleSubmit={this.handleAddToothNumber}
            close={this.closeToothModal}
          />
        }

        {
          isDeleteModalOpen &&
          <DeleteMediaModal
            close={this.closeDeleteModal}
            isOpen={isDeleteModalOpen}
            media={media}
            patientId={patientId || ''}
          />
        }
      </div>
    )
  }
}

export default CollectedImage
