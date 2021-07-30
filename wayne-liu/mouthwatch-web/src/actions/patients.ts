import * as Api from '#/api'

import { Account, AccountLookup, EntityId, Group, Media, Note, Patient, PracticeLocation, ProcedureFromForm as Procedure } from '#/types'
import { GetPatientsOpts, GetPatientsOptsWhere, GetPatientsSuccessOpts, PatientDetailAssociations } from './types'
import { ParametricSelector, Selector, createSelector } from 'reselect'

import { AccountsSelector } from './accounts'
import { AppState } from '#/redux'
import { createSelectors } from './common'
import { defineAction } from 'redoodle'

export const GetProvidersForSelectedPatient = defineAction('[patient] get providers for selected patient')<{ id: string, associations: Api.AssociationValue, withLocations?: boolean, forAppointments?: boolean }>()

export const GetPatients = defineAction('[patient] get patients')<GetPatientsOpts>()
export const GetPatientsSuccess = defineAction('[patients] load list success')<GetPatientsSuccessOpts>()
export const GetPatientsError = defineAction('[patients] load list error')<{ error: Error }>()

export const GetPatientsForDropdownSuccess = defineAction('[patient] get patients for dropdown success')<GetPatientsSuccessOpts>()

export const LoadList = defineAction('[patient] load list')<GetPatientsOpts>()

export const LoadPatient = defineAction('[patient] load')<{ id: string, associations?: Api.AssociationValue, collectedMedia?: boolean, collectedProcedures?: boolean, replace?: boolean}>()

export const LoadPatientDetails = defineAction('[patient] load details')<{ id: EntityId, associations?: PatientDetailAssociations, waitForAll?: boolean }>()
export const LoadPatientSuccess = defineAction('[patient] load details success')<{ patient: Patient, replace?: boolean }>()
export const LoadPatientError = defineAction('[patient] load details error')<{ error: Error }>()

export const LoadPatientAccount = defineAction('[patient] load account')<{ id: EntityId, associations?: PatientDetailAssociations }>()
export const LoadPatientAccountSuccess = defineAction('[patient] load account success')<{ id: EntityId, account: Account }>()

export const LoadPatientGroups = defineAction('[patient] load groups')<{ id: EntityId, associations?: PatientDetailAssociations }>()
export const LoadPatientGroupsSuccess = defineAction('[patient] load groups success')<{ id: EntityId, groups: Group[] }>()

export const LoadPatientNotes = defineAction('[patient] load notes')<{ id: string }>()
export const LoadPatientNotesSuccess = defineAction('[patient] load notes success')<{ id: EntityId, notes: Note[] }>()

export const LoadPatientProceduresSuccess = defineAction('[patient] load procedures success')<{ patientId: EntityId, procedures: Procedure[]}>()

export const LoadPatientDocuments = defineAction('[patient] load documents')<{ id: string }>()
export const LoadingPatientDocuments = defineAction('[patient] loading documents')()
export const LoadPatientDocumentsSuccess = defineAction('[patient] load document success')<{ patientId: EntityId, media: Media[]}>()

export const LoadPatientMediaSuccess = defineAction('[patient] load media success')<{ patientId: EntityId, media: Media[]}>()

export const WithProviders = defineAction('[patient] get available providers for patient')<{ patient: Patient }>()
export const StoreProviders = defineAction('[patient] store available providers')<{ providers: Account[] }>()
export const WithLocations = defineAction('[patient] get available locations for patient')<{ patient: Patient }>()
export const StoreLocations = defineAction('[patient] store available locations')<{ locations: PracticeLocation[] }>()

export const UpdatePatient = defineAction('[patient] update')<{ id: EntityId, patient: Api.PatchedEntity, updated_at: string }>()
export const UpdatePatientSuccess = defineAction('[patient] update success')()
export const UpdatePatientError = defineAction('[patient] update error')<{ error: Error}>()

export const SaveAndInviteToPortal = defineAction('[patient] save and invite to portal')<{ id: EntityId, patient: Api.PatchedEntity, updated_at: string }>()

export const ArchivePatient = defineAction('[patient] archive')<{ id: EntityId, patient: Patient }>()
export const ArchivePatientSuccess = defineAction('[patient] archive success')<{ patient: Patient }>()
export const ArchivePatientError = defineAction('[patient] archive error')<{ error: Error}>()

export const PreDeletePatient = defineAction('[patient] pre delete')<{ id: EntityId }>()
export const PreDeletePatientSuccess = defineAction('[patient] pre delete success')<{ message: string }>()
export const PreDeletePatientError = defineAction('[patient] pre delete error')<{ error: Error}>()

export const DeletePatient = defineAction('[patient] delete')<{ id: EntityId, patient: Patient }>()
export const DeletePatientSuccess = defineAction('[patient] delete success')<{ patient: Patient }>()
export const DeletePatientError = defineAction('[patient] delete error')<{ error: Error}>()

export interface PatientSearchOpts {
  where?: GetPatientsOptsWhere | Api.WhereValue[]
  appointmentWhere?: Api.WhereValue[]
  order?: Api.SortOrder | string
  sort?: Api.SortOrder | string
  page: number
  per_page: number
  orderAs?: string
  forDropdown?: boolean
}

export type PatientsSelector = Selector<AppState, Patient[]>
export type PatientIDSelector = Selector<AppState, string>

export const SearchPatients = defineAction('[patient] search')<PatientSearchOpts>()
export const AdvancedSearchPatients = defineAction('[patient] advanced search')<PatientSearchOpts>()
export const SearchPatientsSuccess = defineAction('[patient] search success')<{ where: GetPatientsOptsWhere | Api.WhereValue[], page: number, patients: Patient[], count: number, forDropdown?: boolean }>()
export const SearchPatientsError = defineAction('[patient] search error')<{ error: Error, forDropdown?: boolean }>()
export const SearchLoadMore = defineAction('[patient] search load more')<{ per_page: number }>()
export const SearchLoadMoreSuccess = defineAction('[patient] search load more success')<{ patients: Patient[], page: number }>()
export const SearchLoadMoreError = defineAction('[patient] search load more error')<{ error: Error }>()

export const CreatePatient = defineAction('[patient] create_patient')<{ data: Api.CreatePatientEntity, quickCapture?: boolean }>()
export const CreatePatientSuccess = defineAction('[patient] create_patient_success')()
export const CreatePatientError = defineAction('[patient] create_patient_error')<{ error: Error }>()

export const ClearPatientList = defineAction('[patients] clear data')()
export const ClearPatientSearchResults = defineAction('[patients] clear search results data')()
export const ClearSearchDropdownResults = defineAction('[patients] clear search data for dropdown')()
export const ClearArchiveError = defineAction('[patients] clear archive error')()
export const ClearDeleteError = defineAction('[patients] clear delete error')()
export const ClearProviders = defineAction('[patients] clear providers')()
export const ClearLocations = defineAction('[patients] clear locations')()
export const SelectPatient = defineAction('[patients] select patient')<EntityId>()

export const patientsSelector: PatientsSelector = state => state.patients.data
export const patientsForDropdownSelector: PatientsSelector = state => state.patients.dropdown.data

// State Selectors
export const accountToPatientSelector: ParametricSelector<AppState, { patientAccountID: string }, Patient> = (state, props) => state.patients.data.find(patient => patient.account_id === props.patientAccountID)
export const patientIdPropSelector: ParametricSelector<AppState, { patientId: EntityId }, string> = (_state, props) => props.patientId
export const patientIDSelector: PatientIDSelector = state => state.patients.selectedPatient

// Combiners
export const _getAssociatedPatientAccount = (associatedPatientAccount: Patient) => associatedPatientAccount || null

export const _getAccountByPatientId = (patientId: EntityId, accounts: AccountLookup, patients: Patient[]) => {
  const patient = patients.find(p => p.id === patientId)
  return accounts[patient.account_id]

}

export const accountsSelector: AccountsSelector = state => state.accounts.accounts
// Memoized Selectors
export const getPatientByAccountID = createSelector(accountToPatientSelector, _getAssociatedPatientAccount)
export const getAccountByPatientId = createSelector(patientIdPropSelector, accountsSelector, patientsSelector, _getAccountByPatientId)

export const selectors = createSelectors<Patient>('patients')
