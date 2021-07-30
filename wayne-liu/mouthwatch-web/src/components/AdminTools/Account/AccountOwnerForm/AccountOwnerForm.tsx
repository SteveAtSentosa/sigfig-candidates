import * as React from 'react'
import Label from '#/components/Form/Label'
import { State as GroupState } from '#/reducers/groups'
import { AppState } from '#/redux'
import { connect } from 'react-redux'
import { ConnectedAccountUsersField } from '#/components/Form/ConnectedFields'
import { VirtualizedOption } from '#/components/Form/ConnectedFields/ConnectedAccountUsersField'

const styles = require('./styles.scss')

interface OwnProps {
  groupId: string
  selectedAccountOwner: VirtualizedOption
  onChangeSelectedAccountOwner: (selectedAccountOwner: VirtualizedOption) => void
  onResend: () => void
  onCancel: () => void
}

interface ActionProps {
}

interface StateProps {
  groupState: GroupState
}

class AccountOwnerForm extends React.PureComponent<OwnProps & StateProps & ActionProps> {
  constructor (props: OwnProps & StateProps & ActionProps) {
    super(props)

    const { groupState: { accountOwner } } = props
    this.state = {
      selectedAccountOwner: accountOwner ? {
        label: `${accountOwner.first_name} ${accountOwner.last_name}`,
        value: accountOwner.id,
        disabled: false
      } : null
    }
  }

  render () {
    const {
      groupState,
      groupId,
      onChangeSelectedAccountOwner,
      selectedAccountOwner,
      onResend,
      onCancel
    } = this.props

    const hasPendingInvite = !!groupState.invitedAccountOwner

    return (
      <div className={styles.accountOwnerForm}>
        <div className={styles.accountOwner}>
          <Label>Account Owner:</Label>
          <div className={styles.accountOwnerSelect}>
            <ConnectedAccountUsersField
              groupId={groupId}
              onChange = {onChangeSelectedAccountOwner}
              disabled={hasPendingInvite}
              value={selectedAccountOwner}
            />
          </div>
        </div>
        <p className={styles.description}>
          The Account Owner has full billing and access rights. This is a
          required role. If you change this, we will send an email at the new
          address to confirm it. The new Owner will not become active until
          confirmed.
        </p>
        {hasPendingInvite && (
          <div className={styles.pendingBox}>
            There is a pending change to the Account Owner to {groupState.invitedAccountOwner.first_name} {groupState.invitedAccountOwner.last_name}. <a onClick={onResend}>Resend</a> or <a onClick={onCancel}>Cancel</a>
          </div>
        )}
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    groupState: state.groups
  }), {}
)(AccountOwnerForm)
