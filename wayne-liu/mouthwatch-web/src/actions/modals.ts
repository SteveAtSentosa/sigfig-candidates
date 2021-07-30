import { EntityId } from '#/types'
import { defineAction } from 'redoodle'

type ModalTypes = 'confirmTitle' | 'sendTreatmentPlan' | 'videoRecord' | 'chatDisconnect' | 'patientWelcome' | 'confirmInvitation' | 'subscriptionChangeModal'

// Actions

interface OpenModalPayload {
  modal: ModalTypes
  patientId?: EntityId
  treatmentPlanId?: EntityId
  accountId?: EntityId
  text?: string
  sendToChatOnCancel?: boolean
  sendToChatOnConfirm?: boolean
  fireCallback?: boolean
  callback?: (id: string) => void
}

export const OpenModal = defineAction('[modals] open')<OpenModalPayload>()
export const CloseModal = defineAction('[modals] close')<{ modal: ModalTypes, fireCallback?: boolean }>()
export const ThrowError = defineAction('[modals] error')<{ modal: ModalTypes, error: Error }>()
