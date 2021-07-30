import * as React from 'react'

import { Appt as Appointment, ViewPermissions } from '#/types'
import { ClearMedia, SendAllMedia } from '#/actions/media'
import { EssentialPosting, EssentialTasks } from '#/components/Essential'
import { LoadAppointment, selectors } from '#/actions/appointments'
import { Route, RouteComponentProps, Switch } from 'react-router'
import TabMenu, { TabConfig } from '#/components/TabMenu'
import { hasPermission, showUpgradeBadge } from '#/utils'

import AddCodes from './AddCodes/AddCodes'
import { AppState } from '#/redux'
import Button from '#/components/Button'
import { ClearItems } from '#/actions/bulkSelect'
import CollectData from './CollectData/CollectData.container'
import ExportButton from '#/components/Media/ExportButton'
import Header from './Header'
import ManageTasks from './ManageTasks'
import PopperWorkspace from '#/components/PopperWorkspace'
import { QuickEditAppointment } from '#/components/QuickEdit'
import Review from './Review'
import Toolbar from '#/components/Toolbar'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'

const styles = require('./styles.scss')

/**
 * Appointment details
 */
export type Pane =
  | 'collect_data'
  | 'add_codes'
  | 'manage_tasks'

interface OwnProps {
  appointmentId: string
  patientId?: string
  pane?: Pane
}

interface StateProps {
  fetching: boolean
  postingMedia: boolean
  data: Appointment
  error: Error
  viewPerms: ViewPermissions
}
interface ActionProps {
  loadAppointment: typeof LoadAppointment
  sendAllMedia: typeof SendAllMedia
  clearMedia: typeof ClearMedia
  clearItems: typeof ClearItems
}

type Props = OwnProps & StateProps & ActionProps

class AppointmentDetail extends React.Component<Props> {
  quickActionRef = React.createRef<HTMLDivElement>()
  popperAppointmentRef = React.createRef<typeof PopperWorkspace>()
  openPopperActive = null

  hidePopper = () => {
    if (this.openPopperActive) {
      this.openPopperActive.current.hide()
      this.openPopperActive = null
    }
  }

  openPopper = (ref) => {
    if (this.openPopperActive) {
      this.openPopperActive.current.hide()
    }
    this.openPopperActive = ref

    ref.current.show()
    this.setState({ popperOpen: true })
  }

  get tabConfig (): TabConfig[] {
    const { appointmentId, patientId, viewPerms } = this.props

    return [
      {
        text: 'Collect Data',
        url: `/patients/appointments_detail/${patientId}/appointment/${appointmentId}`

      },
      {
        text: 'Add Codes',
        url: `/patients/appointments_detail/${patientId}/appointment/${appointmentId}/codes`,
        showProBadge: !hasPermission(viewPerms, 'procedure_codes')
      },
      {
        text: 'Manage Tasks',
        url: `/patients/appointments_detail/${patientId}/appointment/${appointmentId}/tasks`,
        showProBadge: !hasPermission(viewPerms, 'tasks')
      },
      {
        text: 'Review',
        url: `/patients/appointments_detail/${patientId}/appointment/${appointmentId}/review`
      }
    ]
  }

  private renderCodes = () => {
    const { appointmentId, patientId, viewPerms } = this.props
    return hasPermission(viewPerms, 'procedure_codes') ? <AddCodes patientId={patientId} appointmentId={appointmentId} /> : <EssentialPosting />
  }

  private renderTasks = () => {
    const { appointmentId, patientId, viewPerms } = this.props
    return hasPermission(viewPerms, 'tasks') ? <ManageTasks patientId={patientId} appointmentId={appointmentId} /> : <EssentialTasks />
  }

  renderRoutes = () => {
    const { appointmentId, patientId } = this.props
    return (
      <div style={{ marginTop:  40 }}>
        <Route render={(routeProps: RouteComponentProps) => {
          return (
            <Switch>
              <Route exact path={`${routeProps.match.path}/codes`} render={this.renderCodes}/>
              <Route exact path={`${routeProps.match.path}/tasks`} render={this.renderTasks}/>
              <Route exact path={`${routeProps.match.path}/review`} render={() => <Review patientId={patientId} appointmentId={appointmentId} />}/>
              <Route path={`${routeProps.match.path}/`} render={() => <CollectData patientId={patientId} appointmentId={appointmentId}/>}/>
            </Switch>
          )
        }} />
      </div>
    )
  }

  load = () => {
    /*
      FIXME: Normalization
      Once appointments is normalized, we can have the individual tabs and components
      fetch the necessary appointment data, rather than all at once when this component mounts
      Note: currently, the saga simulates this behavior by breaking the below request up
      into six different requests and merging the results before adding them to state
    */
    this.props.loadAppointment({
      id: this.props.appointmentId,
      associations: [
        { model: 'account', as: 'provider' },
        { model: 'patient' },
        { model: 'location' },
        { model: 'media', associations: [{ model: 'note' }] },
        { model: 'note', associations: [{ model: 'account', as: 'createdBy' }] },
        { model: 'task' }
      ]
    })
  }

  componentDidMount () {
    this.load()
  }

  componentDidUpdate (prevProps) {
    if (this.props.data && prevProps.data) {
      if (!isEqual(this.props.data.media, prevProps.data.media)) {
        this.props.sendAllMedia({ data: this.props.data.media })
      }
    }
    if (prevProps.postingMedia && !this.props.postingMedia && !this.props.error) {
      this.load()
    }
  }

  componentWillUnmount () {
    this.props.clearMedia()
    this.props.clearItems()
  }

  private renderToolbar = () => {
    const { patientId, viewPerms } = this.props

    return (
      <Toolbar showUpgradeBadge={showUpgradeBadge(viewPerms, ['tasks', 'procedure_codes', 'treatment_plan_builder'])} backButtonLink={`/patients/detail/${patientId}/appointments`} backButton patientId={patientId}>
        <Button onClick={() => this.openPopper(this.popperAppointmentRef)} forToolbar>
          <span ref={this.quickActionRef}>Edit Appointment Details</span>
        </Button>
        <ExportButton />
      </Toolbar>
    )
  }

  private renderMobileNavMenu = () => {
    return (
      <TabMenu
        forMobile
        noDefaultActive
        tabs={this.tabConfig}
        tabClassName={styles.tabMobile}
        activeTabClassName={styles.tabMobileActive}
        menuClassName={styles.appointmentDetailMobileNav}
      />
    )
  }

  private renderNavMenu = () => {
    return (
      <TabMenu
        noDefaultActive
        tabs={this.tabConfig}
        tabClassName={styles.tab}
        activeTabClassName={styles.tabActive}
        menuClassName={styles.appointmentDetailNav}
      />
    )
  }

  private renderQuickEditAppointment = () => {
    const { appointmentId } = this.props
    return (
      <PopperWorkspace
      flexWidth offset={'-10vw,1vw'}
      targetRef={this.quickActionRef}
      ref={this.popperAppointmentRef}
      clickOffCb={this.hidePopper}
      >
        <QuickEditAppointment
          appointmentId={appointmentId}
          onFinishEdit={this.hidePopper}
        />
      </PopperWorkspace>
    )
  }

  render () {
    const { appointmentId } = this.props

    return (
      <div className={styles.appointmentDetails}>
        { this.renderToolbar() }
        { this.renderMobileNavMenu() }
        <Header appointmentId={appointmentId} />
        <div style={{ paddingLeft: 40, paddingRight: 40 }}>
          { this.renderNavMenu() }
          { this.renderRoutes() }
        </div>
        { this.renderQuickEditAppointment() }
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState, props) => ({
    fetching: state.appointments.fetching,
    data: selectors.getById(state, props.appointmentId),
    postingMedia: state.media.posting,
    error: state.appointments.error,
    viewPerms: state.ui.permissions
  }),
  {
    loadAppointment: LoadAppointment,
    sendAllMedia: SendAllMedia,
    clearMedia: ClearMedia,
    clearItems: ClearItems
  }
)(AppointmentDetail)
