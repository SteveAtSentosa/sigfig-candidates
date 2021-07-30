import '#/static/styles/global.scss'

import * as React from 'react'

import { Elements, RecurlyProvider } from '@recurly/react-recurly'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { persister, store } from '#/redux'

import { BounceLoader } from 'react-spinners'
import ForgotPassword from '#/pages/ForgotPassword'
import Login from '#/pages/Login'
import Logout from '#/pages/Logout'
import NotificationPopUp from '#/components/NotificationPopUp'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ProviderRegister from '#/pages/ProviderRegister'
import ResetPassword from '#/pages/ForgotPassword/ResetPassword'
import Routes from '#/app/routes'
import SMSOptIn from '#/pages/SMSOptIn'
import { ShowDiffsModal } from '#/components/Collision'
import SignUp from '#/pages/SignUp'
import SsoPage from '#/pages/SSO'
import { TreatmentPlanExport } from '#/pages/TreatmentPlanExport'
import { TreatmentPlanPreview } from '#/pages/TreatmentPlanPreview'
import VerifyAccountOwner from '#/pages/VerifyAccountOwner'
import { hot } from 'react-hot-loader'
import SubscriptionExpired from '#/pages/SubscriptionExpired'

const Loading = () => (
  <div className='splash_loading'>
    <BounceLoader size={50}/>
  </div>
)

const passProps = (Component) => (props) => <Component {...props}/>

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persister}>
      <RecurlyProvider publicKey='ewr1-5EOwXpEaSrSkjlYj6gTh5j'>
        <Elements>
          <ShowDiffsModal />
          <NotificationPopUp />
          <Router>
            <Switch>
              <Route path='/e8b8909a-8c52-11e9-bc42-526af7764f64' exact component={Login}/>
              <Route path='/' exact component={Login} />
              <Route path='/sso' exact component={SsoPage} />
              <Route path='/logout' exact component={Logout}/>
              <Route path='/signup' exact component={SignUp}/>
              {/* subscription expired */}
              <Route path='/subscription-expire' exact component={SubscriptionExpired} />
              {/* verify account owner */}
              <Route path='/verify-account-owner' exact component={VerifyAccountOwner} />
              {/* account-setup is the link sent to groupadmins */}
              <Route path='/account-setup' exact component={ProviderRegister}/>
              {/* provider-register is the link sent to all other providers */}
              <Route path='/provider-register' exact component={ProviderRegister}/>
              <Route path='/sms-opt-in' exact component={SMSOptIn} />
              <Route path='/treatmentPlanExport/:treatmentPlanId' exact component={TreatmentPlanExport}/>
              <Route path='/treatmentPlanPreview/:treatmentPlanId' exact component={TreatmentPlanPreview}/>
              <Route path='/forgot-password' component={ForgotPassword} />
              <Route path='/reset-password/:token' exact component={passProps(ResetPassword)} />
              <Route path='/help-and-legal' render={() => {
                window.location.href = ''
                return null
              }} />
              <Route path='/:page' component={Routes} />
            </Switch>
          </Router>
        </Elements>
      </RecurlyProvider>
    </PersistGate>
  </Provider>
)

export default hot(module)(App)
