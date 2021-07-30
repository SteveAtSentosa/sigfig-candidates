import * as React from 'react'

import { ClearAppointmentList, LoadAppointmentList } from '#/actions/appointments'
import { endOfDay, format, isWithinRange, startOfDay } from 'date-fns'

import { AppState } from '#/redux'
import { Appt as Appointment } from '#/types'
import AppointmentList from './AppointmentList'
import ApptDatePicker from './DatePicker'
import Loader from '#/components/Loader'
import { connect } from 'react-redux'
import { getAuthAccount } from '#/actions/auth.selectors'

const styles = require('./styles.scss')

interface OwnProps {}
interface StateProps {
  appointments: Array<Appointment>
  fetching: boolean
  creating: boolean
  current_date: Date
  loggedInUser: string
}
interface ActionProps {
  loadAppointmentList: typeof LoadAppointmentList
  clearAppointmentList: typeof ClearAppointmentList
}

class UpcomingAppointmentsWidget extends React.Component<OwnProps & StateProps & ActionProps> {

  fetch = () => {
    const currentDate = startOfDay(this.props.current_date).toISOString()
    const endOfDate = endOfDay(this.props.current_date).toISOString()

    this.props.loadAppointmentList({
      where: [{ and: [{ prop: 'provider_id', comp: '=', param: this.props.loggedInUser },{ prop: 'appointment_start', comp: '>=', param: currentDate }, { prop: 'appointment_start', comp: '<=', param: endOfDate }] }],
      order: 'appointment_start',
      sort: 'ASC',
      associations: ['patient'],
      forDashboard: true,
      all: true
    })
  }

  componentDidMount () {
    this.fetch()
  }

  componentDidUpdate (prevProps) {
    const prevPropDate = format(new Date(prevProps.current_date), 'MM/DD/YY')
    const currentPropDate = format(new Date(this.props.current_date), 'MM/DD/YY')
    const sameDay = prevPropDate === currentPropDate

    if (!sameDay || (prevProps.creating && !this.props.creating)) {
      this.fetch()
    }
  }

  componentWillUnmount () {
    this.props.clearAppointmentList()
  }

  render () {
    const { appointments, current_date } = this.props

    const appts = appointments
      .filter(a => isWithinRange(a.appointment_start, startOfDay(current_date), endOfDay(current_date)))
      .sort(((a, b) => new Date(a.appointment_start).getTime() - new Date(b.appointment_start).getTime()))

    return (
      <div className={styles.upcomingApptsWidget}>
        <ApptDatePicker />
        {
          this.props.fetching
          ? <Loader />
          : <AppointmentList appts={appts} />
        }
      </div>
    )
  }
}

export default connect(
  (state: AppState) => ({
    appointments: state.appointments.dataForDashboard,
    fetching: state.appointments.fetching,
    creating: state.appointments.creating,
    current_date: state.appointments.current_date,
    loggedInUser: getAuthAccount(state).id
  }),
  {
    loadAppointmentList: LoadAppointmentList,
    clearAppointmentList: ClearAppointmentList
  }
)(UpcomingAppointmentsWidget)
