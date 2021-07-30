import * as React from 'react'

import { Account, Appt as Appointment, EntityId, Option, PracticeLocation } from '#/types'
import { LoadAppointment, UpdateAppointment, selectors } from '#/actions/appointments'

import { AppState } from '#/redux'
import { CreatePatchedEntity } from '#/utils'
import { DateFieldWithTime } from '#/components/DatePicker'
import { GetEnumPropertyOptions } from '#/actions/properties'
import { GetProvidersForSelectedPatient } from '#/actions/patients'
import Loader from '#/components/Loader'
import QuickEdit from './QuickEdit'
import { SelectInput } from '#/components/Form/Input'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

const styles = require('./styles.scss')

interface Props {
  onFinishEdit?: () => void
  appointmentId: string
}

interface StateProps {
  loadingAppointment: boolean
  appointment: Appointment | void
  locations: PracticeLocation[]
  accounts: Account[]
  properties: {
    [model: string]: {
      [property: string]: {
        fetching: boolean
        error?: Error
        options?: Array<{ label: string, value: EntityId }>
      }
    }
  }
}

interface ActionProps {
  loadAppointment: typeof LoadAppointment
  updateAppointment: typeof UpdateAppointment
  getEnumPropertyOptions: typeof GetEnumPropertyOptions
  getProvidersForSelectedPatient: typeof GetProvidersForSelectedPatient
}

export class QuickEditAppointment extends React.Component<Props & StateProps & ActionProps> {
  state = {
    appointment: {
      location_id: this.props.appointment && this.props.appointment.location_id,
      appointment_start: this.props.appointment && new Date(this.props.appointment.appointment_start).toISOString() as any,
      provider_id: this.props.appointment && this.props.appointment.provider_id,
      duration: this.props.appointment && this.props.appointment.duration,
      appointment_type: this.props.appointment && this.props.appointment.appointment_type
    }
  }

  updateField = (event, fieldName) => {
    if (fieldName === 'appointment_start') {
      this.setState({ appointment: { ...this.state.appointment, [fieldName]: event.toISOString() } })
    } else {
      this.setState({ appointment: { ...this.state.appointment, [fieldName]: event.target ? event.target.value : event } })
    }
  }

  private get locations (): Option[] {
    const { locations } = this.props
    return locations ? locations.map(location => ({ label: location.name, value: location.id })) : []
  }

  private get providers (): Option[] {
    const { accounts } = this.props
    return accounts ? accounts.map(account => ({ label: `${account.first_name} ${account.last_name}`, value: account.id })) : []
  }

  private get defaultLocation () {
    const { appointment } = this.props
    if (!appointment || !('location' in appointment)) return undefined
    const { location } = appointment
    if (!location || isEmpty(location)) return undefined
    return { label: location.name, value: location.id }
  }

  private get defaultProvider () {
    const { appointment } = this.props
    if (!appointment || !('provider' in appointment)) return undefined
    const { provider } = appointment
    return { label: `${provider.first_name} ${provider.last_name}`, value: provider.id }
  }

  private get disableProviderField () {
    const { appointment } = this.state
    if (!appointment) return true
    return !this.providers.find(option => option.value === appointment.provider_id)
  }

  private get disableLocationField () {
    const { appointment } = this.state
    if (!appointment) return true
    // if no location is assigned, but options are available
    if (!appointment.location_id && !isEmpty(this.locations)) return false
    return !this.locations.find(option => option.value === appointment.location_id)
  }

  onSubmit = () => {
    const { appointmentId, appointment, updateAppointment } = this.props
    updateAppointment({
      id: appointmentId,
      data: CreatePatchedEntity(this.state.appointment, appointment),
      updated_at: appointment && appointment.updated_at
    })
  }

  componentDidMount () {
    this.props.getEnumPropertyOptions({ model: 'appointment', property: 'appointment_type' })
    this.props.getEnumPropertyOptions({ model: 'appointment', property: 'duration' })
    if (this.props.appointment) {
      this.props.getProvidersForSelectedPatient({
        id: this.props.appointment.patient_id,
        associations: [{ model: 'group', associations: [{ model: 'group', as: 'parentGroup' }, { model: 'location' }] }],
        withLocations: true,
        forAppointments: true
      })
    }
  }

  render () {
    const { locations, accounts, properties } = this.props
    return (
      <QuickEdit name='Quick Edit: Appointment' submitButtonName='Edit Appointment' onSubmit={this.onSubmit} onFinishEdit={this.props.onFinishEdit}>

        <div className={styles.edit_appointment}>

        {
          accounts && locations
          ?
          <>
            <label>Location:</label>
            <div className={styles.input_row}>
              <SelectInput
                name='location'
                options={this.locations}
                value={this.locations.find(option => option.value === this.state.appointment.location_id) || this.defaultLocation}
                onChange={field => this.updateField(field.value, 'location_id')}
                disabled={this.disableLocationField}
              />
            </div>
            <div className={styles.input_row} >
              <label>Provider:</label>
              <SelectInput
                name='assignee'
                options={this.providers}
                value={this.providers.find(option => option.value === this.state.appointment.provider_id) || this.defaultProvider}
                onChange={field => this.updateField(field.value, 'provider_id')}
                placeholder='Provider'
                disabled={this.disableProviderField}
              />
            </div>
          </>
          :
          <Loader />
        }

          <div className={styles.input_row} >
            <label>Appointment Type:</label>
            {
              !isEmpty(properties.appointment) && !properties.appointment.appointment_type.fetching ?
                <SelectInput
                  name='appointment_type'
                  options={properties.appointment.appointment_type.options}
                  value={properties.appointment.appointment_type.options.find(option => option.label === this.state.appointment.appointment_type)}
                  onChange={field => this.updateField((field).label, 'appointment_type')}
                  placeholder='Appointment Type'
                />
              :
              <Loader/>
            }
          </div>

          <div className={styles.input_row}>
            <label>Duration:</label>
            {
              !isEmpty(properties.appointment) && !properties.appointment.duration.fetching ?
                <SelectInput
                  name='duration'
                  options={properties.appointment.duration.options}
                  value={properties.appointment.duration.options.find(option => option.label === this.state.appointment.duration)}
                  onChange={field => this.updateField((field).label, 'duration')}
                  placeholder='Duration'
                />
              :
              <Loader/>
            }
          </div>

          <div className={styles.input_row} >
            <label>Appointment Start:</label>
            <DateFieldWithTime
              name='appointment_start'
              value={this.state.appointment.appointment_start}
              onChange={(e) => this.updateField(e, 'appointment_start')}
              modifiers={{
                showTimeSelect: true,
                timeIntervals: 15,
                dateFormat: 'MM/dd/yyyy h:mm aa',
                timeCaption: 'Start Time'
              }}
            />
          </div>
        </div>

      </QuickEdit>
    )
  }
}
export default connect<StateProps, ActionProps, Props, AppState>(
  (state, props) => ({
    loadingAppointment: state.appointments.fetching,
    appointment: selectors.getById(state, props.appointmentId),
    locations: state.patients.availableLocations,
    accounts: state.patients.availableProviders,
    properties: state.properties
  }),
  {
    loadAppointment: LoadAppointment,
    updateAppointment: UpdateAppointment,
    getEnumPropertyOptions: GetEnumPropertyOptions,
    getProvidersForSelectedPatient: GetProvidersForSelectedPatient
  }
)(QuickEditAppointment)
