import * as React from 'react'

import { AppState } from '#/redux'
import Loader from '#/components/Loader'
import { LoginResponseAccount } from '#/api/types'
import { Logout } from '#/actions/auth'
import Page from '#/components/Page'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { getAuthAccount } from '#/actions/auth.selectors'

const styles = require('./styles.scss')

type OwnProps = RouteComponentProps
interface StateProps {
  user: LoginResponseAccount
}
interface ActionProps {
  logout: typeof Logout
}

class LogoutPage extends React.Component<OwnProps & StateProps & ActionProps> {

  componentDidMount () {
    const { user, logout } = this.props
    logout({ redirect: user && user.is_patient ? '/patient-login' : '/' })
  }

  render () {
    return (
      <Page title='Logout'>
        <div className={styles.logout}>
          <div className={styles.loading}>
            <Loader />
          </div>
        </div>
      </Page>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    user: getAuthAccount(state)
  }),
  {
    logout: Logout
  }
)(LogoutPage)
