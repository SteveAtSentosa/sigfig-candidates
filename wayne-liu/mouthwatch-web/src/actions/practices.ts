import * as Api from '#/api'

import { AdminToolsSearchPracticesPayload, CallbackPayload } from './types'
import { EntityId, Group } from '#/types'

import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Actions

export const GetPractices = defineAction('[practices] get_practices')<{ associations?: Api.AssociationValue, where?: Api.WhereValue[], page?: number, perPage?: number, order?: string, sort?: Api.SortOrder, orderAs?: string }>()
export const GetPracticesSuccess = defineAction('[practices] load success (list)')<{ data: Group[], count?: number, page?: number, per_page?: number }>()
export const GetPracticesError = defineAction('[practices] load error (list)')<{ error: Error }>()

export const AdminToolsSearchPractices = defineAction('[practices] admin_tools_search_practices')<AdminToolsSearchPracticesPayload>()

export const CreatePractice = defineAction('[practices] create_practice')<{ data: Api.CreateGroupEntity } & CallbackPayload>()
export const CreatePracticeSuccess = defineAction('[practices] create_practice_success')()
export const CreatePracticeError = defineAction('[practices] create_practice_error')<{ error: Error }>()

export const GetPracticeById = defineAction('[practices] get_practice_by_id')<{ id: EntityId }>()
export const GetPracticeByIdSuccess = defineAction('[practices] get_practice_by_id_success')<{ practice: Group }>()
export const GetPracticeByIdError = defineAction('[practices] get_practice_by_id_error')<{ error: Error }>()

export const selectors = createSelectors<Group>('practices')
