import React, { useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PopperWorkspace from '#/components/PopperWorkspace'
import { ToolbarUIProps } from '../types'
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./styles.scss')

type Props = Pick<ToolbarUIProps, 'openArchiveModal' | 'activatePatient'> & { isPatientArchived: boolean, patientSelected?: boolean}

const Menu: React.FC<Props> = ({ openArchiveModal, activatePatient, isPatientArchived, patientSelected }) => {

  const openMenuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<typeof PopperWorkspace>(null)

  const openMenu = () => {
    if (patientSelected) menuRef.current.show()
  }

  const closeMenu = () => menuRef.current.hide()

  return (
    <>
      <span className={styles.more} ref={openMenuButtonRef} onClick={openMenu}>
        <FontAwesomeIcon icon={faEllipsisH}/>
      </span>
      <PopperWorkspace
        flexWidth
        offset='0,0'
        targetRef={openMenuButtonRef}
        ref={menuRef}
        clickOffCb={closeMenu}
      >
        <ul>
          <li>
            <span className={styles.archivePatient} onClick={!isPatientArchived ? openArchiveModal : activatePatient}>
              {!isPatientArchived ? 'Archive' : 'Reactivate'} Patient
            </span>
          </li>
        </ul>
      </PopperWorkspace>
    </>
  )
}

export default Menu
