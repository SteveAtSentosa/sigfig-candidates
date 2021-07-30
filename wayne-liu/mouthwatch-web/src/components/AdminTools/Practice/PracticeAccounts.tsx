import * as React from 'react'

import { Account, EntityId } from '#/types'

import AccountUsersTable from '#/components/Table/AccountUsersTable'
import { AppState } from '#/redux'
import { PatchedEntity } from '#/api/types'
import { QuickAddSearch } from '#/components/AdminTools/QuickAddSearch'
import { UpdateAccount } from '#/actions/accounts'
import { connect } from 'react-redux'

const styles = require('#/components/AdminTools/styles.scss')

interface OwnProps {
  practiceId: EntityId
  parentGroupId: EntityId
}

interface StateProps {}

interface ActionProps {
  updateAccount: typeof UpdateAccount
}

type AddOrRemoveOp = 'add' | 'remove'

class PracticeAccounts extends React.PureComponent<ActionProps & StateProps & OwnProps> {
  private getPatchedAccount = (account: Account, op: AddOrRemoveOp): PatchedEntity => {
    const { practiceId, parentGroupId } = this.props
    const dentistryGroup = account.groups.find((group) => group.group_type.code === 'dentistry')
    const practiceIds = []

    // if the account is in other practices, don't remove those
    if (!dentistryGroup) {
      for (let i = 0; i < account.groups.length; i++) {
        if (account.groups[i].id !== practiceId) {
          practiceIds.push(account.groups[i].id)
        }
      }
    }

    // add practice to an account
    if (op === 'add') {
      practiceIds.push(practiceId)
    } else {
      // remove practice from account
      // if the account is only part of this practice, add the parent group to this account
      if (practiceIds.length === 0) {
        practiceIds.push(parentGroupId)
      }
    }

    return {
      groups: {
        op: 'replace',
        value: practiceIds
      }
    }
  }

  private addAccountToPractice = (account: Account) => {
    const patchedAccount = this.getPatchedAccount(account, 'add')
    this.props.updateAccount({ id: account.id, data: patchedAccount, updated_at: account && account.updated_at })
  }

  private removeAccountFromPractice = (account: Account, after: () => void) => {
    const patchedAccount = this.getPatchedAccount(account, 'remove')
    this.props.updateAccount({ id: account.id, data: patchedAccount, updated_at: account && account.updated_at, after })
  }

  render () {
    const { practiceId, parentGroupId } = this.props

    return (
      <>
        <h5 className={styles.sectionTitle}>Accounts</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            <QuickAddSearch
              groupId={this.props.parentGroupId}
              practiceId={this.props.practiceId}
              addAccount={this.addAccountToPractice}
            />
          </div>
          <div className={styles.row}>
            <AccountUsersTable
              practiceId={practiceId}
              groupId={parentGroupId}
              removeAccount={this.removeAccountFromPractice}
            />
          </div>
        </div>
      </>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  null,
  {
    updateAccount: UpdateAccount
  }
)(PracticeAccounts)
