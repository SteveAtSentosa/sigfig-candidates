import * as React from 'react'

import { Account, EntityId } from '#/types'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import DeactivateAccountModal from '#/components/Modal/DeactivateUserModal'
import { PatchedEntity } from '#/api/types'
import { UpdateAccount } from '#/actions/accounts'
import { connect } from 'react-redux'

const styles = require('#/components/AdminTools/styles.scss')

interface OwnProps extends RouteComponentProps {
  account: Account
}

interface StateProps {}

interface ActionProps {
  updateAccount: typeof UpdateAccount
}

interface State {
  modalIsOpen: boolean
}

export const getPatchedStatusForAccount = (id: EntityId, newStatus: string, updated_at?: string, after?: () => void) => {
  const patchedData: PatchedEntity = {
    status: {
      op: 'replace',
      value: newStatus
    }
  }

  return {
    id,
    data: patchedData,
    updated_at,
    after
  }
}

class DeactivateUser extends React.PureComponent<ActionProps & OwnProps> {
  state: State = {
    modalIsOpen: false
  }

  private redirect = () => {
    this.props.history.push('/admin-tools/manage-users')
  }

  private toggleAccountStatus = () => {
    const { account: { id, status, updated_at } } = this.props

    if (status === 'active') {
      this.setState({ modalIsOpen: true })
    } else {
      this.props.updateAccount(getPatchedStatusForAccount(id, 'active', updated_at, this.redirect))
    }
  }

  private closeArchiveModal = () => this.setState({ modalIsOpen: false })

  private get buttonText () {
    const { account: { status } } = this.props
    return status === 'active' ? 'Deactivate' : 'Reactivate'
  }

  render () {
    const { account } = this.props
    const { modalIsOpen } = this.state

    return (
      <>
        <div className={styles.row}>
          <h5 className={styles.sectionTitle}>{this.buttonText} User</h5>
        </div>
        <div className={styles.row}>
          <div className={styles.sectionDetails}>
            <Button skinnyBtn onClick={this.toggleAccountStatus}>{this.buttonText}</Button>
          </div>
        </div>
        <DeactivateAccountModal
          account={account}
          isOpen={modalIsOpen}
          redirect={this.redirect}
          close={this.closeArchiveModal}
        />
      </>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, OwnProps, AppState>(
  null,
  {
    updateAccount: UpdateAccount
  }
)(DeactivateUser))
