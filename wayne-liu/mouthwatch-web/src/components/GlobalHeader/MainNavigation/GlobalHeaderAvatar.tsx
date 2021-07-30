import * as React from 'react'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import AccountAvatar from '#/components/AccountAvatar'
import { EntityId } from '#/types'

const styles = require('./styles.scss')

interface Props {
  accountId: EntityId | string
}

class GlobalHeaderAvatar extends React.PureComponent<Props & RouteComponentProps> {

  rerouteToMyAccount = () => {
    this.props.history.push('/my-account')
  }

  render () {
    const { accountId } = this.props
    return (
      <div className={styles.globalHeaderAvatar} onClick={this.rerouteToMyAccount}>
        <AccountAvatar type='provider' entityId={accountId} showAccountName />
      </div>
    )
  }

}

export default withRouter(GlobalHeaderAvatar)
