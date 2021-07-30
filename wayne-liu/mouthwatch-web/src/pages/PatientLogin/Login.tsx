import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { FacebookLogin, GoogleLogin } from '#/components/SocialMediaLogin'
import LoginForm, { FormData } from '#/components/LoginForm'
import { Props, State } from './types'

import Container from '#/components/Container'
import Copyright from '#/components/Copyright'
import HorizontalRule from '#/components/HorizontalRule'
import Page from '#/components/Page'
import config from '#/config'

const styles = require('./styles.scss')

class Login extends React.PureComponent<Props, State> {

  constructor (props) {
    super(props)
    this.state = {
      username: '',
      message: null
    }
  }

  handleOnSubmit = ({ username, password }: FormData) => {
    const { login } = this.props
    // Attempt to login
    login({
      username, password,
      after: (error?: Error) => {
        if (error) {
          this.setState({
            message: error.message
          })
        } else {
          this.props.history.replace('/')
        }
      }
    })
  }

  render () {
    const { message } = this.state
    return (
      <Page title='Login'>
        <div className={styles.ppLogin}>
          <Container className={styles.container}>
            <div className={styles.loginContainer}>
              <div className={styles.login}>
                <h2>Log into the Patient Portal</h2>
                {
                  message &&
                  <div className={styles.errorMessage}>{message}</div>
                }
                <div className={styles.loginFormContainer}>
                  <LoginForm email onSubmit={this.handleOnSubmit}/>
                </div>
                {
                  config.features.socialLogin &&
                  <>
                    <HorizontalRule width='88%'/>
                    <Grid className={styles.socialLogin}>
                      <Column col={12} md={6}>
                        <FacebookLogin />
                      </Column>
                      <Column col={12} md={6}>
                        <GoogleLogin />
                      </Column>
                    </Grid>
                  </>
                }
              </div>
            </div>
          </Container>
          <Copyright/>
        </div>
      </Page>
    )
  }
}

export default Login
