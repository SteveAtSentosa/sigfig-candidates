import { Appt as Appointment, EntityId } from '#/types'
import { AppointmentEntity, AssociationValue, CollisionDataResponse, DataResponse, ListQueryOpts, PaginatedDataResponse, PatchedEntity, UrlOpts } from './types'
import { buildCollisionPatch, makeAuthedJsonRequest, normalizeQueryOpts } from './common'

/**
 * Fetches a paginated list of appointments
 */
export const getAppointmentList = (authToken: string) => (opts: ListQueryOpts, urlOpts?: UrlOpts) => {
  return makeAuthedJsonRequest<PaginatedDataResponse<Appointment>>('/appointments', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, urlOpts)
}

/**
 * Fetches a single appointment
 */
export const getAppointment = (authToken: string) => (id: EntityId, associations: AssociationValue): Promise<DataResponse<Appointment>> => {
  return makeAuthedJsonRequest<DataResponse<Appointment>>(`/appointments/${id}`, {
    authToken,
    query: normalizeQueryOpts({ associations })
  })
}

/**
 * Searches for appointments
 */
export const searchAppointments = (authToken: string) => (criteria: { name?: string }) => {
  const where = JSON.stringify({
    first_name: criteria.name,
    last_name: criteria.name
  })
  return makeAuthedJsonRequest<PaginatedDataResponse<Appointment>>('/appointments', {
    authToken,
    query: { where }
  })
}

/**
 * Creates a new appointment
 */
export const createAppointment = (authToken: string) => (appointment: Appointment): Promise<DataResponse<Appointment>> => {
  return makeAuthedJsonRequest<DataResponse<Appointment>>('/appointments', {
    authToken,
    method: 'POST',
    body: appointment
  })
}

/**
 * Edits fields of a appointment
 */
export const editAppointment = (authToken) => (id: EntityId, appointment: PatchedEntity, updatedAt: string, bypassCollisionHandling = false): Promise<CollisionDataResponse<Appointment>> => {
  return makeAuthedJsonRequest<CollisionDataResponse<Appointment>>(`/appointments/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(appointment, updatedAt, bypassCollisionHandling)
  })
}

/**
 * Replaces an entire appointment
 */
export const replaceAppointment = (authToken: string) => (id: EntityId, appointment: AppointmentEntity) =>
  makeAuthedJsonRequest<DataResponse<AppointmentEntity>>(`/appointments/${id}`, {
    authToken,
    method: 'PUT',
    body: {
      ...appointment,
      id: undefined
    }
  })

/**
 * Deletes an appointment
 */
export const deleteAppointment = (authToken: string) => (id: EntityId) =>
  makeAuthedJsonRequest(`/appointments/${id}`, {
    authToken,
    method: 'DELETE'
  })
