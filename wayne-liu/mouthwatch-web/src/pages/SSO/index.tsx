import * as React from 'react'

import { AppState } from '#/redux'
import Loader from '#/components/Loader'
import { Redirect } from 'react-router-dom'
import { RouteProps } from '#/types'
import { SsoLogin } from '#/actions/sso'
import { connect } from 'react-redux'
import queryString from 'query-string'

const styles = require('./styles.scss')

type OwnProps = RouteProps

interface StateProps {
  authError?: Error
  authing: boolean
  redirectUrl?: string
}

interface ActionProps {
  ssoLogin: typeof SsoLogin
}

interface State {
  error: null | Error
}

class SsoPage extends React.Component<OwnProps & StateProps & ActionProps, State> {
  state = {
    error: null
  }

  componentDidMount () {
    const { accountId, bounceTo, token } = queryString.parse(this.props.location.search)
    this.ssoLogin(accountId, bounceTo, token)
  }

  ssoLogin = (accountId, bounceTo, token) => {
    if (!accountId) {
      this.setState({ error: new Error('No account ID provided!') })
      return
    }

    if (!bounceTo) {
      this.setState({ error: new Error('No bounceTo URL provided!') })
      return
    }

    if (!token) {
      this.setState({ error: new Error('No auth token provided!') })
      return
    }

    this.props.ssoLogin({ accountId, bounceTo, token })
  }

  renderError = (err) => (
    <div className={styles.error}>
      <p>{err.message}</p>
    </div>
  )

  renderLoading = () => (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <Loader size={50}/>
      </div>
      {this.props.authing &&
        <p>Logging In</p>}
    </div>
  )

  renderRedirect = () => (
    <Redirect to={this.props.redirectUrl}/>
  )

  render () {
    if (this.props.redirectUrl) {
      return this.renderRedirect()
    } else {
      const error = this.state.error || this.props.authError
      return (
        <div className={styles.sso}>
          {error
            ? this.renderError(error)
            : this.renderLoading()}
        </div>
      )
    }
  }
}

export default connect<{}, ActionProps, OwnProps, AppState>(
  (state) => ({
    authError: state.sso.error,
    authing: state.sso.authing,
    redirectUrl: state.sso.redirectUrl
  }),
  { ssoLogin: SsoLogin }
)(SsoPage)
