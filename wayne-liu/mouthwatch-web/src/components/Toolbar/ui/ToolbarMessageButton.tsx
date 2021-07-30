import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToolbarUIProps } from '../types'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const styles = require('./styles.scss')

type Props = Pick<ToolbarUIProps, 'patient' | 'checkThenSendMessage'> & { isPatientArchived: boolean }

const MessageButton: React.FC<Props> = ({ patient, checkThenSendMessage, isPatientArchived }) => {

  const shouldShowMessageButton = patient && patient.email && patient.account && !isPatientArchived

  if (!shouldShowMessageButton) return null

  return (
    <a href='#' className={styles.messagePatient} onClick={checkThenSendMessage(patient.account)}>
      Message Patient
      <FontAwesomeIcon icon={faEnvelope}/>
    </a>
  )
}

export default MessageButton
