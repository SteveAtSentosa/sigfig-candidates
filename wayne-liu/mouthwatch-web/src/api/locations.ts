import { AssociationValue, CreateLocationEntity, DataResponse, ListQueryOpts, LocationLambdaQueryOpts, PaginatedDataResponse, PatchedEntity } from './types'
import { EntityId, PracticeLocation } from '#/types'
import { buildCollisionPatch, makeAuthedJsonRequest, normalizeQueryOpts } from './common'

/**
 * Fetches a paginated list of locations
 */
export const getLocationList = (authToken: string) => (opts?: ListQueryOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<PracticeLocation>>('/locations', {
    authToken,
    query: normalizeQueryOpts(opts)
  })
}

export const getLocationListFromLambda = (authToken: string) => (opts?: LocationLambdaQueryOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<PracticeLocation>>('/locations', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, { useLambda: true })
}

/**
 * Fetches a single location
 */
export const getLocation = (authToken: string) => (id: EntityId, associations?: AssociationValue): Promise<DataResponse<PracticeLocation>> =>
  makeAuthedJsonRequest<DataResponse<PracticeLocation>>(`/locations/${id}`, {
    authToken,
    query: normalizeQueryOpts({ associations })
  })

/**
 * Searches for locations
 */
export const searchLocations = (authToken: string) => (criteria: { name?: string }) => {
  const where = JSON.stringify({
    first_name: criteria.name,
    last_name: criteria.name
  })
  return makeAuthedJsonRequest<PaginatedDataResponse<PracticeLocation>>('/locations', {
    authToken,
    query: { where }
  })
}

/**
 * Creates a new location
 */
export const createLocation = (authToken: string) => (location: CreateLocationEntity) =>
  makeAuthedJsonRequest<DataResponse<PracticeLocation>>('/locations', {
    authToken,
    method: 'POST',
    body: location
  })

/**
 * Edits fields of a location
 */
export const editLocation = (authToken) => (id: EntityId, location: PatchedEntity, updatedAt: string, bypassCollisionHandling = false) =>
  makeAuthedJsonRequest(`/locations/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(location, updatedAt, bypassCollisionHandling)
  })

/**
 * Replaces an entire location
 */
export const replaceLocation = (authToken: string) => (id: EntityId, location: PracticeLocation) =>
  makeAuthedJsonRequest(`/locations/${id}`, {
    authToken,
    method: 'PUT',
    body: JSON.stringify(location)
  })

/**
 * Deletes a location
 */
export const deleteLocation = (authToken: string) => (id: EntityId) =>
  makeAuthedJsonRequest(`/locations/${id}`, {
    authToken,
    method: 'DELETE'
  })
