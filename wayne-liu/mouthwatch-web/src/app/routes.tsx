import * as React from 'react'

import { Close, Connect, WSReadyState } from '#/microservice-middleware'
import { IoTClose, IoTConnect } from '#/actions/iot'
import { LoadVideoConference, VideoConference } from '#/pages/VideoConference'
import { Redirect, Route, RouteComponentProps, RouteProps, Switch } from 'react-router-dom'
import { addMinutes, isAfter } from 'date-fns'
import { isGroupAdmin, isSuperUser } from '#/utils'

import AdminTools from '#/pages/AdminTools'
import { AppState } from '#/redux'
import Appointments from '#/pages/Appointments'
import AudioRecorder from '#/pages/AudioRecorder'
import CaptureIntraoral from '#/pages/CaptureIntraoral'
import Chat from '#/pages/Chat'
import Dashboard from '#/pages/Dashboard'
import { GetViewPermissions } from '#/actions/ui'
import GlobalChat from '#/components/GlobalChat'
import GlobalHeader from '#/components/GlobalHeader'
import InvoiceExport from '#/pages/InvoiceExport'
import Loader from '#/components/Loader'
import { LoginResponseAccount } from '#/api'
import MyAccount from '#/pages/MyAccount'
import { NotFound } from '#/pages/404'
import PatientLogin from '#/pages/PatientLogin'
import PatientPortalHeader from '#/components/PatientPortalHeader/PatientPortalHeader'
import PatientRegister from '#/pages/PatientRegister'
import Patients from '#/pages/Patients'
import { SetOnlineStatus } from '#/actions/chat'
import { SetRedirectAfterAuth } from '#/actions/auth'
import Tasks from '#/pages/Tasks'
import { State as UIState } from '#/reducers/ui'
import config from '#/config'
import { connect } from 'react-redux'
import { getAuthAccount } from '#/actions/auth.selectors'
import { getChameleonScript } from '#/utils/Chameleon'

interface StateProps {
  account: LoginResponseAccount
  webSocketReadyState: WSReadyState
  ui: UIState
}

interface ActionProps {
  connectMicroservice: typeof Connect
  closeMicroservice: typeof Close
  connectIoTService: typeof IoTConnect
  closeIoTService: typeof IoTClose
  setOnlineStatus: typeof SetOnlineStatus
  setRedirectAfterAuth: typeof SetRedirectAfterAuth
  getViewPermissions: typeof GetViewPermissions
}

type ProtectedRouteProps = StateProps & RouteProps & {extraProps?: {[prop: string]: any}}

const mapState = (state: AppState): StateProps => {
  return {
    account: getAuthAccount(state),
    webSocketReadyState: state.microservice.readyState,
    ui: state.ui
  }
}

const mapDispatch: ActionProps = {
  connectMicroservice: Connect,
  closeMicroservice: Close,
  connectIoTService: IoTConnect,
  closeIoTService: IoTClose,
  setOnlineStatus: SetOnlineStatus,
  setRedirectAfterAuth: SetRedirectAfterAuth,
  getViewPermissions: GetViewPermissions
}

export const ProtectedRoute = connect<StateProps, {}, {}, AppState>(mapState, null)(({ component: Component, account, extraProps, ...rest }: ProtectedRouteProps) => {
  // FIXME: There has to be a better way / Add comments explaining
  return (
    <Route {...rest} render={(props) => {
      const isPatient = account && account.is_patient
      const path = (rest.path as string)
      const redirectablePaths = ['/patient-login', '/patient-register', '/']
      const allowedPatientPaths = ['/my-account', '/patient-chat']
      const viewPerms = { viewPerms: { ...rest.ui.permissions } }

      if (!account && !redirectablePaths.includes(path)) {
        // If not auth'ed, redirect to login (patient and providers)
        return <Redirect to={path === '/patient-chat' ? '/patient-login' : '/'} />
      } else if (account && isPatient && !allowedPatientPaths.includes(path)) {
        // Restrict patients to patient chat
        return <Redirect to='/patient-chat' />
      } else if (
          // Redirect super users to admin tools
          account && isSuperUser(account) && props.history.action !== 'REPLACE' &&
          ((props.history.action !== 'POP' && props.history.action !== 'PUSH') ||
          props.location.pathname === '/dashboard')
      ) {
        return <Redirect to='/admin-tools' />
      } else if (account && path === '/admin-tools' && (!isSuperUser(account) && !isGroupAdmin(account))) {
        // if you're trying to go to /admin-tools, and you're not a super user or group admin, redirect to the home page
        return <Redirect to='/' />
      } else if (account && redirectablePaths.includes(path)) {
        // If patient is already logged in, skip the login / register pages
        return <Redirect to={isPatient ? { ...props.location, pathname: '/patient-chat' } : '/dashboard'} />
      } else {
        return <Component {...viewPerms} {...props} {...extraProps} />
      }
    }}/>
  )
})

type Props = RouteComponentProps<{page: string}> & StateProps & ActionProps

const disableGlobalHeaderPages = [
  'patient-login',
  'patient-register',
  'load-video-conference',
  'invoiceExport'
]

class Routes extends React.PureComponent<Props> {

  private get renderGlobalHeader () {
    const { account } = this.props
    if (disableGlobalHeaderPages.includes(this.getActivePage) || !account) return null

    if (account.is_patient) {
      return <PatientPortalHeader accountID={account.id} groupId={account.group_id} />
    }

    return <GlobalHeader {... this.props} />
  }

  private get renderGChat () {
    if (config.features.gchat && this.props.account) {
      return <GlobalChat />
    }
  }

  private get getActivePage () {
    const activePages = [ 'login', 'dashboard', 'patients', 'tasks', 'appointments', 'admin-tools', 'chat', 'inbox', 'billing', 'settings', 'reporting', 'help-admin-legal', 'my-account', 'load-video-conference', 'patient-login', 'patient-register', 'invoiceExport' ]
    const { match: { params: { page } } } = this.props
    return activePages.includes(page) ? page : null
  }

  // try and reconnect to the chat service, set a timer for 2 seconds
  // to check if we're connected, if not try again, and so on, and so on

  private connect = () => {
    const { setOnlineStatus } = this.props
    setOnlineStatus(true)
  }

  private disconnect = () => {
    const { closeMicroservice, closeIoTService, setOnlineStatus, webSocketReadyState } = this.props
    setOnlineStatus(false)
    if (webSocketReadyState === 'OPEN' || webSocketReadyState === 'CONNECTING') {
      closeMicroservice()
    }
    closeIoTService()
  }

  private saveExpiration = () => {
    const { account } = this.props
    const expiresAt = addMinutes(new Date(), 10).toISOString()
    /*
      This check is necessary in case the user is on the patient-login or
      patient-register routes. Without this check, since the user is not authed,
      they would be redirected back to provider login.
      If/when we move patient portal to its own repo, we can remove this check.
    */
    if (account) {
      localStorage.setItem('expiresAt', expiresAt)
    }
  }

  private checkExpiration = () => {
    const { history } = this.props
    const expiresAt = localStorage.getItem('expiresAt')
    const now = new Date()
    if (expiresAt && isAfter(now, new Date(expiresAt))) {
      localStorage.removeItem('expiresAt')
      history.push('/logout')
    }
  }

  private appendChameleonScript = () => {
    const { account } = this.props
    const script = getChameleonScript(account)
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  componentDidMount () {
    this.checkExpiration()
    this.props.connectMicroservice()
    this.props.connectIoTService()
    window.ononline = this.connect
    window.onoffline = this.disconnect
    window.addEventListener('pagehide', this.saveExpiration)

    if (this.props.account) {
      if (config.features.chameleon) {
        this.appendChameleonScript()
      }

      this.props.getViewPermissions()
    }

  }

  componentWillUnmount () {
    // Clean up
    window.ononline = null
    window.onoffline = null
    window.removeEventListener('pagehide', this.saveExpiration)
  }

  render () {
    /*
      If an unauthenticated user tries to hit a page (like from an email link)
      store the page they initially requested to redirect after auth
    */
    const { account, location, ui } = this.props
    if (!account && location && location.pathname !== '/patient-register') {
      this.props.setRedirectAfterAuth({ redirectTo: location.pathname })
    }

    /*
      Wait until me endpoint comes back
      Skip this and the next condition if there is no auth account present
      (If we don't check for account, navigating to 'patient-login' will either
      load indefinitely, or redirect to logout, which will redirect to provider login)
    */
    if (ui.fetching && !!account) {
      return (
        <div className='splash_loading'>
          <Loader size={50}/>
        </div>
      )
    }

    // me endpoint failure
    if (!ui.subscriptionStatus && !!account) {
      localStorage.removeItem('expiresAt')
      return <Redirect to='/logout' />
    }
    /*
      If subscription is expired, redirect to expire screen
    */
    if (ui.subscriptionStatus === 'expired' || ui.subscriptionStatus === 'failed') {
      localStorage.removeItem('expiresAt')
      return <Redirect to='/subscription-expire' />
    }

    return (
      <Route>
        {this.renderGlobalHeader}
        <Switch location={this.props.history.location}>
          <ProtectedRoute path='/patient-register' exact component={PatientRegister} />
          <ProtectedRoute path='/patient-login' exact component={PatientLogin} />
          <ProtectedRoute path='/dashboard' exact component={Dashboard} />
          <ProtectedRoute exact path='/provider-chat/:accountId?' extraProps={{ type: 'provider' }} component={Chat} />
          <ProtectedRoute path='/patient-chat' exact extraProps={{ type: 'patient' }} component={Chat}/>
          <ProtectedRoute path='/patients' component={Patients} />
          <ProtectedRoute path='/appointments' exact component={Appointments} />
          <ProtectedRoute exact path='/capture/:id/appointment/:apptId' component={CaptureIntraoral} />
          <ProtectedRoute path='/tasks' exact component={Tasks} />
          <ProtectedRoute path='/tasks/detail/:id' component={Tasks} />
          <ProtectedRoute path='/my-account' component={MyAccount} />
          <ProtectedRoute path='/admin-tools' component={AdminTools} />
          <ProtectedRoute path='/audio/patient/:patientId/appointment/:appointmentId' exact component={AudioRecorder} />
          <ProtectedRoute path='/video' exact component={VideoConference} />
          <ProtectedRoute path='/load-video-conference/:notificationId/:videoConferenceLink' exact component={LoadVideoConference} />
          <ProtectedRoute path='/invoiceExport' exact component={InvoiceExport} />
          <Route path='/error' component={NotFound}/>
          {this.renderGChat}
          <Redirect to='/error' />
        </Switch>
      </Route>
    )
  }
}

export default connect(mapState, mapDispatch)(Routes)
