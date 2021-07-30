import * as Api from '#/api'

import { EntityId, ProcedureFromForm as Procedure } from '#/types'
import { createDeepEqualSelector, createSelectors } from './common'

import { AppState } from '#/redux'
import { defineAction } from 'redoodle'

// Actions
export const SendAllProcedures = defineAction('[procedure] send_procedures_to_store')<{ data: Array<Procedure>, patientId?: EntityId }>()
export const TriggerCollectedProceduresRefresh = defineAction('[procedure] trigger_collected_procedures_refresh')<{ patientId: EntityId }>()

export const CreateProcedure = defineAction('[procedure] create_procedure')<{ data: Api.CreateProcedureEntity, patientId: EntityId, fetchPatientData: boolean }>()
export const CreateProcedureSuccess = defineAction('[procedure] create_procedure_success')<{ procedure: Procedure }>()
export const CreateProcedureError = defineAction('[procedure] create_procedure_error')<{ error: Error }>()

export const LoadList = defineAction('[procedure] load_list')<{ where?: Api.WhereValue[], associations?: Api.AssociationValue, order?: string, sort?: 'ASC' | 'DESC', includeAppointments?: boolean }>()
export const LoadListSuccess = defineAction('[procedure] load_list_success')<{ procedures: Procedure[] }>()
export const LoadListError = defineAction('[procedure] load_list_error')<{ error: Error }>()

export const UpdateProcedure = defineAction('[procedure] update_procedure')<{ id: EntityId, data: Api.PatchedEntity, patientId: EntityId, updated_at: string }>()
export const UpdateProcedureSuccess = defineAction('[procedure] update_procedure_success')()
export const UpdateProcedureError = defineAction('[procedure] update_procedure_error')<{ error: Error }>()

export const GetProcedure = defineAction('[procedure] get_procedure')<{ id: EntityId, associations: Api.AssociationValue }>()
export const GetProcedureSuccess = defineAction('[procedure] get_procedure_success')<{ procedure: Procedure }>()
export const GetProcedureError = defineAction('[procedure] get_procedure_error')<{ error: Error }>()

// Selectors

const collectedProceduresSelector = (state: AppState, patientId: EntityId) => state.procedures.collected.find(entry => entry.id === patientId)
export const getCollectedProcedures = createDeepEqualSelector(collectedProceduresSelector, record => record && !record.shouldRefresh ? record.collectedProcedures : null)

export const getProcedureById = (state: AppState, id: EntityId) => state.procedures.data.find(entry => entry.id === id)

export const selectors = createSelectors<Procedure>('procedures')
