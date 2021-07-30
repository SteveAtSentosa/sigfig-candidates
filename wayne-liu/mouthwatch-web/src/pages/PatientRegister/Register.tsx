import * as React from 'react'

import { NewPassword, Register } from './Forms'
import { Props, State } from './types'

import Button from '#/components/Button'
import Container from '#/components/Container'
import Copyright from '#/components/Copyright'
import { GroupConsentPolicy } from '#/types'
import { GroupLogo } from '#/components/PatientPortalHeader/GroupLogo'
import { Loads } from '#/components/Loader'
import Page from '#/components/Page'

const styles = require('./styles.scss')
const qs = require('query-string')

class Registration extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      email: '',
      one_time_password: '',
      groupConsentPolicies: [],
      currentPage: 'register'
    }
  }

  private get urlParams () {
    const { history: { location: { search } } } = this.props
    return qs.parse(search, { decode: false })
  }

  componentDidMount () {
    const { email, otp } = this.urlParams
    if (email && otp) {
      // If the URL has email and otp params, proceed to the second screen
      this.handleNextPage({
        email,
        one_time_password: otp
      })
    }
  }

  private handleNextPage = (values: Register.FormData) => {
    this.props.validate({
      ...values,
      after: (groupConsentPolicies?: GroupConsentPolicy[]) => {
        if (groupConsentPolicies) {
          this.setState({
            currentPage: 'newPassword',
            groupConsentPolicies: groupConsentPolicies,
            ...values
          })
        }
      }
    })
  }

  private handleNewPasswordSubmit = (values: NewPassword.FormData) => {
    const { email, one_time_password } = this.state

    this.props.register({
      email,
      one_time_password,
      ...values,
      after: (value?: Error | string) => {
        if (value instanceof Error) {
          this.setState({
            currentPage: 'register'
          })
        } else {
          this.props.history.push(`/sms-opt-in?patientId=${value}`)
        }
      }
    })
  }

  private renderRegister = () => (
    <Register.Form
      onSubmit={this.handleNextPage}
      initialValues={{
        email: this.urlParams.email,
        one_time_password: this.urlParams.otp
      }}
    />
  )

  private renderNewPassword = () => (
    <NewPassword.Form
      onSubmit={this.handleNewPasswordSubmit}
      consentPolicies={this.state.groupConsentPolicies}
    />
  )

  render () {
    const { auth, history } = this.props
    const { currentPage } = this.state
    return (
      <Page title='Patient Registration'>
        <Loads when={!auth.authing}>
          {() =>
            <div className={styles.ppRegister}>
              <div className={styles.logoHolder}>
                <GroupLogo groupId={this.urlParams.groupId} />
              </div>
              <Container className={styles.container}>
                {{
                  ['register']: this.renderRegister(),
                  ['newPassword']: this.renderNewPassword()
                }[currentPage]}
                <div className={styles.haveAccount}>
                  <p>Already have an account?</p>
                  <Button className={styles.loginBtn} onClick={() =>
                    history.push('/patient-login')} secondary inline transparent>Login</Button>
                </div>
              </Container>
              <Copyright />
            </div>
          }
        </Loads>
      </Page>
    )
  }
}

export default Registration
