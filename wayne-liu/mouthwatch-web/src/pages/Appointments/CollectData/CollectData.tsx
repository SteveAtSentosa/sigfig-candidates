import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { HTMLInputEvent, Props, State } from './types'
import Icon, { Size } from '#/components/Icon'
import { every, filter } from 'lodash'
import { hasPermission, isImage, isVideo, isXray } from '#/utils'

import AddAudioButton from './Audio/AddAudioButton'
import AddDocumentButton from './Documents/AddDocumentButton'
import AddNoteButton from './Notes/AddNoteButton'
import AudioWidget from './Audio/AudioWidget'
import Button from '#/components/Button'
import CaptureButton from './CaptureButton'
import DeleteAppointmentModal from '#/pages/Appointments/modals/DeleteAppointment'
import DocumentsWidget from './Documents/DocumentsWidget'
import { Heading7 as Heading } from '#/components/Heading'
import { Media } from '#/types'
import MediaPreview from './MediaPreview'
import NotesWidget from './Notes/NotesWidget'
import { OverlayLoader } from '#/components/Loader'
import Thumbnail from '#/components/Media/Thumbnail'
import WidgetContainer from '#/components/Widget'
import { convertToTeledentExamType } from '#/utils/CheckMediaType'
import { withMediaViewer } from '#/components/MediaViewer'

const styles = require('./collect.scss')

@withMediaViewer()
class CollectData extends React.Component<Props, State> {

  state: State = {
    currentMedia: '',
    keydown: false,
    pressed: false,
    key: '',
    targetTagName: 'BODY',
    deleteModalIsOpen: false
  }

  slider = React.createRef<HTMLElement>()

  private openDeleteModal = () => this.setState({ deleteModalIsOpen: true })
  private closeDeleteModal = () => this.setState({ deleteModalIsOpen: false })

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyUp = e => {
    const { keydown, key } = this.state
    if (this.handleKeyPress(e.keyCode)) {
      return
    }
    if (keydown && (key === e.code)) {
      this.setState({ pressed: true }, () => this.setState({ pressed: false, keydown: false }))
    } else {
      this.setState({ pressed: false, key: '', keydown: false })
    }
  }

  private handleKeyDown = e => {
    // targetTagName lets us address an issue where using arrow keys to navigate text
    // in the Add Note modal was triggering navigation between images
    if (this.handleKeyPress(e.keyCode)) {
      return
    }
    this.setState({ key: e.code, keydown: true, targetTagName: e.target.tagName })
  }

  private handleKeyPress = (keyCode) => {
    if (keyCode !== 39 && keyCode !== 37) {
      return true
    }

    return false
  }

  private handleClick = (_e, { id }: Media) => {
    if (id !== this.props.selectedMediaId) {
      this.props.setCurrentMedia({ media: this.props.data.find(m => id === m.id) })
    } else {
      this.props.clearCurrentMedia()
    }
  }

  private navigateBetweenImage = () => {
    const { key, targetTagName } = this.state
    const { selectedMediaId, setCurrentMedia } = this.props
    const currentIndex = this.sortedImages.findIndex(m => m.id === selectedMediaId)
    const prevIndex = currentIndex - 1
    const nextIndex = currentIndex + 1
    const slider = this.slider.current
    const { children } = slider
    if (targetTagName === 'BODY' && key === 'ArrowLeft' && prevIndex >= 0) {
      const child = children[prevIndex] as any
      slider.scrollLeft = child.offsetLeft - 20
      setCurrentMedia({ media: this.sortedImages[prevIndex] })
    }

    if (targetTagName === 'BODY' && key === 'ArrowRight' && nextIndex !== this.sortedImages.length) {
      const child = children[nextIndex] as any
      slider.scrollLeft = child.offsetWidth + child.offsetLeft + 20
      setCurrentMedia({ media: this.sortedImages[nextIndex] })
    }
  }

  fileInput = React.createRef<HTMLInputElement>()

  private openFileInput = () => {
    this.fileInput.current.click()
  }

  componentDidUpdate (_prevProps, prevState) {
    const { appointmentId, createMedia } = this.props

    if (this.fileInput && this.fileInput.current && !this.fileInput.current.onchange) {
      this.fileInput.current.onchange = (e: HTMLInputEvent) => {
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i]
          const type = convertToTeledentExamType(file)
          createMedia({
            file,
            association: 'appointment',
            association_id: appointmentId,
            type,
            multiple: !(i === e.target.files.length - 1),
            patientId: this.props.patientId
          })
        }
      }
    }

    if ((this.state.pressed !== prevState.pressed) && this.state.pressed && this.allImagesLoaded) {
      this.navigateBetweenImage()
    }
  }

  private get allImagesLoaded () {
    return every(this.props.fetchingMediaDict, (id) => !id)
  }

  private notAllowed = (media) => (media.type !== 'exam-doc') && (media.type !== 'patient-avatar') && (media.type !== 'exam-audio')

  private get images () {
    const { data: media } = this.props
    return filter(media, this.notAllowed)
  }

  private get sortedImageKeys () {
    return this.sortedImages.map((m: Media) => m.id)
  }

  private get sortedImages () {
    return this.images.sort((prev: Media, curr: Media) => new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime())
  }

  private get previewImage () {
    return this.props.selectedMediaId.length ? this.sortedImages.find(m => m.id === this.props.selectedMediaId) : null
  }

  private bulkSelectHandler = (ev: React.MouseEvent<HTMLInputElement>, item: any) => {
    if ((ev.target as HTMLInputElement).checked) {
      // add task to bulk selection
      this.props.addItem({ item })
    } else {
      // remove task from bulk selection
      this.props.removeItem({ item })
    }
  }

  render () {
    const { token, selectedMediaId, appointmentId, fetchingAppointment, appointment, patientId, uploaded, viewPerms } = this.props
    return (
      <div className={styles.collectData}>
        <OverlayLoader when={fetchingAppointment || uploaded } transparent>
          <div className={styles.intraoralMedia}>
            <header>
              <span className={styles.title}><Heading>Images</Heading></span>
              <span className={styles.upload}>
                <a href='#' onClick={this.openFileInput}>
                  <Icon name='cloud_upload' size={Size.Medium} /> Upload image or video
                </a>
                <input type='file' id='image' ref={this.fileInput} multiple hidden accept='.webm, .png, .jpeg, .jpg, .mov, .mp4'/>
              </span>
            </header>
              {
                this.previewImage &&
                <MediaPreview
                  preview={this.previewImage}
                  token={token}
                  mediaIds={this.sortedImageKeys}
                  appointmentId={appointmentId}
                  appointment={appointment}
                  patientId={patientId}
                />
              }
            <section className={styles.mediaHolder} ref={this.slider}>
              <CaptureButton key='capture' />
                {this.sortedImages
                  .filter(media => (isImage(media) || isVideo(media) || isXray(media)))
                  .map((media) =>
                      <Thumbnail
                        key={media.id}
                        media={media}
                        mediaIds={this.sortedImageKeys}
                        handleClick={(e) => this.handleClick(e, media)}
                        selected={selectedMediaId === media.id}
                        token={token}
                        bulkSelect={this.bulkSelectHandler}
                        patientId={patientId}
                        appointmentId={appointmentId}
                      />
                  )
                }
            </section>

          </div>
        </OverlayLoader>
        {
          appointment &&
          <div className={styles.additionalInfo}>
            <Grid>
              <Column col={12} md={6}>
                <WidgetContainer>
                  {{
                    title: 'Notes',
                    submenu: <AddNoteButton appointment={appointment} appointmentId={appointmentId} />,
                    widget: <NotesWidget notes={appointment.notes} appointmentId={appointmentId} fetching={fetchingAppointment} />
                  }}
                </WidgetContainer>
                <WidgetContainer disabled={!hasPermission(viewPerms, 'video_audio_messages')} >
                  {{
                    title: 'Audio',
                    submenu: <AddAudioButton />,
                    widget: <AudioWidget appointmentId={appointmentId}/>
                  }}
                </WidgetContainer>
              </Column>
              <Column col={12} md={6}>
                <WidgetContainer>
                  {{
                    title: 'Documents',
                    submenu: <AddDocumentButton appointmentId={appointmentId} appointment={appointment} />,
                    widget: <DocumentsWidget media={appointment.media} fetching={fetchingAppointment} />
                  }}
                </WidgetContainer>
              </Column>
            </Grid>
          </div>
        }
        <div className={styles.section}>
          <div className={styles.archive_delete}>
            <Button secondary onClick={this.openDeleteModal}>Delete Appointment</Button>
          </div>
        </div>
        <DeleteAppointmentModal
          close={this.closeDeleteModal}
          isOpen={this.state.deleteModalIsOpen}
          patientId={this.props.patientId}
          appointmentId={this.props.appointmentId}
        />
      </div>
    )
  }

}

export default CollectData
