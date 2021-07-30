import * as React from 'react'

import { ConnectGoogle, LoginGoogle } from '#/actions/auth'
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { SocialButton } from '#/components/Button'
import config from '#/config'
import { connect } from 'react-redux'

interface OwnProps {
  accountId?: EntityId
}

interface StateProps {
  socialMediaConnecting: boolean
}

interface ActionProps {
  loginGoogle: typeof LoginGoogle
  connectGoogle: typeof ConnectGoogle
  showNotificationPopUp: typeof ShowNotificationPopUp
}

type Props = OwnProps & StateProps & ActionProps

class Google extends React.PureComponent<Props> {
  private connectGoogle = (response: GoogleLoginResponse) => {
    const { accountId } = this.props
    const { tokenId: idToken } = response

    return this.props.connectGoogle({
      accountId,
      idToken
    })
  }

  private loginGoogle = (response: GoogleLoginResponse) => {
    const { tokenId: idToken } = response

    return this.props.loginGoogle({ idToken })
  }

  private failure = (error) => {
    // error is defined as any in react-google-login
    return this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: {error.details || (error.error as string).replace('_', ' ')}</div>) })
  }

  render () {
    const { accountId } = this.props

    return (
      <GoogleLogin
        clientId={config.credentials.googleClientId}
        render={ renderProps => (<SocialButton onClick={renderProps.onClick} type='google' />)}
        onSuccess={accountId ? this.connectGoogle : this.loginGoogle}
        onFailure={this.failure}
        cookiePolicy={'single_host_origin'}
      />
    )
  }
}

export default connect<StateProps, ActionProps, {}, AppState>(
  (state) => ({
    socialMediaConnecting: state.auth.socialMediaConnecting
  }),
  {
    loginGoogle: LoginGoogle,
    connectGoogle: ConnectGoogle,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(Google)
