import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { Heading3 as HeadingDesktop, Heading6 as HeadingMobile } from '#/components/Heading'
import { Shorten, getDOB } from '#/utils'

import { AppState } from '#/redux'
import { Appt as Appointment } from '#/types'
import { AvatarUploader } from '#/components/Avatar'
import { Loads } from '#/components/Loader'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import { selectors } from '#/actions/appointments'

const styles = require('./styles.scss')

interface OwnProps {
  appointmentId: string
}

interface StateProps {
  loading: boolean
  appointment: Appointment | void
  token: string
}

class AppointmentHeader extends React.Component<OwnProps & StateProps> {

  private appointmentName = (appointment: Appointment) => (
    `${Shorten(appointment.patient.first_name, 20)} ${Shorten(appointment.patient.last_name, 20)}`
  )

  private renderAvatar = (appointment: Appointment) => {
    return (
      <div className={styles.avatarContainer}>
        <AvatarUploader editPhoto={true} patient={appointment.patient} />
      </div>
    )
  }

  private get emptyProperty () {
    // Make sure baseline alignment is maintained when property value is empty
    return <span style={{ color: 'white' }}>_</span>
  }

  private renderProperties = (appointment: Appointment) => {
    return (
      <>
        <Column col={12} className='d-none d-md-block'>
          <HeadingDesktop>{this.appointmentName(appointment)}</HeadingDesktop>
        </Column>
        <Column col={8} md={3}>
          <div className='d-block d-md-none'>
            <HeadingMobile>{this.appointmentName(appointment)}</HeadingMobile>
          </div>
          <div className={styles.property}>
            <label>Date</label>
            <span>{format(appointment.appointment_start, 'MM/DD/YYYY')}</span>
          </div>
          <div className={styles.property}>
            <label>Time</label>
            <span>{format(appointment.appointment_start, 'h:mma')}</span>
          </div>
        </Column>
        <Column col={12} md={3}>
          <div className={styles.property}>
            <label>DOB</label>
            <span>{getDOB(new Date(appointment.patient.dob))}</span>
          </div>
          <div className={styles.property}>
            <label>Medical Alert</label>
            <span style={{ color: appointment.patient.medical_alert && 'red' }}>{appointment.patient.medical_alert || 'None'}</span>
          </div>
        </Column>
        <Column col={12} md={3}>
          <div className={styles.property}>
            <label>Provider</label>
            <span>{appointment.provider.last_name}</span>
          </div>
          <div className={`${styles.property} ${styles.location}`}>
            <label>Location</label>
            <span>{(appointment.location && appointment.location.name) || this.emptyProperty}</span>
          </div>
        </Column>
        <Column col={12} md={3}>
          <div className={styles.property}>
            <label>Appt Type</label>
            <span>{appointment.appointment_type}</span>
          </div>
        </Column>
      </>
    )
  }

  private renderMobileDetails = (appointment: Appointment) => (
    <Grid className='no-gutters'>
      <Column col={4} md={2}>
        {this.renderAvatar(appointment)}
      </Column>
      {this.renderProperties(appointment)}
    </Grid>
  )

  private renderDesktopDetails = (appointment: Appointment) => (
    <Grid>
      <Column col={4} sm={2}>
        {this.renderAvatar(appointment)}
      </Column>
      <Column col={10}>
        <Grid className='no-gutters'>
          {this.renderProperties(appointment)}
        </Grid>
      </Column>
    </Grid>
  )

  render () {
    const { appointment } = this.props
    return (
      !!appointment && !(appointment instanceof Error) &&
      <Loads when={!!appointment.patient && !!appointment.provider}>
        {
          () =>
          <div className={styles.header}>
            <div className={styles.container}>
              <div className={`${styles.details} d-block d-md-none`}>{this.renderMobileDetails(appointment)}</div>
              <div className={`${styles.details} d-none d-md-block`}>{this.renderDesktopDetails(appointment)}</div>
            </div>
          </div>
        }
      </Loads>
    )
  }

}

export default connect<StateProps, {}, OwnProps, AppState>(
  (state, props) => ({
    loading: state.appointments.fetching,
    appointment: selectors.getById(state, props.appointmentId),
    token: state.auth.data.token
  }), null
)(AppointmentHeader)
