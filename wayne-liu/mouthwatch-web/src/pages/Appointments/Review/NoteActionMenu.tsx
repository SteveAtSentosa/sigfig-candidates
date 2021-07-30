import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Note } from '#/types'
import PopperWorkspace from '#/components/PopperWorkspace'
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./styles.scss')

interface OwnProps {
  note: Note
  onViewNote?: (note: Note) => void
  onEditNote?: (note: Note) => void
  onDeleteNote?: (note: Note) => void
}

class Menu extends React.PureComponent<OwnProps> {

  menuRef = React.createRef<typeof PopperWorkspace>()
  openMenuButtonRef = React.createRef<HTMLDivElement>()

  openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    this.menuRef.current.show()
    event.stopPropagation()
  }

  closeMenu = () => {
    this.menuRef.current.hide()
  }

  handleView = (event: React.MouseEvent<HTMLLabelElement>) => {
    const { note, onViewNote } = this.props
    onViewNote(note)
    event.stopPropagation()
    this.closeMenu()
  }

  handleEdit = (event: React.MouseEvent<HTMLLabelElement>) => {
    const { note, onEditNote } = this.props
    onEditNote(note)
    event.stopPropagation()
    this.closeMenu()
  }

  handleDelete = (event: React.MouseEvent<HTMLLabelElement>) => {
    const { note, onDeleteNote } = this.props
    onDeleteNote(note)
    event.stopPropagation()
    this.closeMenu()
  }

  render () {
    const { onViewNote, onEditNote, onDeleteNote } = this.props

    return (
      <div className={styles.noteActionMenu}>
        <div ref={this.openMenuButtonRef} className={styles.icon} onClick={this.openMenu}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
        <PopperWorkspace
          flexWidth
          offset='0,10'
          targetRef={this.openMenuButtonRef}
          ref={this.menuRef}
          clickOffCb={this.closeMenu}
        >
          <div className={styles.actionMenu}>
            { onViewNote && <label onClick={this.handleView}><div>View</div></label> }
            { onEditNote && <label onClick={this.handleEdit}><div>Edit</div></label> }
            { onDeleteNote && <label onClick={this.handleDelete}><div>Delete</div></label> }
          </div>
        </PopperWorkspace>
      </div>
    )
  }
}

export default Menu
