import * as React from 'react'

import { InviteLinkProps, InviteLinkUIProps } from './types'

import { isEqual } from 'lodash'

const styles = require('./styles.scss')

export default class InvitePatientToPortalLink extends React.Component<InviteLinkUIProps> {

  private getLinkProps = (): InviteLinkProps => {
    const { expectAccount, newEmail, patient } = this.props

    if (patient.status === 'Archived') {
      return {
        text: 'Archived'
      }
    }

    if (!newEmail && !patient.email) {
      return {
        text: 'Email Address Needed'
      }
    }

    // if we expect the account to exist do some checks against the account
    if (expectAccount) {
      return this.checkAccountStatus()
    } else {
      return this.inactiveInviteLink
    }
  }

  private get resendText () {
    const { showStatus } = this.props
    const resendText = 'Resend Invitation Email'

    if (showStatus) {
      return `Pending - ${resendText}`
    } else {
      return this.addSaveToLinkText(resendText)
    }

  }

  // return InviteLinkObj based on the account.status OR if we expect account, wait for it to load
  private checkAccountStatus = (): InviteLinkProps => {
    const { patient: { account } } = this.props

    if (!account) {
      return {
        text: 'Loading account ...'
      }
    }
    switch (account.status) {
      case 'active':
        return {
          text: 'Registration Complete'
        }
      case 'invited':
        return {
          className: styles.statusInvited,
          onClick: () => this.props.invitePatientToPortal(),
          text: this.resendText
        }
      case 'inactive':
        return this.inactiveInviteLink
    }
  }

  private addSaveToLinkText = (linkText: string) => {
    const { newEmail, patient: { email } } = this.props
    const saveText = newEmail && !isEqual(email, newEmail) ? 'Save and ' : ''
    return `${saveText}${linkText}`
  }

  private get inactiveInviteLink (): InviteLinkProps {
    return {
      className: styles.statusInactive,
      onClick: () => this.props.invitePatientToPortal(),
      text: this.addSaveToLinkText('Invite Patient to Register')
    }
  }

  render () {
    const { className, onClick, text } = this.getLinkProps()

    return (
      <span className={styles.inviteToPatientPortalLink} onClick={onClick}>
        <span className={className}>{text}</span>
      </span>
    )
  }
}
