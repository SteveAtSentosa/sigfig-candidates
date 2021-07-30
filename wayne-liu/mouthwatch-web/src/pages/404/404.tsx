import * as React from 'react'

import { AppState } from '#/redux'
import { Link } from 'react-router-dom'
import Page from '#/components/Page'
import { connect } from 'react-redux'
import { stateNamespace as ssoNamespace } from '#/reducers/sso'

const styles = require('./styles.scss')

interface StateProps {
  isSSO: boolean
  authed: boolean
}

export const FourOhFour = (props: StateProps) => (
  <Page title='404'>
    <div className={styles.notFound}>
      <div>
        <div className={styles.errorCode}>404</div>
        <div className={styles.errorMessage}>Page not found.</div>
        <p className={styles.message}>
          { props.isSSO ?
            `You are attempting to view a patient record that does not exist in the cloud.
              Please close this view and sync when you are connected to the internet to proceed.` :
            <div><Link to='/'>Click here</Link> to return to the { props.authed ? 'dasboard' : 'login page' }.</div>
          }
        </p>
      </div>
    </div>
  </Page>
)

export default connect<StateProps>((state: AppState) => ({
  isSSO: state[ssoNamespace].isSSO,
  authed: !!state.auth.data
}))(FourOhFour)
