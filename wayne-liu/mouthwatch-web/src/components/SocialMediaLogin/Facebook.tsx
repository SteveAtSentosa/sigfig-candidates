import * as React from 'react'

import { ConnectFacebook, LoginFacebook } from '#/actions/auth'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
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
  loginFacebook: typeof LoginFacebook
  connectFacebook: typeof ConnectFacebook
}

interface State {
  renderLogin: boolean
}

type Props = OwnProps & StateProps & ActionProps

class Facebook extends React.PureComponent<Props, State> {
  state: State = {
    renderLogin: false
  }

  private connectFacebook = (response) => {
    const { accountId } = this.props
    // status 'unknown' happens when the user hits cancel or closes the Facebook Login window
    // we shouldn't do anything unless they get a successful response

    if (response.status !== 'unknown') {
      const { userID: facebookId, accessToken } = response
      this.props.connectFacebook({
        accountId,
        facebookId,
        accessToken
      })
    }
  }

  private loginFacebook = (response) => {
    // status 'unknown' happens when the user hits cancel or closes the Facebook Login window
    // we shouldn't do anything unless they get a successful response
    if (response.status !== 'unknown') {
      const { userID: facebookId, accessToken } = response
      this.props.loginFacebook({ facebookId, accessToken })
    }
  }

  private setRenderLoginTrue = () => {
    this.setState({ renderLogin: true })
  }

  render () {
    const { accountId } = this.props
    const { renderLogin } = this.state

    return (
      <>
        {
          renderLogin
          ?
          <FacebookLogin
            appId={config.credentials.facebookAppId}
            autoLoad
            callback={accountId ? this.connectFacebook : this.loginFacebook}
            render={ _renderProps => (<SocialButton type='facebook' />) }
          />
          :
          <SocialButton onClick={this.setRenderLoginTrue} type='facebook' />
        }

      </>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    socialMediaConnecting: state.auth.socialMediaConnecting
  }),
  {
    loginFacebook: LoginFacebook,
    connectFacebook: ConnectFacebook
  }
)(Facebook)
