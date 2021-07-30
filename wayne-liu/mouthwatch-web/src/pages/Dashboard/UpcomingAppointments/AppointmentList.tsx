import * as React from 'react'
import { getHours } from 'date-fns'
import Appointment from './Appointment'
import { Appt as Appt } from '#/types'
import { Heading8 as Heading } from '#/components/Heading'
const styles = require('./styles.scss')

interface Props {
  appts: Array<Appt>
}

const sortTimeOfDay = (appts: Array<Appt>) => {
  const sortedObject = { 'morning': [], 'afternoon': [], 'evening': [] }
  for (let i = 0; i < appts.length; i++) {
    const hour = getHours(appts[i].appointment_start)
    if (hour < 12) {
      sortedObject.morning.push(appts[i])
    } else if (hour < 16) {
      sortedObject.afternoon.push(appts[i])
    } else {
      sortedObject.evening.push(appts[i])
    }
  }
  return sortedObject
}

export default class AppointmentList extends React.Component<Props> {

  render () {
    const appts = sortTimeOfDay(this.props.appts)

    const apptsMorning = appts.morning.map((appt, i) => <Appointment appt={appt} key={i} />)
    const apptsAfternoon = appts.afternoon.map((appt, i) => <Appointment appt={appt} key={i} />)
    const apptsEvening = appts.evening.map((appt, i) => <Appointment appt={appt} key={i} />)

    return (
      <div className={styles.AppointmentList}>
        { !this.props.appts.length && <div className={styles.empty}>No appointments found</div> }
        {
          apptsMorning.length > 0 &&
            <div>
              <Heading className={styles.timeOfDay}>Morning</Heading>
              <ul>{apptsMorning}</ul>
            </div>
        }

        {
          apptsAfternoon.length > 0 &&
            <div>
              <Heading className={styles.timeOfDay}>Afternoon</Heading>
              <ul>{apptsAfternoon}</ul>
            </div>
        }

        {
          apptsEvening.length > 0 &&
            <div>
              <Heading className={styles.timeOfDay}>Evening</Heading>
              <ul>{apptsEvening}</ul>
            </div>
        }
      </div>
    )
  }
}
