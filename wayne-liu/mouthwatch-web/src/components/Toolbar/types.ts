import * as React from 'react'

import { Account, EntityId, Patient } from '#/types'

import { Channel } from '#/microservice-middleware'
import { CreateChannelAutoSelect } from '#/actions/chat'
import { InviteUserToPatientPortal } from '#/actions/accounts'
import { OpenModal } from '#/actions/modals'
import { RouteComponentProps } from 'react-router'
import { UpdatePatient } from '#/actions/patients'

export interface Props extends RouteComponentProps<{ patientId: string }> {
  children?: React.ReactNode
  backButton?: boolean
  backButtonLink?: string
  title?: string
  patientId?: EntityId
  showUpgradeBadge?: boolean
}

export interface ActionProps {
  updatePatient: typeof UpdatePatient
  invitePatient: typeof InviteUserToPatientPortal
  createChannelAndAutoSelect: typeof CreateChannelAutoSelect
  openModal: typeof OpenModal
}

export interface StateProps {
  patient: Patient
  channels: Channel[]
}

export interface State {
  archiveModalIsOpen: boolean
}

export interface ToolbarUIProps {
  children?: React.ReactNode
  backButton?: boolean
  backButtonLink?: string
  title?: string
  patientId?: EntityId
  patient: Patient
  archiveModalIsOpen: boolean
  openArchiveModal: () => void
  closeArchiveModal: () => void
  showUpgradeBadge?: boolean
  activatePatient: () => void
  checkThenSendMessage: (account: Account) => () => void
}
