import * as React from 'react'

import AccountUsersTable from '#/components/Table/AccountUsersTable'
import { EntityId } from '#/types'

const styles = require('#/components/AdminTools/styles.scss')

interface OwnProps {
  groupId: EntityId
}

export default class AccountUsers extends React.PureComponent<OwnProps> {
  render () {
    return (
      <>
        <h5 className={styles.sectionTitle}>Account Users</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            <AccountUsersTable
              groupId={this.props.groupId}
            />
          </div>
        </div>
      </>
    )
  }
}
