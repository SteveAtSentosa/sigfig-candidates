import * as React from 'react'

import { Appt as Appointment, Patient, TaskFromAPI as Task } from '#/types'

import { AppState } from '#/redux'
import { BREAKPOINT_BS_SM } from '#/consts'
import { GlobalSearch } from '#/actions/globalSearch'
import { Heading8 } from '#/components/Heading'
import { Link } from 'react-router-dom'
import Loader from '#/components/Loader'
import ResizeDetector from 'react-resize-detector'
import { connect } from 'react-redux'
import { format } from 'date-fns'

const styles = require('./styles.scss')

interface Common<T> {
  searching: boolean
  error?: Error
  results: T[]
}

interface StateProps {
  patients: Common<Patient>
  appointments: Common<Appointment>
  tasks: Common<Task>
}

interface ActionProps {
  globalSearch: typeof GlobalSearch
}

interface OwnProps {
  closeContainer?: () => void
}

interface State {
  showAll: string
  width: number
}

class Search extends React.PureComponent<StateProps & ActionProps & OwnProps, State> {
  state = {
    showAll: '',
    width: 0
  }

  handleResize = (width: number) => {
    this.setState({ width })
  }

  handleItemClick = () => {
    if (this.state.width < BREAKPOINT_BS_SM) {
      const { closeContainer } = this.props
      if (closeContainer) closeContainer()
    }
  }

  renderPatients = () => {
    const { patients } = this.props
    if (patients.searching) {
      return <Loader/>
    } else if (patients.results.length > 0 && !patients.error) {
      return patients.results.slice(0, 5).map((patient, i) => (
        <div key={i} className={styles.searchItem} onClick={this.handleItemClick}><Link to={`/patients/detail/${patient.id}`}>{`${patient.first_name} ${patient.last_name}`}</Link></div>
      ))
    } else {
      return <div className={styles.no_results}>No results.</div>
    }
  }

  renderTasks = () => {
    const { tasks } = this.props
    if (tasks.searching) {
      return <Loader/>
    } else if (tasks.results.length > 0 && !tasks.error) {
      return tasks.results.slice(0, 5).map((task, i) => (
        <div key={i} className={styles.searchItem} onClick={this.handleItemClick}><Link to={`/tasks/detail/${task.id}`}>{task.type} by {format(task.due_date,'MM/DD/YYYY')}</Link></div>
      ))
    } else {
      return <div className={styles.no_results}>No results.</div>
    }
  }

  renderAppointments = () => {
    const { appointments } = this.props
    if (appointments.searching) {
      return <Loader/>
    } else if (appointments.results.length > 0 && !appointments.error) {
      return appointments.results.slice(0, 5).map((appointment, i) => (
        <div key={i} className={styles.searchItem} onClick={this.handleItemClick}>
          <Link to={`/patients/appointments_detail/${appointment.patient.id}/appointment/${appointment.id}`}>
            {`${appointment.patient.first_name} ${appointment.patient.last_name}'s Appointment on ${format(appointment.appointment_start, 'MM/DD/YYYY')}`}
          </Link>
        </div>
      ))
    } else {
      return <div className={styles.no_results}>No results.</div>
    }

  }

  render () {
    const { appointments, tasks, patients } = this.props

    return (

      <div className={styles.searchResults}>
        {
          !this.state.showAll
          ?
          <>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Heading8 className={styles.title}>Patients</Heading8>
                { patients.results.length > 5 && <span className={styles.viewAll} onClick={() => this.setState({ showAll: 'patients' })}>View all</span> }
              </div>
              {this.renderPatients()}
            </div>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Heading8 className={styles.title}>Appointments</Heading8>
                { appointments.results.length > 5 && <span className={styles.viewAll} onClick={() => this.setState({ showAll: 'appointments' })}>View all</span> }
              </div>
              {this.renderAppointments()}
            </div>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Heading8 className={styles.title}>Tasks</Heading8>
                { tasks.results.length > 5 && <span className={styles.viewAll} onClick={() => this.setState({ showAll: 'tasks' })}>View all</span> }
              </div>
              {this.renderTasks()}
            </div>
          </>
          :
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heading8 className={styles.title}>{this.state.showAll}</Heading8>
              <span className={styles.viewAll} onClick={() => this.setState({ showAll: '' })}>Back to results</span>
            </div>
            {
              this.state.showAll === 'patients' &&
              patients.results.map((patient, i) => (
                <div key={i} className={styles.searchItem}><Link to={`/patients/detail/${patient.id}`}>{`${patient.first_name} ${patient.last_name}`}</Link></div>
              ))
            }
            {
              this.state.showAll === 'tasks' &&
              tasks.results.map((task, i) => (
                <div key={i} className={styles.searchItem}><Link to={`/tasks/detail/${task.id}`}>{task.type}</Link></div>
              ))
            }
            {
              this.state.showAll === 'appointments' &&
              appointments.results.map((appointment, i) => (
                <div key={i} className={styles.searchItem}>
                  <Link to={`/patients/appointments_detail/${appointment.patient.id}/appointment/${appointment.id}`}>
                    {`${appointment.patient.first_name} ${appointment.patient.last_name}'s Appointment on ${format(appointment.appointment_start, 'MM/DD/YYYY')}`}
                  </Link>
                </div>
              ))
            }
          </div>
        }

        <ResizeDetector
          handleWidth
          querySelector={'body'}
          onResize={this.handleResize} />
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    patients: state.globalSearch.patients,
    appointments: state.globalSearch.appointments,
    tasks: state.globalSearch.tasks
  }),
  {
    globalSearch: GlobalSearch
  }
)(Search)
