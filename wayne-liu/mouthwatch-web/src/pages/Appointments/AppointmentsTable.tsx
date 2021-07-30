import * as Api from '#/api'
import * as React from 'react'

import { ClearAppointmentList, LoadAppointmentList, SearchAppointments } from '#/actions/appointments'
import { isEmpty, pickBy } from 'lodash'

import { AppState } from '#/redux'
import { Appt } from '#/types'
import { Link } from 'react-router-dom'
import Loader from '#/components/Loader'
import Pagination from '#/components/Pagination'
import { SortOrder } from '#/api/types'
import Table from '#/components/Table'
import TableFilter from '#/components/Table/TableFilter'
import { connect } from 'react-redux'
import { format } from 'date-fns'

const styles = require('#/components/Table/styles.scss')

interface OwnProps {
  showSearch?: boolean
  showPagination?: boolean
}
interface ActionProps {
  loadAppointmentList: typeof LoadAppointmentList
  clearAppointmentList: typeof ClearAppointmentList
  searchAppointments: typeof SearchAppointments
}
interface StateProps {
  data: Array<Appt> | Error
  count?: number
  currentPage?: number
  perPage?: number | null
  fetching: boolean
  searching: boolean
  searchResults: Array<Appt>
  searchError: Error
  appointmentCreated: boolean
  loggedInUser: Api.LoginResponseAccount
}

type Props = OwnProps & ActionProps & StateProps

type Direction = 'ASC' | 'DESC'

type FilterValues = 'all' | 'upcoming' | 'past'

const DEFAULT_ORDER = 'appointment_start'
const DEFAULT_ORDER_AS = ''
const DEFAULT_SORT = 'ASC'

class AppointmentsTable extends React.PureComponent<Props> {
  state = {
    order: DEFAULT_ORDER,
    sort: DEFAULT_SORT as SortOrder,
    orderAs: DEFAULT_ORDER_AS,
    where: [],
    searchFilters: {},
    perPage: 10
  }

  tableFilter = React.createRef<any>()

  componentDidMount () {
    this.filter('upcoming')
  }

  componentDidUpdate (prevProps: Props) {
    const { current } = this.tableFilter
    if (this.props.appointmentCreated && !prevProps.appointmentCreated) {
      this.filter(current.filterValue)
    }
  }

  componentWillUnmount () {
    this.props.clearAppointmentList()
  }

  private get associations () {
    return [
      { model: 'patient' },
      { model: 'location' },
      { model: 'account', as: 'provider' }
    ]
  }

  private filter = (filter: FilterValues) => {
    switch (filter) {
      case 'all':
        this.setState({ where: [] }, this.load)
        break
      case 'upcoming':
        this.setState({ where: [{ and: [{ prop: 'appointment_start', comp: '>', param: new Date().toISOString() }] }] }, this.load)
        break
      case 'past':
        this.setState({ where: [{ and: [{ prop: 'appointment_start', comp: '<', param: new Date().toISOString() }] }] }, this.load)
        break
    }
  }

  private search = (values: any, page = 1) => {
    const { filter_first_name, filter_last_name, filter_location, filter_start_date, filter_end_date, filter_provider } = values
    const orWhere = []
    const andWhere = []
    const appointmentQuery: any = {
      associations: this.associations
    }

    if (filter_location) {
      appointmentQuery['associations'][1] = { model: 'location', where: [{ or: [{ prop: 'name', comp: 'like', param: filter_location }] }] }
    }

    if (filter_first_name) {
      orWhere.push({ prop: 'first_name', comp: 'like', param: filter_first_name })
    }

    if (filter_last_name) {
      orWhere.push({ prop: 'last_name', comp: 'like', param: filter_last_name })
    }

    if (filter_start_date) {
      andWhere.push({ prop: 'appointment_start', comp: '>=', param: filter_start_date })
    }

    if (filter_end_date) {
      andWhere.push({ prop: 'appointment_start', comp: '<=', param: filter_end_date })
    }

    if (filter_provider && filter_provider.value) {
      andWhere.push({ prop: 'provider_id', comp: '=', param: filter_provider.value })
    }

    if (orWhere.length) {
      appointmentQuery['associations'][0] = { model: 'patient', where: [{ or: orWhere }] }
    }

    if (andWhere.length) {
      appointmentQuery['where'] = [{ and: andWhere }]
    }

    this.props.loadAppointmentList({
      ...appointmentQuery,
      order: this.state.order,
      sort: this.state.sort,
      orderAs: this.state.orderAs,
      associations: [...appointmentQuery['associations']],
      perPage: this.state.perPage,
      page: page
    })

    const searchFilters = pickBy(values, value => !isEmpty(value) || value instanceof Date)
    this.setState({ where: [], searchFilters })
  }

  private handlePerPage = (perPage: number) => {
    this.setState({ perPage }, this.load)
  }

  private load = (page = 1) => {
    if (Object.keys(this.state.searchFilters).length) {
      this.search(this.state.searchFilters, page)
    } else {
      this.props.loadAppointmentList({
        where: this.state.where,
        page: page,
        perPage: this.state.perPage,
        order: this.state.order,
        sort: this.state.sort,
        orderAs: this.state.orderAs,
        associations: this.associations
      })
    }
  }

  private sortBy = (direction: Direction) => (order: string, orderAs: string) => {
    this.setState({
      sort: direction,
      order: order,
      orderAs: orderAs
    }, () => {
      this.load(this.props.currentPage)
    })
  }

  private viewButton = (data) => {
    return (
      <div><Link to={`/patients/appointments_detail/${data.patient_id}/appointment/${data.id}`}>View</Link></div>
    )
  }

  private get columns () {
    return [
      {
        name: 'Date & Time',
        accessor: 'appointment_start',
        renderCell: (date) => {
          return (
            <div>
              {format(date, 'ddd MM/DD/YYYY h:mma')}
            </div>
          )
        },
        sortBy: (sort) => this.sortBy(sort)('appointment_start', '')
      },
      {
        name: 'Patient',
        accessor: 'patient',
        renderCell: (patient) => {
          return (
            <div>
              {`${patient.first_name} ${patient.last_name}`}
            </div>
          )
        },
        sortBy: (sort) => {
          this.sortBy(sort)('patient.last_name', 'patient')
        }
      },
      {
        name: 'Provider',
        accessor: 'provider',
        renderCell: (provider) => {
          return (
            <div>
              {`${provider.first_name} ${provider.last_name}`}
            </div>
          )
        }
      },
      {
        name: 'Type',
        accessor: 'appointment_type'
      },
      {
        name: 'Location',
        accessor: 'location',
        renderCell: (location) => {
          return (
            <div>
              <span>{location && location.name}</span>
            </div>
          )
        },
        sortBy: (sort) => this.sortBy(sort)('location.name', 'location')
      }
    ]
  }

  private renderTableFilter = () => (
    this.props.showSearch &&
    <TableFilter
      ref={this.tableFilter}
      filterBy={[
        { value: 'all', text: 'All' },
        { value: 'upcoming', text: 'Upcoming' },
        { value: 'past', text: 'Past' }
      ]}
      onSearchCb={this.search}
      onFilterCb={this.filter}
      placeholderText='Search Appointments'
      defaultFilterValue='upcoming'
      hideSearchBar
      showAppointmentSearch
      searchFilters={this.state.searchFilters}
      onPerPageCb={this.handlePerPage}
    />
  )

  private renderPagination = () => (
    (this.props.count !== 0 && this.props.showPagination && !this.props.searching) &&
    <Pagination pages={Math.ceil(this.props.count / this.state.perPage)} currentPage={this.props.currentPage} handleClick={this.load} />
  )

  render () {
    return (
      <div className={styles.appointmentsTableHolder}>
        {this.renderTableFilter()}
        {
         !this.props.data || this.props.searching
          ?
          <Loader />
          :
          <Table
            className={styles.appointmentsTable}
            name='appointments'
            defaultSortByAccessor='appointment_start'
            data={this.props.data as Appt[]}
            columns={this.columns}
            actionColumnName={' '}
            actionColumn={this.viewButton}
            fetching={this.props.fetching}
          />
        }
        {this.renderPagination()}
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    data: state.appointments.data,
    fetching: state.appointments.fetching,
    count: state.appointments.count,
    currentPage: state.appointments.currentPage,
    perPage: state.appointments.perPage,
    searching: state.appointments.searching,
    searchResults: state.appointments.searchResults,
    searchError: state.appointments.searchError,
    appointmentCreated: state.notificationPopUp.show,
    loggedInUser: state.auth.data.account
  }),
  {
    loadAppointmentList: LoadAppointmentList,
    clearAppointmentList: ClearAppointmentList,
    searchAppointments: SearchAppointments
  }
)(AppointmentsTable)
