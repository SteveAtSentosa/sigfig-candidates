import * as Api from '#/api'

import { EntityId, EntityWithId } from '#/types'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { differenceBy, isEqual } from 'lodash'

import { AppState } from '#/redux'
import { FilterObject, CommonListPayload } from './types'

export interface EntityState<Entity extends EntityWithId> {
  fetching: boolean
  data: Entity[]
  page?: number
  error?: Error
}

export interface NormalizedState<Entity extends EntityWithId> {
  byId: Record<EntityId, Entity>
  allIds: EntityId[]
  current?: {
    id: EntityId
    fetching?: boolean
  }
  meta?: {
    creating: boolean
    fetching: boolean
    error?: Error
  }
  list?: {
    fetching: boolean
    dataIds: EntityId[]
    order?: string
    orderAs?: string
    sort?: Api.SortOrder
    filters?: FilterObject
    page?: number
    payload?: CommonListPayload
  }
}

const getEntitySelector = (ns: string) => (state: AppState) => state[ns]
const getByIdSelector = (ns: string) => (state: AppState, id: EntityId) => state[ns].data.find(entity => entity.id === id)
const getEntityError = (ns: string) => (state: AppState) => state[ns].error

export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

export function createSelectors<Entity extends EntityWithId> (ns: string) {
  return {
    getAll: createDeepEqualSelector(getEntitySelector(ns), (entity: EntityState<Entity>) => entity.data),
    getById: createDeepEqualSelector(getByIdSelector(ns), (entity: Entity) => entity),
    getError: createDeepEqualSelector(getEntityError(ns), (error: void | Error) => error)
  }
}

/*
  Check if the entity exist is data and depending on the function replace it completely or merge it.
*/

export function insertToData<Entity extends EntityWithId> (data: Entity[] = [], entity: Entity): Entity[] {
  const index = data.findIndex(e => e.id === entity.id)

  return index === -1 ? [...data, entity] : Object.assign([], data, { [index] : Object.assign({}, data[index], entity) })
}

export function replaceInData<Entity extends EntityWithId> (data: Entity[] = [], entity: Entity): Entity[] {
  const index = data.findIndex(e => e.id === entity.id)
  return index === -1 ? [...data, entity] : Object.assign([], data, { [index]: entity })
}

export function removeFromData<Entity extends EntityWithId> (data: Entity[], entity: Entity): Entity[] {
  return differenceBy(data, [{ id: entity.id }], 'id')
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
