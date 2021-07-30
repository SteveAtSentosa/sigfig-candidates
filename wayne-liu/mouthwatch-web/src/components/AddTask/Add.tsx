import * as React from 'react'

import { Account, EntityId, Patient } from '#/types'
import { ClearProviders, GetProvidersForSelectedPatient, LoadPatientDetails, selectors } from '#/actions/patients'

import { AppState } from '#/redux'
import { CreateTask } from '#/actions/tasks'
import { CreateTaskEntity } from '#/api/types'
import Form from './Form'
import { Loads } from '#/components/Loader'
import { combineDateAndTime } from '#/utils'
import { connect } from 'react-redux'
import { omit } from 'lodash'

const styles = require('./styles.scss')

interface OwnProps {
  id: EntityId
  appointmentId?: EntityId
}

interface StateProps {
  patient: void | Patient
  creatingTask: boolean
  providers: Account[]
  fetchingPatient: boolean
  fetchingProviders: boolean
}

interface ActionProps {
  createTask: typeof CreateTask
  clearProviders: typeof ClearProviders
  getProvidersForSelectedPatient: typeof GetProvidersForSelectedPatient
  loadPatientDetails: typeof LoadPatientDetails
}

class Add extends React.PureComponent<OwnProps & StateProps & ActionProps> {

  private handleSubmit = (values) => {
    const status = { status: 'Open' }
    const appointmentId = { appointment_id: this.props.appointmentId }

    if (values.time) {
      values.due_date = combineDateAndTime(values.due_date, values.time)
      values.no_time_set = false
    } else {
      values.no_time_set = true
    }

    if (this.props.appointmentId) {
      this.props.createTask({ data: Object.assign({} as CreateTaskEntity, omit(values, 'patient', 'providerOptions', 'time'), status, appointmentId) })
    } else {
      this.props.createTask({ data: Object.assign({} as CreateTaskEntity, omit(values, 'providerOptions', 'time'), status) })
    }
  }

  componentDidMount () {
    const { id, patient } = this.props
    // necessary when navigating to Patient>Appointment>ManageTasks directly
    // to prevent the label: patientName init value from being overwritten
    this.props.getProvidersForSelectedPatient({ id, associations: [{ model: 'group', associations: [{ model: 'group', as: 'parentGroup' }] }] })
    if (!patient) {
      this.props.loadPatientDetails({ id })
    }
  }

  componentWillUnmount () {
    this.props.clearProviders()
  }

  componentDidUpdate (prevProps) {
    const { id, patient, providers, getProvidersForSelectedPatient } = this.props
    if (patient && !providers && prevProps.providers) {
      getProvidersForSelectedPatient({ id, associations: [{ model: 'group', associations: [{ model: 'group', as: 'parentGroup' }] }] })
    }
  }

  private get providers () {
    return this.props.providers.map(provider => ({ label: `${provider.first_name} ${provider.last_name}`, value: provider.id }))
  }

  private renderForm = () => {
    const { id, patient } = this.props
    const patientName = patient && `${patient.first_name} ${patient.last_name}`
    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={{
          patient: { label: patientName, value: id },
          due_date: new Date().setHours(0, 0, 0, 0),
          priority: 'Low',
          providerOptions: this.providers
        }}
        enableReinitialize
      />
    )
  }

  render () {
    const { patient, creatingTask, fetchingProviders } = this.props
    return (
      <div className={styles.add}>
        <Loads when={!creatingTask && !fetchingProviders && !!patient}>
          {this.renderForm}
        </Loads>
      </div>
    )
  }

}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state, props) => ({
    patient: selectors.getById(state, props.id),
    creatingTask: state.tasks.meta.creating,
    providers: state.patients.availableProviders,
    fetchingPatient: state.patients.fetchingPatient,
    fetchingProviders: state.patients.fetchingProviders
  }),
  {
    createTask: CreateTask,
    clearProviders: ClearProviders,
    getProvidersForSelectedPatient: GetProvidersForSelectedPatient,
    loadPatientDetails: LoadPatientDetails
  }
)(Add)
