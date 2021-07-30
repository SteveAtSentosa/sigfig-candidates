import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Account } from '#/types'
import { AppState } from '#/redux'
import Button from '#/components/Button'
import { ForgotPassword } from '#/actions/password'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { connect } from 'react-redux'
import { pick } from 'lodash'

const styles = require('./styles.scss')

interface Props extends Modal.BaseModalProps {
  loading: boolean
  error: Error
  forgotPassword: typeof ForgotPassword
  showNotificationPopUp: typeof ShowNotificationPopUp
  // see InjectedFormProps in reduxForm.d.ts:
  // initialValues: Partial<FormData>
  account: Account | Partial<{}>
}

export class ResetPasswordModal extends React.Component<Props> {
  successAPIResult = () => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>Reset password email sent</div>) })
  }
  failureAPIResult = (error) => {
    return this.props.showNotificationPopUp({ type: 'error', content: (<div>Error: {error.message}</div>) })
  }
  reset = (account) => {
    this.props.forgotPassword({ username: account.username })
    this.props.close()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.loading === true && this.props.loading === false) {
      if (this.props.error) {
        this.failureAPIResult(this.props.error)
      } else {
        this.successAPIResult()
      }
    }
  }

  render () {
    const { close, account, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        backdrop
        keyboard
        size='sm'
        onHide={close}
        className={styles.change_password_modal}
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>Reset Password</Modal.Header>
        <Modal.Body>
          <div className={styles.resetPasswordModalBody}>
            Reset password for <strong>{(account as Account).username}</strong>? An email will be sent to this user to reset their password.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button secondary onClick={close}>Cancel</Button>
          <Button onClick={() => this.reset(account)}>Reset</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default connect(
  (state: AppState) => ({
    loading: state.password.loading,
    error: state.password.error
  }),
  {
    forgotPassword: ForgotPassword,
    showNotificationPopUp: ShowNotificationPopUp
  }
)(ResetPasswordModal)
