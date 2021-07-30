import * as React from 'react'

import AccountAvatar from '#/components/AccountAvatar'
import { Appt } from '#/types'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const styles = require('./styles.scss')

interface Props {
  appt: Appt
}

const Appointment: React.FunctionComponent<Props> = (props) => {
  const { appt } = props
  const apptLink = `/patients/appointments_detail/${appt.patient_id}/appointment/${appt.id}`

  return (

    <li key={appt.id}>
      <Link to={apptLink}>
        <div className={styles.Appointment}>
          <div className={styles.apptTime}>{format(appt.appointment_start, 'h:mm')}</div>
          <div className={styles.apptTitle}>{appt.appointment_type}</div>
          <div className={styles.apptImage}>
            <AccountAvatar height={30} width={30} type='patient' entityId={appt.patient_id}/>
          </div>
          <div className={styles.apptName}>{`${appt.patient.first_name} ${appt.patient.last_name}`}</div>
          <div className={styles.icon}><img src='/static/images/icon_chevron_right.png' /></div>
        </div>
      </Link>
    </li>
  )
}

export default Appointment
