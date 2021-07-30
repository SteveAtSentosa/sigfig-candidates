import { defineAction } from 'redoodle'
import * as Api from '#/api'
import { ProcedureCode } from '#/types'
import { createSelectors } from './common'

// Actions

export const LoadList = defineAction('[procedure_codes] get_procedure_codes')<{ associations?: Api.AssociationValue, where?: Api.WhereValue[] }>()
export const LoadListSuccess = defineAction('[procedure_codes] load success (list)')<{ data: ProcedureCode[] }>()
export const LoadListError = defineAction('[procedure_codes] load error (list)')<{ error: Error }>()

export const selectors = createSelectors<ProcedureCode>('procedurecodes')
