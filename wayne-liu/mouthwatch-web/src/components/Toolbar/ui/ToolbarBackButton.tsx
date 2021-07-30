import * as React from 'react'

import MaterialIcon, { Size } from '#/components/Icon'

import Button from '#/components/Button'
import { Link } from 'react-router-dom'
import { ToolbarUIProps } from '../types'

const styles = require('./styles.scss')

type Props = Pick<ToolbarUIProps, 'backButton' | 'backButtonLink' | 'patientId'>

const BackButton: React.FC<Props> = ({ backButton, backButtonLink, patientId }) => {
  if (!backButton || !patientId) return null
  return (
    <span className={styles.backButton}>
      <Button forToolbar>
        <Link to={backButtonLink || `/patients/detail/${patientId}`}>
          <MaterialIcon name='keyboard_arrow_left' size={Size.Small} />Back
        </Link>
      </Button>
    </span>
  )
}

export default BackButton
