import * as Api from '#/api'

import { Appt as Appointment, CreateAppt, EntityId } from '#/types'

import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Actions

export const UpdateAppointment = defineAction('[appointments] update_appointment')<{ id: string, data: Api.PatchedEntity, updated_at: string }>()
export const UpdateAppointmentSuccess = defineAction('[appointments] update_appointment_success')()
export const UpdateAppointmentError = defineAction('[appointments] update_appointment_error')<{ error: Error }>()

export const SetCurrentDate = defineAction('[appointments] set_current_date')<{ date: Date }>()

export const ReloadAppointments = defineAction('[tasks] reload_appointments')()

export const LoadAppointment = defineAction('[appointment] load')<{ id: string, associations: Api.AssociationValue }>()
export const LoadAppointmentSuccess = defineAction('[appointment] load success (single)')<{ appointment: Appointment }>()
export const LoadAppointmentError = defineAction('[appointment] load error (single)')<{ id: string, error: Error }>()

export const LoadAppointmentList = defineAction('[appointment] load appointment list')<{ associations: Api.AssociationValue, where?: Api.WhereValue[], page?: number, perPage?: number | null, order?: string, sort?: Api.SortOrder, orderAs?: string, forDashboard?: boolean, all?: boolean }>()
export const LoadAppointmentListSuccess = defineAction('[appointment] load success (list)')<{ data: Appointment[], count: number, page: number, perPage?: number | null, forDashboard?: boolean }>()
export const LoadAppointmentListError = defineAction('[appointment] load error (list)')<{ error: Error }>()

export const SearchAppointments = defineAction('[appointment] search')<{ associations?: Api.AssociationValue, where?: Api.WhereValue[], page?: number, perPage?: number | null, order?: string, sort?: Api.SortOrder, orderAs?: string, orWhere?: Api.WhereValue[] }>()
export const SearchAppointmentsSuccess = defineAction('[appointment] search success')<{ data: Appointment[], count: number, page: number, perPage?: number | null }>()
export const SearchAppointmentsError = defineAction('[appointment] search error')<{ error: Error }>()

export const CreateAppointment = defineAction('[appointment] create_appointment')<{ data: CreateAppt, redirectToCapture?: boolean }>()
export const CreateAppointmentSuccess = defineAction('[appointment] create_appointment_success')()
export const CreateAppointmentError = defineAction('[appointment] create_appointment_error')<{ error: Error }>()

export const DeleteAppointment = defineAction('[appointment] delete')<{ id: EntityId, patientId: EntityId }>()
export const DeleteAppointmentSuccess = defineAction('[appointment] delete success')<{ appointmentId: EntityId }>()
export const DeleteAppointmentError = defineAction('[appointment] delete error')<{ error: Error}>()

export const ClearAppointmentList = defineAction('[appointments] clear list')()
export const ClearDeleteError = defineAction('[appointments] clear delete error')()

export const selectors = createSelectors<Appointment>('appointments')
