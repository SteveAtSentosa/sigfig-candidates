import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import { Note } from '#/types'
import { getUTCDateString } from '#/utils'
import NoteForm from './NoteForm'
import NoteActionMenu from './NoteActionMenu'

const styles = require('./styles.scss')

interface Props {
  note?: Note
  isEditing: boolean
  onClose?: () => void
  onCancel?: () => void
  onSubmit?: (data: any) => void
  onView?: (note: Note) => void
  onEdit?: (note: Note) => void
  onDelete?: (note: Note) => void
}

interface State {
}

export default class NotePanel extends React.Component<Props, State> {

  get editTitle () {
    const { note } = this.props
    return note ? 'Edit Note' : 'Add New Note'
  }

  get formInitialValues () {
    const { note } = this.props

    if (note) {
      const { title, body } = note
      return { title, body }
    }

    return null
  }

  handleClose = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  handleSubmit = (data) => {
    const { onSubmit } = this.props
    onSubmit && onSubmit(data)
  }

  handleCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  handleEditNote = () => {
    const { note, onEdit } = this.props
    onEdit && onEdit(note)
  }

  handleDeleteNote = () => {
    const { note, onDelete } = this.props
    onDelete && onDelete(note)
  }

  renderNoteViewer = () => {
    const { note } = this.props
    const { title, body, created_at, created_by: { first_name, last_name } } = note
    return (
      <div className={styles.panelWrapper}>
        <div className={styles.panelHeader}>
          <div className={styles.noteTitle}>
            { title }
          </div>
          <div className={styles.noteActions}>
            <NoteActionMenu
              note={note}
              onEditNote={this.handleEditNote}
              onDeleteNote={this.handleDeleteNote}
            />
            <span onClick={this.handleClose}>
              <FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
            </span>
          </div>
        </div>
        <div className={styles.panelContent}>
          <div className={styles.noteInfo}>
            { `${first_name} ${last_name}  ${getUTCDateString(created_at)}` }
          </div>
          <div className={styles.noteBody}>
            { body }
          </div>
        </div>
      </div>
    )
  }

  renderNoteEditor = () => {
    const { note } = this.props

    return (
      <div className={styles.panelWrapper}>
        <div className={styles.panelHeader}>
          <div className={styles.noteTitle}>
            { this.editTitle }
          </div>
          <div className={styles.noteActions}>
            {
              note &&
              <NoteActionMenu
                note={note}
                onDeleteNote={this.handleDeleteNote}
              />
            }
            <span onClick={this.handleClose}>
              <FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
            </span>
          </div>
        </div>
        <div className={styles.panelContent}>
          <NoteForm initialValues={this.formInitialValues} onSubmit={this.handleSubmit} onCancel={this.handleCancel} />
        </div>
      </div>
    )
  }

  render () {
    const { note, isEditing } = this.props

    if (!isEditing && note) {
      return this.renderNoteViewer()
    }

    if (isEditing) {
      return this.renderNoteEditor()
    }

    return null
  }
}
