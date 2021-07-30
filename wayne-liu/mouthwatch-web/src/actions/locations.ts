import * as Api from '#/api'

import { EntityId, PracticeLocation } from '#/types'

import { CallbackPayload } from './types'
import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Actions

export const LoadLocationList = defineAction('[locations] get_locations')<{ associations?: Api.AssociationValue, where?: Api.WhereValue[], page?: number, perPage?: number, order?: string, sort?: Api.SortOrder, orderAs?: string, withAppointmentCount?: boolean}>()
export const LoadLocationListSuccess = defineAction('[locations] load success (list)')<{ data: PracticeLocation[], count?: number, page?: number, perPage?: number }>()
export const LoadLocationListError = defineAction('[locations] load error (list)')<{ error: Error }>()

export const CreateLocation = defineAction('[locations] create_location')<{ data: Api.CreateLocationEntity } & CallbackPayload>()
export const CreateLocationSuccess = defineAction('[locations] create_location_success')()
export const CreateLocationError = defineAction('[locations] create_location_error')<{ error: Error }>()

export const GetLocation = defineAction('[locations] get_location')<{ id: EntityId, associations?: Api.AssociationValue }>()
export const GetLocationSuccess = defineAction('[locations] get_location_success')<{ location: PracticeLocation }>()
export const GetLocationError = defineAction('[locations] get_location_error')<{ error: Error }>()

export const EditLocation = defineAction('[locations] edit_account')<{ id: EntityId, data: Api.PatchedEntity, updated_at: string } & CallbackPayload>()
export const EditLocationSuccess = defineAction('[locations] edit_location success')()
export const EditLocationError = defineAction('[locations] edit_location error')<{ error: Error }>()

export const selectors = createSelectors<PracticeLocation>('locations')
