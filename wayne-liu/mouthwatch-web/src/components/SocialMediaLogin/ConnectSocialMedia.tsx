import * as React from 'react'

import { FacebookLogin, GoogleLogin } from '#/components/SocialMediaLogin'

import { AppState } from '#/redux'
import { LoginResponseAccount } from '#/api/types'
import { connect } from 'react-redux'

const styles = require('./styles.scss')

interface StateProps {
  account: LoginResponseAccount
}

class ConnectSocialMedia extends React.PureComponent<StateProps> {
  private get socialMediaConnected () {
    const { google_id, facebook_id } = this.props.account
    return google_id || facebook_id
  }

  private renderConnectSocialMedia = () => {
    const { account: { id } } = this.props
    return(
      <>
        Link your social media account for quicker login.
        <div className={styles.socialBtns}>
          <FacebookLogin accountId={id} />
          <GoogleLogin accountId={id} />
        </div>
      </>
    )
  }

  render () {
    return (
      <div className={styles.connectSocialMedia}>
          {
            this.socialMediaConnected ?
            'Social media connected.'
            :
            this.renderConnectSocialMedia()
          }
      </div>
    )
  }
}

export default connect<StateProps, {}, {}, AppState>(
  (state) => ({
    account: state.auth.data.account
  }),
  null
)(ConnectSocialMedia)
