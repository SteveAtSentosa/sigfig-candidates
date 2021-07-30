import * as React from 'react'

import { faEllipsisH, faExternalLinkAlt } from '@fortawesome/pro-regular-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PopperWorkspace from '#/components/PopperWorkspace'

const styles = require('./styles.scss')

interface OwnProps {
  onOpenInMediaViewer: () => void
  onAddNote: () => void
  onAddToothNumber: () => void
  onDelete: () => void
}

class Menu extends React.PureComponent<OwnProps> {

  menuRef = React.createRef<typeof PopperWorkspace>()
  openMenuButtonRef = React.createRef<HTMLDivElement>()

  openMenu = () => {
    this.menuRef.current.show()
  }

  closeMenu = () => {
    this.menuRef.current.hide()
  }

  handleView = () => {
    const { onOpenInMediaViewer } = this.props
    onOpenInMediaViewer()
    this.closeMenu()
  }

  handleAddNote = () => {
    const { onAddNote } = this.props
    onAddNote()
    this.closeMenu()
  }

  handleAddToothNumber = () => {
    const { onAddToothNumber } = this.props
    onAddToothNumber()
    this.closeMenu()
  }

  handleDelete = () => {
    const { onDelete } = this.props
    onDelete()
    this.closeMenu()
  }

  render () {
    return (
      <>
        <div ref={this.openMenuButtonRef} className={styles.icon} onClick={this.openMenu}>
          <FontAwesomeIcon className={styles.imageActionIcon} icon={faEllipsisH} size='2x' color='white' />
        </div>
        <PopperWorkspace
          flexWidth
          offset='0,10'
          targetRef={this.openMenuButtonRef}
          ref={this.menuRef}
          clickOffCb={this.closeMenu}
        >
          <div className={styles.actionMenu}>
            <label onClick={this.handleView}>
              <div><FontAwesomeIcon icon={faExternalLinkAlt} />Open In Media Viewer</div>
            </label>
            <label onClick={this.handleAddNote}><div>Add Note</div></label>
            <label onClick={this.handleAddToothNumber}><div>Add Tooth Number</div></label>
            <label onClick={this.handleDelete}><div>Delete</div></label>
          </div>
        </PopperWorkspace>
      </>
    )
  }
}

export default Menu
