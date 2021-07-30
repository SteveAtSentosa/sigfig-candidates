import { SetStatus } from '#/actions/chat'

export interface DefaultProps {
  className: string
  website: string
}

export type PageTitles =
'Create Account' | 'Edit Account' | 'Manage Accounts' | 'Manage Users' | 'Manage User' | 'Edit User' | 'Manage Locations' | 'Manage Practices' | 'Appointments' | 'Capture Intraoral' |
'Dashboard' | 'Forgot Password' | 'Audio Recorder' | 'Reset Password' | 'Login' | 'Logout' | 'Scheduled Maintenance' | 'Provider Chat' | 'Patient Chat' | 'Account Setup' |
'Patient Login' | 'Patient Registration' | 'Provider Login' | 'Provider Registration' | 'My Account' | 'Patients' | 'Tasks' | 'Video Conference' | 'Load Video Conference' | 'Create Location' | 'Edit Location' |
'Edit Practice' | 'Manage Groups' | 'Treatment Plan Preview' | 'Account Registration' | 'Account Consent Policy' | 'Chat' | '404' | 'Admin Tools' | 'Verify Account Owner' | 'Sign Up' | 'Subscription Expired'

export interface Props extends Partial<DefaultProps> {
  children: React.ReactNode
  title: PageTitles
  setStatus: typeof SetStatus
  isSuperAdmin: boolean
}

export type ActionProps = Pick<Props, 'setStatus'>

export type StateProps = Pick<Props, 'isSuperAdmin'>

export type OwnProps = Pick<Props, 'className' | 'children' | 'website' | 'title'>
