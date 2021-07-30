import { EntityId, ProcedureFromForm as Procedure } from '#/types'
import { DataResponse, PaginatedDataResponse, AssociationValue, ListQueryOpts, CreateProcedureEntity, PatchedEntity } from './types'
import { makeAuthedJsonRequest, normalizeQueryOpts, buildCollisionPatch } from './common'

/**
 * Fetches a paginated list of procedures
 */
export const getProcedureList = (authToken: string) => (opts: ListQueryOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<Procedure>>('/procedures', {
    authToken,
    query: normalizeQueryOpts(opts)
  })
}

/**
 * Fetches a single procedure
 */
export const getProcedure = (authToken: string) => (id: EntityId, associations: AssociationValue): Promise<DataResponse<Procedure>> =>
  makeAuthedJsonRequest<DataResponse<Procedure>>(`/procedures/${id}`, {
    authToken,
    query: normalizeQueryOpts({ associations })
  })

/**
 * Creates a new procedure
 */
export const createProcedure = (authToken: string) => (procedure: CreateProcedureEntity) => {
  return makeAuthedJsonRequest<DataResponse<Procedure>>('/procedures', {
    authToken,
    method: 'POST',
    body: procedure
  })
}

/**
 * Edits fields of a procedure
 */
export const editProcedure = (authToken) => (id: EntityId, procedure: PatchedEntity, updatedAt: string, bypassCollisionHandling = false) => {
  return makeAuthedJsonRequest<DataResponse<Procedure>>(`/procedures/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(procedure, updatedAt, bypassCollisionHandling)
  })
}
