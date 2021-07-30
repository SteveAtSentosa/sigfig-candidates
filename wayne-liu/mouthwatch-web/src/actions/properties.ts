import { EntityId, Model } from '#/types'

import { defineAction } from 'redoodle'

// Action

export const GetEnumPropertyOptions = defineAction('[properties] load_properties')<{ model: Model, property: string }>()
export const GetEnumPropertyOptionsSuccess = defineAction('[properties] load success')<{ model: Model, property: string, options: Array<{ label: string, value: EntityId }> }>()
export const GetEnumPropertyOptionsError = defineAction('[properties] load error')<{ model: Model, property: string, error: Error }>()
