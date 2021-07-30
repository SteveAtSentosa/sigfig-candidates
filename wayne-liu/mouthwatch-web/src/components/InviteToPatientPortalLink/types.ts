import { EntityId, Patient } from '#/types'

import { InviteUserToPatientPortal } from '#/actions/accounts'
import { OpenModal } from '#/actions/modals'

export interface OwnProps {
  newEmail?: string
  patientId: EntityId
  showStatus?: boolean
  expectAccount?: boolean
  saveAndInvite?: () => void
}

export interface StateProps {
  patient: Patient
}

export interface ActionProps {
  openModal: typeof OpenModal
  invitePatient: typeof InviteUserToPatientPortal
}

export interface InviteLinkProps {
  text: string
  onClick?: () => void
  className?: string
}

export interface InviteLinkUIProps {
  patient: Patient
  newEmail?: string
  showStatus?: boolean
  expectAccount?: boolean
  invitePatientToPortal?: () => void
}
