import { orderBy } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUpload } from '@fortawesome/pro-regular-svg-icons'
import { AppState } from '#/redux'
import { Media, EntityId } from '#/types'
import { PatchedEntity } from '#/api'
import { CreateMedia, EditMedia } from '#/actions/media'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { OpenMediaViewer } from '#/actions/mediaViewer'
import { withMediaViewer } from '#/components/MediaViewer'
import CollectedImage from './CollectedImage'

const styles = require('./styles.scss')

interface StateProps {
  data: Array<Media>
  token: string
  postingMedia: boolean
  error: Error
}

interface OwnProps {
  patientId: EntityId
  appointmentId: EntityId
  isSqueezed: boolean
}

interface ActionProps {
  createMedia: typeof CreateMedia
  updateMedia: typeof EditMedia
  showNotificationPopUp: typeof ShowNotificationPopUp
  openViewer: typeof OpenMediaViewer
}

interface State {
  previewImage: Media
}

type Props = OwnProps & StateProps & ActionProps

@withMediaViewer()
class CollectedImages extends React.PureComponent<Props, State> {

  fileInput = React.createRef<HTMLInputElement>()

  state = {
    previewImage: null
  }

  get images () {
    const { data } = this.props
    return orderBy(data.filter(({ type }) => type === 'exam-img' || type === 'exam-vid'), ['created_at'], ['desc'])
  }

  openFileInput = () => {
    this.fileInput.current.click()
  }

  handleUploadFiles = (e) => {
    const { appointmentId, patientId, createMedia } = this.props

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      const type = 'exam-img'

      createMedia({
        file,
        association: 'appointment',
        association_id: appointmentId,
        type,
        multiple: !(i === e.target.files.length - 1),
        patientId
      })
    }
  }

  handleMediaView = (media: Media, notesOpen: boolean) => {
    const { appointmentId, patientId, openViewer } = this.props
    const mediaIds = this.images.map(({ id }) => id)

    openViewer({
      initialId: media.id,
      mediaIds,
      notesOpen,
      appointmentId,
      patientId
    })
  }

  handleAddToothNumber = (media: Media, values: string[]) => {
    const { patientId, appointmentId, updateMedia } = this.props
    const op = media.tooth ? 'replace' : 'add'
    const patchedMedia: PatchedEntity = { 'properties/tooth': { value: values, op } }

    updateMedia({ id: media.id, media: patchedMedia, patientId, updated_at: media.updated_at, appointmentId })
  }

  handlePreviewImage = (media: Media) => {
    this.setState({
      previewImage: media
    })
  }

  render () {
    const { isSqueezed, token, patientId, appointmentId } = this.props
    const { previewImage } = this.state

    return (
      <div className={styles.collectedImages}>
        <div className={styles.collectedHeader}>
          <span className={styles.title}>Collected Images</span>
          <span className={styles.upload} onClick={this.openFileInput}>
            <span>Upload Images</span>
            <FontAwesomeIcon icon={faCloudUpload} />
            <input type='file' id='image' ref={this.fileInput} multiple hidden accept='.png, .jpeg, .jpg' onChange={this.handleUploadFiles}/>
          </span>
        </div>
        <div className={cn(styles.grid, { [styles.squeezed]: isSqueezed })}>
        {
          this.images.map((image, index) => (
            <CollectedImage
              key={index}
              media={image}
              token={token}
              patientId={patientId}
              appointmentId={appointmentId}
              isSelected={previewImage ? previewImage.id === image.id : false}
              onOpenInMediaViewer={this.handleMediaView}
              onAddToothNumber={this.handleAddToothNumber}
              onSelect={this.handlePreviewImage}
            />
          ))
        }
        </div>
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    data: state.media.data,
    token: state.auth.data.token,
    postingMedia: state.media.posting,
    error: state.media.error
  }),
  {
    createMedia: CreateMedia,
    updateMedia: EditMedia,
    showNotificationPopUp: ShowNotificationPopUp,
    openViewer: OpenMediaViewer
  }
)(CollectedImages)
