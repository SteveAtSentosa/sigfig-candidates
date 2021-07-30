import { Account, Appt as Appointment, EntityId, ProcedureCode } from '#/types'
import { ClearProviders, GetProvidersForSelectedPatient } from '#/actions/patients'

import { CreateProcedure } from '#/actions/procedures'
import { LoadList } from '#/actions/procedurecodes'

export interface StateProps {
  creating: boolean
  providers: Account[]
  procedureCodes: ProcedureCode[]
}

export interface ActionProps {
  createProcedure: typeof CreateProcedure
  clearProviders: typeof ClearProviders
  getProvidersForSelectedPatient: typeof GetProvidersForSelectedPatient
  getProcedureCodes: typeof LoadList
}

export interface OwnProps {
  appointmentId?: EntityId
  patientId?: EntityId
  appointment?: Appointment
  fetchPatientData?: boolean
  afterSubmit?: () => void
}

export interface ReduxFormState {
  planStatus: string
  isToothModalOpen: boolean
  toothModalInputValue: string
  toothModalValues: Array<{ label: string, value: string }>
  isSurfaceModalOpen: boolean
  surfaceModalInputValue: string
  surfaceModalValues: Array<{ label: string, value: string }>
}
