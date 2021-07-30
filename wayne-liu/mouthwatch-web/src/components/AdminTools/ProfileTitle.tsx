import * as React from 'react'

import { RouteComponentProps, withRouter } from 'react-router'

import { Account } from '#/types'
import { AppState } from '#/redux'
import { AvatarUploader } from '#/components/Avatar'
import cn from 'classnames'
import { connect } from 'react-redux'

const styles = require('./titles.scss')

interface MatchParams {
  id: string
}

type OwnProps = RouteComponentProps<MatchParams>

interface StateProps {
  account: Account
}

class ProfileTitle extends React.PureComponent<OwnProps & StateProps> {
  get classNames () {
    const { account } = this.props
    return cn({
      [styles.profileTitle]: true,
      [styles.withImage]: account
    })
  }

  render () {
    const { account } = this.props
    return (
      <div className={this.classNames}>
        {
          account ?
          <>
            {
              <div className={styles.picture}>
                <AvatarUploader editPhoto account={account} />
              </div>
            }
            <div className={styles.title}>
              <h2>{account.first_name} {account.last_name}</h2>
            </div>
          </>
          :
          <h2>Create New Account</h2>
        }
      </div>
    )
  }
}

export default withRouter(connect<StateProps, {}, OwnProps, AppState>(
  (state: AppState, props) => {
    return {
      account: state.accounts.accounts[props.match.params.id]
    }
  }, null
)(ProfileTitle))
