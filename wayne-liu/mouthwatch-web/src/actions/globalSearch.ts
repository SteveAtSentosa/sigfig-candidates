import { defineAction } from 'redoodle'
import { TaskFromAPI as Task, Appt as Appointment, Patient } from '#/types'

// Actions

export const GlobalSearch = defineAction('[global] search')<{ searchTerm: string }>()

export const SearchAppointments = defineAction('[global] search appointments')<{ searchTerm: string }>()
export const SearchAppointmentsSuccess = defineAction('[global] search appointments success')<{ count: number, appointments: Appointment[] }>()
export const SearchAppointmentsError = defineAction('[global] search appointments error')<{ error: Error }>()

export const SearchTasks = defineAction('[global] search tasks')<{ searchTerm: string }>()
export const SearchTasksSuccess = defineAction('[global] search tasks success')<{ count: number, tasks: Task[] }>()
export const SearchTasksError = defineAction('[global] search tasks error')<{ error: Error }>()

export const SearchPatients = defineAction('[global] search patients')<{ searchTerm: string }>()
export const SearchPatientsSuccess = defineAction('[global] search patients success')<{ count: number, patients: Patient[] }>()
export const SearchPatientsError = defineAction('[global] search patients error')<{ error: Error }>()
