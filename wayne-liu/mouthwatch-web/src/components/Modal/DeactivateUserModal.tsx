import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Account } from '#/types'
import { AppState } from '#/redux'
import Button from '#/components/Button'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { UpdateAccount } from '#/actions/accounts'
import { connect } from 'react-redux'
import { getPatchedStatusForAccount } from '#/components/AdminTools/User/DeactivateUser'
import { pick } from 'lodash'

const styles = require('./styles.scss')

interface OwnProps extends Modal.BaseModalProps {
  account: Account
  redirect: () => void
}

interface StateProps {
  saving: boolean
  error: Error
}

interface ActionProps {
  updateAccount: typeof UpdateAccount
  showNotificationPopUp: typeof ShowNotificationPopUp
}

type Props = OwnProps & StateProps & ActionProps

export class DeactivateUserModal extends React.PureComponent<Props> {

  private successAPIResult = () => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>User deactivated</div>) })
  }

  private failureAPIResult = (error: Error) => {
    return this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: {error.message}</div>) })
  }

  private deactivateAccount = () => {
    const { account: { id, updated_at }, redirect } = this.props
    return this.props.updateAccount(getPatchedStatusForAccount(id, 'inactive', updated_at, redirect))
  }

  private close = () => {
    this.props.close()
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.saving && !this.props.saving) {
      if (!this.props.error) {
        this.close()
        this.successAPIResult()
      } else {
        this.close()
        this.failureAPIResult(this.props.error)
      }
    }
  }

  render () {
    const { close, saving, error, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='sm'
        className={styles.wrapper}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p>Are you sure you would like to deactivate this user?</p>
          </div>

        </Modal.Body>
        <Modal.Footer>
          {
            !saving &&
            <>
              <Button skinnyBtn secondary onClick={this.close}>{error ? 'Close' : 'Cancel'}</Button>
              <Button skinnyBtn onClick={this.deactivateAccount}>Confirm</Button>
            </>
          }
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    saving: state.accounts.meta.saving,
    error: state.accounts.meta.error
  }),
  {
    updateAccount: UpdateAccount,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(DeactivateUserModal)
