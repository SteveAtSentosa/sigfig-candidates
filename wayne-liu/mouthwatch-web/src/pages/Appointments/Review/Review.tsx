import { ActionProps, OwnProps, State, StateProps } from './types'
import { Audio, Note } from '#/types'
import { CreateNote, EditNote } from '#/actions/notes'
import { CreatePatchedEntity, hasPermission } from '#/utils'
import { isEqual, orderBy } from 'lodash'

import AddDocumentButton from './AddDocumentButton'
import AddProcedureModal from './AddProcedureModal'
import { AppState } from '#/redux'
import AudioTable from './AudioTable'
import CollapsibleSection from '#/components/CollapsibleSection'
import CollectedImages from './CollectedImages'
import DeleteNoteModal from '#/components/Modal/DeleteNoteModal'
import DocumentsTable from '#/components/Table/DocumentsTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadList } from '#/actions/procedures'
import NoteActionMenu from './NoteActionMenu'
import NotePanel from './NotePanel'
import NotesTable from '#/components/Table/NotesTable'
import { OpenMediaViewer } from '#/actions/mediaViewer'
import ProceduresTable from '#/components/Table/ProceduresTable'
import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { selectors } from '#/actions/appointments'
import { withRouter } from 'react-router-dom'

const styles = require('./styles.scss')

type Prop = OwnProps & StateProps & ActionProps

class Review extends React.Component<Prop, State> {

  constructor (props) {
    super(props)

    const { appointment } = this.props
    const currentNote = appointment ? this.mostRecentNote : null

    this.state = {
      isNotePanelOpen: !!currentNote,
      isDeleteModalOpen: false,
      isEditingNote: false,
      isProcedureModalOpen: false,
      currentNote,
      deletingNote: null
    }
  }

  componentDidMount () {
    this.loadProcedures()
  }

  componentDidUpdate (prevProps) {
    const { appointment: prevAppointment } = prevProps
    const { appointment: currentAppointment } = this.props

    if ((!prevAppointment && currentAppointment) ||
      (prevAppointment && currentAppointment && !isEqual(prevAppointment.notes, currentAppointment.notes))) {
      const currentNote = this.mostRecentNote
      this.setState({
        currentNote,
        isNotePanelOpen: !!currentNote
      })
    }
  }

  get allowedDocumentTypes () {
    return [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/rtf',
      'text/rtf',
      'model/stl',
      'application/octet-stream'
    ]
  }

  get orderedNotes () {
    const { appointment: { notes } } = this.props
    return orderBy(notes, ['created_at'], ['desc'])
  }

  get mostRecentNote () {
    const notes = this.orderedNotes
    return notes.length > 0 ? notes[0] : null
  }

  get notesHeaderButton () {
    return (
      <span onClick={this.handleAddNote}>
        <FontAwesomeIcon className={styles.icon} icon={faPlus} />
      </span>
    )
  }

  get proceduresHeaderButton () {
    return (
      <span onClick={this.handleAddProcedure}>
        <FontAwesomeIcon className={styles.icon} icon={faPlus} />
      </span>
    )
  }

  get audioHeaderButton () {
    return (
      <span onClick={this.handleAddAudio}>
        <FontAwesomeIcon className={styles.icon} icon={faPlus} />
      </span>
    )
  }

  get orderedProcedures () {
    const { procedures } = this.props
    return orderBy(procedures, ['created_at'], ['desc'])
  }

  get orderedAudioFiles () {
    const { appointment: { media } } = this.props
    const audioFiles = media
      .filter(({ type }) => type === 'exam-audio')
      .map(e => ({
        ...e,
        caption: e.caption || e.file_name
      }))
    return orderBy(audioFiles, ['created_at'], ['desc'])
  }

  get documentHeaderButton () {
    const { appointment } = this.props
    return (
      <AddDocumentButton appointment={appointment} allowedDocumentTypes={this.allowedDocumentTypes} />
    )
  }

  loadProcedures = () => {
    const { appointmentId, loadProcedures } = this.props

    loadProcedures({
      where: [ { prop: 'appointment_id', comp: '=', param: appointmentId }],
      associations: [{ model: 'account', as: 'provider', associations: [{ model: 'media', as: 'media', where: [{ prop: 'type', comp: '=', param: 'act-avatar' }] }] }],
      order: 'created_at',
      sort: 'DESC'
    })
  }

  handleAddNote = () => {
    this.setState({
      currentNote: null,
      isNotePanelOpen: true,
      isEditingNote: true
    })
  }

  handleViewNote = (note: Note) => {
    this.setState({
      currentNote: note,
      isNotePanelOpen: true,
      isEditingNote: false
    })
  }

  handleEditNote = (note: Note) => {
    this.setState({
      currentNote: note,
      isNotePanelOpen: true,
      isEditingNote: true
    })
  }

  handleDeleteNote = (note: Note) => {
    this.setState({
      deletingNote: note,
      isDeleteModalOpen: true
    })
  }

  handleClosePanel = () => {
    this.setState({
      isNotePanelOpen: false
    })
  }

  handleCancelPanel = () => {
    const { currentNote } = this.state

    this.setState({
      isEditingNote: false,
      isNotePanelOpen: currentNote ? true : false
    })
  }

  handleSubmitPanel = (values) => {
    const { appointmentId, editNote, createNote } = this.props
    const { currentNote } = this.state

    if (currentNote) {
      const patchedNote = CreatePatchedEntity(values, currentNote)
      editNote({
        id: currentNote.id,
        patchedNote,
        updated_at: currentNote.updated_at,
        appointmentId: appointmentId
      })
    } else {
      const valuesWithApptId = Object.assign({}, values, { appointment_id: appointmentId })
      createNote({ data: valuesWithApptId })
    }

    this.setState({
      isEditingNote: false
    })
  }

  handleCloseDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false
    })
  }

  handleAddProcedure = () => {
    this.setState({
      isProcedureModalOpen: true
    })
  }

  handleCloseProcedureModal = () => {
    this.setState({
      isProcedureModalOpen: false
    })
  }

  handleAddAudio = () => {
    const { appointmentId, patientId } = this.props
    this.props.history.push(`/audio/patient/${patientId}/appointment/${appointmentId}`)
  }

  handleOpenMediaViewer = (audio: Audio) => {
    const { appointmentId, openMediaViewer } = this.props

    openMediaViewer({
      initialId: audio.id,
      mediaIds: this.orderedAudioFiles.map(({ id }) => id),
      appointmentId,
      notesOpen: true
    })
  }

  notesActionRenderer = (rowData: Note) => {
    return (
      <NoteActionMenu
        note={rowData}
        onViewNote={this.handleViewNote}
        onEditNote={this.handleEditNote}
        onDeleteNote={this.handleDeleteNote}
      />
    )
  }

  render () {
    const { appointment, appointmentId, patientId, procedures, viewPerms } = this.props
    const { currentNote, deletingNote, isNotePanelOpen, isDeleteModalOpen, isEditingNote, isProcedureModalOpen } = this.state

    return (
      <div className={cn(styles.reviewWrapper, { [styles.squeezed]: isNotePanelOpen })}>
        {
          appointment &&
          <div className={styles.reviewSection}>
            <CollapsibleSection title='Notes' action={this.notesHeaderButton} hideButton>
              <NotesTable
                appointmentId={appointmentId}
                data={this.orderedNotes}
                fetching={false}
                actionColumnRenderer={this.notesActionRenderer}
                onRowClick={this.handleViewNote}
                hideBorder
              />
            </CollapsibleSection>
          </div>
        }
        {
          appointment &&
          <div className={styles.reviewSection}>
            <CollectedImages
              appointmentId={appointmentId}
              patientId={patientId}
              isSqueezed={isNotePanelOpen}
            />
          </div>
        }
        {
          appointment && procedures &&
          <div className={styles.reviewSection}>
            <CollapsibleSection disabled={!hasPermission(viewPerms, 'procedure_codes')} title='Procedure Codes' action={this.proceduresHeaderButton} hideButton>
              <ProceduresTable
                data={this.orderedProcedures}
                fetching={false}
                hideBorder
              />
            </CollapsibleSection>
          </div>
        }
        {
          appointment &&
          <div className={styles.reviewSection}>
            <CollapsibleSection title='Documents' action={this.documentHeaderButton} hideButton>
              <DocumentsTable
                media={appointment.media}
                fetching={false}
                allowedDocumentTypes={this.allowedDocumentTypes}
                bulkSelect={false}
                hideBorder
              />
            </CollapsibleSection>
          </div>
        }
        {
          appointment &&
          <div className={styles.reviewSection}>
            <CollapsibleSection disabled={!hasPermission(viewPerms, 'video_audio_messages')} title='Audio' action={this.audioHeaderButton} hideButton>
              <AudioTable
                data={this.orderedAudioFiles}
                onListenAudio={this.handleOpenMediaViewer}
              />
            </CollapsibleSection>
          </div>
        }
        {
          appointment && isNotePanelOpen &&
          <NotePanel
            note={currentNote}
            isEditing={isEditingNote}
            onClose={this.handleClosePanel}
            onCancel={this.handleCancelPanel}
            onSubmit={this.handleSubmitPanel}
            onView={this.handleViewNote}
            onEdit={this.handleEditNote}
            onDelete={this.handleDeleteNote}
          />
        }
        <DeleteNoteModal
          note={deletingNote}
          isOpen={isDeleteModalOpen}
          close={this.handleCloseDeleteModal}
          appointmentId={appointmentId}
        />
        <AddProcedureModal
          showModal={isProcedureModalOpen}
          closeModal={this.handleCloseProcedureModal}
          patientId={patientId}
          appointmentId={appointmentId}
        />
      </div>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, OwnProps, AppState>(
  (state, props) => ({
    appointment: selectors.getById(state, props.appointmentId),
    procedures: state.procedures.data,
    fetchingAppointment: state.appointments.fetching,
    viewPerms: state.ui.permissions
  }),
  {
    createNote: CreateNote,
    editNote: EditNote,
    loadProcedures: LoadList,
    openMediaViewer: OpenMediaViewer
  }
)(Review))
