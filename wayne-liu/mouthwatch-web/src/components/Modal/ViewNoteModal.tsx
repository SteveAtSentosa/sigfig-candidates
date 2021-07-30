import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { EntityId, Note } from '#/types'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import { CreatePatchedEntity } from '#/utils'
import DeleteNotesModal from '#/components/Modal/DeleteNoteModal'
import { EditNote } from '#/actions/notes'
import EditNoteModal from '#/components/Modal/AddNewNote'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PopperWorkspace from '#/components/PopperWorkspace'
import { connect } from 'react-redux'
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons'
import { pick } from 'lodash'

const styles = require('./styles.scss')

interface Props {
  data: Note
  isOpen: boolean
  close: () => void
  mediaId?: EntityId
  patientId?: EntityId
  appointmentId?: EntityId
}

interface State {
  isDeleteModalOpen: boolean
  isEditNoteModalOpen: boolean
  editNoteInitialValues: any
}

interface ActionProps {
  editNote: typeof EditNote
}

class ViewNoteModal extends React.PureComponent<Props & ActionProps, State> {

  state = {
    isDeleteModalOpen: false,
    isEditNoteModalOpen: false,
    editNoteInitialValues: null
  }

  menuRef = React.createRef<typeof PopperWorkspace>()
  openMenuButtonRef = React.createRef<HTMLDivElement>()

  openMenu = () => {
    this.menuRef.current.show()
  }

  closeMenu = () => {
    this.menuRef.current.hide()
  }

  handleOnEdit = () => {
    const { body, title } = this.props.data
    this.setState({ isEditNoteModalOpen: true, editNoteInitialValues: { title, body } })
    this.props.close()
  }

  handleOnDelete = () => {
    this.setState({ isDeleteModalOpen: true })
    this.props.close()
  }

  editNote = (values) => {
    const { data, appointmentId, mediaId, patientId } = this.props
    const patchedNote = CreatePatchedEntity(values, data)
    this.props.editNote({
      id: data.id,
      patchedNote,
      updated_at: data.updated_at,
      appointmentId: appointmentId,
      mediaId: mediaId,
      patientId: patientId
    })
    this.closeEditModal()
  }

  closeDeleteModal = () => {
    this.setState({ isDeleteModalOpen: false })
  }

  closeEditModal = () => this.setState({ isEditNoteModalOpen: false })

  render () {
    const { close, appointmentId, mediaId, patientId, ...modalProps } = this.props

    const { isDeleteModalOpen, isEditNoteModalOpen, editNoteInitialValues } = this.state
    return (
      <>
        <Modal.Wrapper
          size='md'
          onRequestClose={close}
          keyboard
          backdrop
          {...pick(modalProps, Modal.keysOfBaseModalProps)}
        >
        <Modal.Header>
          <div>Viewing Note</div>
          <Modal.HeaderButton onClick={this.openMenu}>
            <div ref={this.openMenuButtonRef} className={styles.menuEllipsis}><FontAwesomeIcon icon={faEllipsisH} /></div>
            <PopperWorkspace
              flexWidth
              offset='0,10'
              targetRef={this.openMenuButtonRef}
              ref={this.menuRef}
              clickOffCb={this.closeMenu}
            >
              <ul>
                <li><button onClick={this.handleOnEdit}>Edit</button></li>
                <li><button onClick={this.handleOnDelete}>Delete</button></li>
              </ul>
            </PopperWorkspace>
          </Modal.HeaderButton>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modalContentContainer}>
            <Grid>
              <Column col={12}>
                <div className={styles.note_title}>
                  <strong>Title: </strong>
                  <div>{this.props.data.title}</div>
                </div>
                <div className={styles.note_body}>
                  <strong>Body: </strong>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{this.props.data.body}</div>
                </div>
              </Column>
            </Grid>
          </div>
        </Modal.Body>
          <Modal.Footer>
            <Button skinnyBtn onClick={close} secondary>Close</Button>
          </Modal.Footer>
        </Modal.Wrapper>
        <DeleteNotesModal
          note={this.props.data}
          isOpen={isDeleteModalOpen}
          close={this.closeDeleteModal}
          mediaId={mediaId}
          patientId={patientId}
          appointmentId={appointmentId}
        />
        <EditNoteModal
          editNote
          close={this.closeEditModal}
          isOpen={isEditNoteModalOpen}
          handleSubmit={this.editNote}
          initialValues={editNoteInitialValues}
        />
      </>
    )
  }
}

export default connect<{}, ActionProps, Props, AppState>(null,
  {
    editNote: EditNote
  }
)(ViewNoteModal)
