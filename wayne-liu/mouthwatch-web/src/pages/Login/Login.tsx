import * as React from 'react'

import { ClearRedirectAfterAuth, Login } from '#/actions/auth'

import { AppState } from '#/redux'
import { State as AuthState } from '#/reducers/auth'
import LoginForm from '#/components/LoginForm'
import Logo from '#/components/Logo'
import Page from '#/components/Page'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import localforage from 'localforage'

const styles = require('./styles.scss')

type OwnProps = RouteComponentProps

interface StateProps {
  auth: AuthState
}

interface ActionProps {
  login: typeof Login
  clearRedirectAfterAuth: typeof ClearRedirectAfterAuth
}

interface State {
  username?: string
  remember?: boolean
  message: null | string
}

class LoginPage extends React.PureComponent<OwnProps & StateProps & ActionProps, State> {

  state = {
    username: '',
    remember: false,
    message: null
  }

  submit = (values) => {
    // save username if "remember me" is checked
    if (values.remember) {
      localforage.setItem('userId', values.username)
        .catch(e => {
          alert(e)
        })
    }

    // attempt to login
    this.props.login({
      username: values.username,
      password: values.password,
      after: (error?: Error | string) => {
        if (error instanceof Error) {
          this.setState({
            message: error.message
          })
        } else {
          this.redirectAfterAuth(error)
        }
      }
    })
  }

  componentDidMount () {
    if (this.props.auth.data) {
      // handle already being logged in
      this.redirectAfterAuth()
    } else {
      // handle "remember me"
      localforage.getItem('userId')
        .then(value => {
          if (value && typeof value === 'string') {
            this.setState({
              username: value
            })
          }
        })
        .catch(err => {
          alert(err)
        })
    }
  }

  redirectAfterAuth = (redirectTo = '/dashboard') => {
    const { auth : { redirectTo: redirectAfterAuth }, clearRedirectAfterAuth, history } = this.props
    // if we have a stored redirect path, redirect to there instead of the passed in param
    if (redirectAfterAuth) {
      redirectTo = redirectAfterAuth
      clearRedirectAfterAuth()
    }
    history.push(redirectTo)
  }

  render () {
    const { message, ...initialValues } = this.state
    return (
      <Page title='Login'>
        <div className={styles.login}>
          <div className={styles.logo}>
            <Logo />
          </div>
          {message &&
            <div className={styles.errorMessage}>
              {'You have entered an invalid Username or Password.'}
            </div>}
          <LoginForm rememberMe onSubmit={this.submit} initialValues={initialValues} />
        </div>
        <div className={styles.footer}><a target='_blank' href=''>Contact Support</a></div>
      </Page>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    auth: state.auth
  }),
  {
    login: Login,
    clearRedirectAfterAuth: ClearRedirectAfterAuth
  }
)(LoginPage)
