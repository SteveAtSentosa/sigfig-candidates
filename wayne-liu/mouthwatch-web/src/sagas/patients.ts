import * as Actions from '#/actions/patients'
import * as Api from '#/api'
import * as React from 'react'

import { Account, EntityId, Group, Media, Note, Patient, PracticeLocation } from '#/types'
import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { difference, flatten, intersection, isPlainObject, uniq, uniqBy } from 'lodash'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { AddCreatorsById } from '#/actions/notes'
import { AppState } from '#/redux'
import { ClearSelectedChannel } from '#/actions/chat'
import { CreateAppointment } from '#/actions/appointments'
import { CreateOptionsFromValues } from '#/utils'
import { InviteUserToPatientPortal } from '#/actions/accounts'
import { SendAllMedia } from '#/actions/media'
import { SendAllProcedures } from '#/actions/procedures'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { ThrowCollisionStart } from '#/actions/collisions'
import { Touch } from '#/microservice-middleware'
import { format } from 'date-fns'

// Sagas
export function* saga () {
  yield all([
    takeLatest(Actions.GetPatients.TYPE, getPatientsSaga),
    takeLatest(Actions.GetProvidersForSelectedPatient.TYPE, getProvidersForSelectedPatientSaga),
    takeLatest(Actions.LoadPatient.TYPE, loadPatientSaga),
    takeLatest(Actions.UpdatePatient.TYPE, updatePatientSaga),
    takeEvery(Actions.ArchivePatient.TYPE, archivePatientSaga),
    takeEvery(Actions.DeletePatient.TYPE, deletePatientSaga),
    takeEvery(Actions.PreDeletePatient.TYPE, preDeletePatientSaga),
    takeLatest(Actions.SearchPatients.TYPE, searchPatientsSaga),
    takeLatest(Actions.SearchLoadMore.TYPE, searchLoadMoreSaga),
    takeLatest(Actions.CreatePatient.TYPE, createPatientSaga),
    takeEvery(Actions.WithProviders.TYPE, withAvailableProvidersSaga),
    takeEvery(Actions.WithLocations.TYPE, withAvailableLocationsSaga),
    takeLatest(Actions.SaveAndInviteToPortal.TYPE, saveAndInviteToPortalSaga),
    takeLatest(Actions.LoadPatientAccount.TYPE, loadPatientAccountSaga),
    takeLatest(Actions.LoadPatientDetails.TYPE, loadPatientDetailsSaga),
    takeEvery(Actions.LoadPatientGroups.TYPE, loadPatientGroupsSaga),
    takeLatest(Actions.LoadPatientDocuments.TYPE, loadPatientDocumentsSaga),
    takeLatest(Actions.LoadPatientNotes.TYPE, loadPatientNotesSaga),
    takeLatest(Actions.AdvancedSearchPatients.TYPE, advancedSearchPatientsSaga)
  ])
}

const normalizePatientPropertiesForQuery = (data: Api.CreatePatientEntity): Api.CreatePatientEntity => {
  const convertedPatient = {}
  for (const key in data) {
    switch (key) {
      case 'groups':
        const groupIds = []
        data[key].forEach((group) => {
          groupIds.push(group['value'])
        })
        convertedPatient[key] = groupIds
        break
      case 'dob':
        convertedPatient[key] = format(data[key], 'YYYY-MM-DD')
        break
      case 'send_invite':
      case 'assignee':
        break
      default:
        if (isPlainObject(data[key])) {
          convertedPatient[key] = data[key]['value']
        } else {
          convertedPatient[key] = data[key]
        }
    }
  }
  return convertedPatient as Api.CreatePatientEntity
}

export function* createPatientSaga (action: ReturnType<typeof Actions.CreatePatient>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data, quickCapture } = action.payload

    const { data: patient } = yield call(Api.createPatient(authToken), normalizePatientPropertiesForQuery(data))
    if (data.send_invite) {
      if (!patient.account_id) throw new Error('Cannot invite this patient: account is required.')
      yield put(InviteUserToPatientPortal({ accountId: patient.account_id }))
    }
    const successMessage = React.createElement('div', null, React.createElement('a', { href: `/patients/detail/${patient.id}` }, `${patient.first_name} ${patient.last_name}`), ' has been added')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
    yield put(Actions.CreatePatientSuccess())
    yield put(Actions.LoadPatientDetails({
      id: patient.id,
      associations: {
        notes: true,
        documents: true
      }
    }))

    if (quickCapture) {
      const { created_by: { id: providerId }, id: patientId } = patient

      const appointmentData = {
        appointment_start: new Date(),
        provider_id: providerId,
        patient_id: patientId
      }

      yield put(CreateAppointment({ data: appointmentData, redirectToCapture: true }))
    }
    /* if we created an account for the patient (email was present) update the chat users */
    if (patient.account_id) {
      yield put(Touch({ updateUsers: true }))
    }
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Error: Patient may already exist.' }))
    yield put(Actions.CreatePatientError({ error }))
  }
}

export function* getPatientsSaga (action: ReturnType<typeof Actions.GetPatients>) {
  try {
    const { where, page, per_page, sort = 'last_name', order = 'ASC', orderAs, forDropdown } = action.payload
    const authToken = yield select(getAuthToken)
    const { data: patients, count } = yield call(Api.getPatientsFromLambda(authToken), { page, per_page, sort, order, order_as: orderAs, ...where })
    yield put(Actions.GetPatientsSuccess({ patients, page, count }))
    if (forDropdown) {
      yield put(Actions.GetPatientsForDropdownSuccess({ patients, page, count }))
    }
  } catch (error) {
    yield put(Actions.GetPatientsError({ error }))
  }
}

function getGroupIdsAndParentIds (groups: Group[]): string[] {
  let groupIds = []
  groups.forEach(group => {
    if (group.group_type_code === 'practice') {
      groupIds.push(group.id, group.parent_id)
    } else {
      groupIds.push(group.id)
    }
  })
  return uniq(groupIds)
}

export function* getProvidersForSelectedPatientSaga (action: ReturnType<typeof Actions.GetProvidersForSelectedPatient>) {
  try {
    const authToken = yield select(getAuthToken)
    const authAccount = yield select(getAuthAccount)
    const { id, withLocations } = action.payload
    /* if we only want providers, we have to use v2.0 and filter by accountRole association */
    const { data }: Api.PaginatedDataResponse<Account> = yield call(Api.getAccountListFromLambda(authToken), {
      is_patient: true,
      inactive: false
    })

    // Filter out hssales users
    const accounts = data.filter(account => !account.account_roles.map(role => role.name).includes('hssales'))

    if (id === 'none' || !id) {
      // i.e. no patient assignment (for tasks specifically)
      yield put(Actions.StoreProviders({ providers: accounts.sort((a, b) => a.last_name.localeCompare(b.last_name)) }))
    } else {
      // Attempt to fetch all providers and locations (if specified) given a patient id
      // fetch patient groups
      const { data: patientGroups }: Api.PaginatedDataResponse<Group> = yield call(
        Api.getPatientGroupsFromLambda(authToken), id
      )
      // create array of group ids (including parent groups)
      const patientGroupIds = getGroupIdsAndParentIds(patientGroups)

      // get caller's groups
      const { data: callerGroups }: Api.PaginatedDataResponse<Group> = yield call(
        Api.getAccountGroupsFromLambda(authToken), authAccount.id
      )
      // include parent groups
      const callerGroupIds = getGroupIdsAndParentIds(callerGroups)

      // create a unique array of shared group ids
      const providersGroupIds = intersection(patientGroupIds, callerGroupIds)

      // fetch non-patient accounts for each group id
      const effectsAccounts = providersGroupIds.map(pId => call(Api.getGroupAccountsFromLambda(authToken), pId, { is_patient: false } as Api.GroupLambdaQueryOpts))
      const providers: Api.PaginatedDataResponse<Account>[] = yield all(effectsAccounts)
      const availableProviders = uniqBy(flatten(providers.map(d => d.data)), 'id')
      // store providers in redux to be used in dropdown
      yield put(Actions.StoreProviders({
        providers: availableProviders.sort((a, b) => a.last_name.localeCompare(b.last_name))
      }))

      if (withLocations) {
        // fetch locations for each group id
        const effectsLocations = providersGroupIds.map(pId => call(Api.getGroupLocationsFromLambda(authToken), pId))
        const locations: Api.PaginatedDataResponse<PracticeLocation>[] = yield all(effectsLocations)
        const availableLocations = uniqBy(flatten(locations.map(l => l.data)), 'id')
        // store locations in redux to be used in dropdown
        yield put(Actions.StoreLocations({ locations: availableLocations }))
      }
    }
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: `Error: ${error.message}` }))
  }
}

export function* loadPatientSaga (action: ReturnType<typeof Actions.LoadPatient>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id, associations, collectedMedia, collectedProcedures, replace } = action.payload
    const { data: patient } = yield call(Api.getPatient(authToken), id, associations)
    const { tasks, media, procedures, appointments, treatment_plans } = patient
    const loadedPatients = yield select(state => state.patients.data)
    const patientInStore = loadedPatients.find(p => p.id === patient.id)
    let allMedia = media || (patientInStore && patientInStore['media']) || []
    let allProcedures = procedures || (patientInStore && patientInStore['procedures']) || []
    if (tasks) {
      for (let i = 0; i < tasks.length; i++) {
        tasks[i] = Object.assign(tasks[i], { patient: { first_name: patient.first_name, last_name: patient.last_name, id: patient.id } })
        tasks[i] = CreateOptionsFromValues(['patient'], tasks[i])
      }
    }

    // gather media from all appointments, including notes on media
    if (collectedMedia && appointments && treatment_plans) {
      treatment_plans.forEach(treatmentPlan => {
        const { media: nestedMedia } = treatmentPlan
        const nestedPlanPDF = nestedMedia
          .filter(media => media.type === 'exam-rpt')
          .map(media => ({ ...media, treatment_plan_id: treatmentPlan.id }))
        allMedia = allMedia.concat(nestedPlanPDF)
      })
      for (let a = 0; a < appointments.length; a++) {
        // attempting to fetch the necessary associations in the loadPatient action will typically crash the server
        const { data: apptWithMedia } = yield call(Api.getAppointment(authToken), appointments[a].id, [{ model: 'media', associations: [{ model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }, { model: 'account', as: 'createdBy' }] }])
        const { media: nestedMediaWithNote } = apptWithMedia
        allMedia = allMedia.concat(nestedMediaWithNote)
      }
      yield put(SendAllMedia({ data: allMedia, patientId: id }))
    }

    // gather procedures from all appointments
    if (collectedProcedures && appointments) {
      for (let a = 0; a < appointments.length; a++) {
        const { data: apptWithProcedures } = yield call(Api.getAppointment(authToken), appointments[a].id, [{ model: 'procedure', associations: [{ model: 'account', as: 'provider' }] }])
        const { procedures: nestedProcedures } = apptWithProcedures
        allProcedures = allProcedures.concat(nestedProcedures)
      }
      yield put(SendAllProcedures({ data: allProcedures, patientId: id }))
    }

    yield put(Actions.LoadPatientSuccess({ patient: Object.assign({}, patient, { media: allMedia, procedures: allProcedures }), replace }))
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

function* withAvailableProvidersSaga (action: ReturnType<typeof Actions.WithProviders>) {
  const { patient } = action.payload
  const providersWithoutDuplicates = patient.groups.reduce<Account[]>((accumulatedProviders, currentProvider) => {
    return [...accumulatedProviders, ...currentProvider.accounts ]
    .filter((provider, index, array) => index === array.findIndex(p => p.id === provider.id))
  }, [])

  yield put(Actions.StoreProviders({ providers: providersWithoutDuplicates.sort((a, b) => a.last_name.localeCompare(b.last_name)) }))
}

function* withAvailableLocationsSaga (action: ReturnType<typeof Actions.WithLocations>) {
  const { patient } = action.payload
  const authToken = yield select(getAuthToken)
  const patientLocations: PracticeLocation[] = patient.groups.reduce<PracticeLocation[]>((acc, curr) => {
    return [...acc, ...curr.locations]
    // if the indexes are different that means it exists earlier in the array and should not be included.
    .filter((location, index, array) => index === array.findIndex(l => l.id === location.id))
  },[])
  const { data: callerLocations }: Api.PaginatedDataResponse<PracticeLocation> = yield call(Api.getLocationList(authToken))
  const concatLocations = patientLocations.concat(callerLocations)
  const patientLocationIds = patientLocations.map(l => l.id)
  const callerLocationIds = callerLocations.map(l => l.id)
  const locationIds = intersection(patientLocationIds, callerLocationIds)
  const locations = locationIds.map(id => concatLocations.find(l => l.id === id))
  yield put(Actions.StoreLocations({ locations }))
}

function* updatePatientSaga (action: ReturnType<typeof Actions.UpdatePatient>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id, patient: patch, updated_at } = action.payload
    const { data } = yield call(Api.editPatient(authToken), id, patch, updated_at)
    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'patients' }))
    } else {
      yield put(Actions.UpdatePatientSuccess())
      yield put(Actions.LoadPatientDetails({
        id: data.id,
        associations: {
          notes: true,
          documents: true
        }
      }))
      yield put(ShowNotificationPopUp({ type: 'success', content: 'Information saved' }))
      if (patch.status) {
        yield put(Touch({ updateUsers: true }))
      } else if (patch.email) {
        yield put(Touch({ updateUsers: false }))
      }
    }

  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: `Error: ${error.message}` }))
    yield put(Actions.UpdatePatientError({ error }))
  }
}

function* archivePatientSaga (action: ReturnType<typeof Actions.ArchivePatient>) {
  const { id, patient } = action.payload

  try {
    const authToken = yield select(getAuthToken)
    // first, check for open tasks / upcoming appointments
    const { data: tasks } = yield call(Api.getTaskList(authToken), { associations: [{ model: 'patient', where: [{ prop: 'id', comp: '=', param: id }] }], where: [{ and: [{ prop: 'status', comp: '=', param: 'Open' }] }] }, { useV2: true })
    const { data: appointments } = yield call(Api.getAppointmentList(authToken), { where: [{ and: [{ prop: 'patient_id', comp: '=', param: id }, { prop: 'appointment_start', comp: '>', param: format(new Date(), 'YYYY-MM-DD') }] }] })
    if (tasks.length || appointments.length) {
      throw new Error(`This patient has ${tasks.length ? 'open tasks' : ''}${tasks.length && appointments.length ? ' and ' : ''}${appointments.length ? 'upcoming appointments' : ''}. You must resolve upcoming items before you may proceed.`)
    }
    const { data: editedPatient } = yield call(Api.editPatient(authToken), id, { status: { op: !patient.status ? 'add' : 'replace', value: 'Archived' } }, patient.updated_at)

    // if the user was registered, refresh chat users
    if (editedPatient.account_id) {
      yield put(Touch({ updateUsers: true }))
      yield put(ClearSelectedChannel())
    // reset selectedChannel
    }

    // **********
    // TODO: Collision check here
    // **********
    yield put(Actions.ArchivePatientSuccess({ patient: editedPatient }))
  } catch (error) {
    yield put(Actions.ArchivePatientError({ error }))
  }
}

function* preDeletePatientSaga (action: ReturnType<typeof Actions.PreDeletePatient>) {
  const { id } = action.payload

  try {
    const authToken = yield select(getAuthToken)
    // first, check for open tasks / upcoming appointments
    const { data: tasks } = yield call(Api.getTaskList(authToken), { associations: [{ model: 'patient', where: [{ prop: 'id', comp: '=', param: id }] }] })
    const { data: appointments } = yield call(Api.getAppointmentList(authToken), { where: [{ and: [{ prop: 'patient_id', comp: '=', param: id }] }] })
    let message = ''
    if (tasks.length || appointments.length) {
      message = `This patient has ${tasks.length ? `${tasks.length} ${tasks.length > 1 ? 'tasks' : 'task'}` : ''}${tasks.length && appointments.length ? ' and ' : ''}${appointments.length ? `${appointments.length} ${appointments.length > 1 ? 'appointments' : 'appointment'}` : ''}.`
    }
    yield put(Actions.PreDeletePatientSuccess({ message }))
  } catch (error) {
    yield put(Actions.PreDeletePatientError({ error }))
  }
}

function* deletePatientSaga (action: ReturnType<typeof Actions.DeletePatient>) {
  const { id, patient } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    yield call(Api.deletePatient(authToken), id)
    yield put(Actions.DeletePatientSuccess({ patient }))
  } catch (error) {
    yield put(Actions.DeletePatientError({ error }))
  }
}

function* searchPatientsSaga (action: ReturnType<typeof Actions.SearchPatients>) {
  const { page, where, per_page, forDropdown, sort, order, orderAs } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const { data: patients, count } = yield call(Api.getPatientList(authToken), { where: where as Api.WhereValue[], per_page, sort, order, order_as: orderAs, associations: [{ model: 'media' }] })
    yield put(Actions.SearchPatientsSuccess({ where, page, patients, count, forDropdown }))
  } catch (error) {
    yield put(Actions.SearchPatientsError({ error }))
  }
}

function* advancedSearchPatientsSaga (action: ReturnType<typeof Actions.AdvancedSearchPatients>) {
  const { page, where, per_page, forDropdown, sort, order, orderAs } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const { data: patients, count } = yield call(Api.getPatientsFromLambda(authToken), { ...where, per_page, sort, order, order_as: orderAs })
    yield put(Actions.SearchPatientsSuccess({ where, page, patients, count, forDropdown }))
  } catch (error) {
    yield put(Actions.SearchPatientsError({ error }))
  }
}

function* searchLoadMoreSaga (action: ReturnType<typeof Actions.SearchLoadMore>) {
  const { per_page } = action.payload
  try {
    const { where, page } = yield select((state: AppState) => state.patients.search)
    const authToken = yield select(getAuthToken)
    const { data: patients } = yield call(Api.getPatientsFromLambda(authToken), { where, page: page + 1, per_page })
    yield put(Actions.SearchLoadMoreSuccess({ patients, page: page + 1 }))
  } catch (error) {
    yield put(Actions.SearchLoadMoreError({ error }))
  }
}

export function* saveAndInviteToPortalSaga (action: ReturnType<typeof Actions.SaveAndInviteToPortal>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id, patient: patch, updated_at } = action.payload

    const { data } = yield call(Api.editPatient(authToken), id, patch, updated_at)
    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'patients' }))
    } else {
      yield put(Actions.UpdatePatientSuccess())

      // invite the patient
      if (!data.account_id) throw new Error('Cannot invite this patient: account is required.')
      yield put(InviteUserToPatientPortal({ accountId: data.account_id }))
      if (patch.email) {
        yield put(Touch({ updateUsers: false }))
      }
    }
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: 'Unable to save. A patient with this name and birthday may already exist.' }))
    yield put(Actions.UpdatePatientError({ error }))
  }
}

export function* loadPatientDetailsSaga (action: ReturnType<typeof Actions.LoadPatientDetails>) {
  try {
    const { id, associations } = action.payload
    const authToken = yield select(getAuthToken)

    // fetch the patient data from the service
    const { data: patient } = yield call(Api.getPatientFromLambda(authToken), id)

    // get already loaded patient data
    const loadedPatients: Patient[] = yield select(state => state.patients.data)
    const patientInStore = loadedPatients.find(p => p.id === patient.id)

    const allMedia = (patientInStore && patientInStore['media']) || []
    const allProcedures = (patientInStore && patientInStore['procedures']) || []
    const allNotes = (patientInStore && patientInStore['notes']) || []

    // return the patient details so some components can load
    yield put(Actions.LoadPatientSuccess({ patient: Object.assign({}, patient, { notes: allNotes, media: allMedia, procedures: allProcedures }), replace: true }))

    if (associations) {
      if (associations.documents) {
        yield fork(loadPatientDocuments, id, allMedia)
      }

      if (associations.notes) {
        yield fork(loadPatientNotes, id)
      }

      if (associations.account && patient.account_id) {
        yield fork(loadPatientAccount, id)
      }
    }
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

export function* loadPatientAccountSaga (action: ReturnType<typeof Actions.LoadPatientAccount>) {
  try {
    const { id } = action.payload
    yield loadPatientAccount(id)
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

function* loadPatientAccount (id: EntityId) {
  const authToken = yield select(getAuthToken)
  const { data: account } = yield call(Api.getPatientAccountFromLambda(authToken), id)
  if (account.last_email_sent_by_id) {
    const { data: { first_name, last_name } } = yield call(Api.getAccountFromLambda(authToken), account.last_email_sent_by_id)
    account.lastEmailSentBy = first_name + ' ' + last_name
  }
  yield put(Actions.LoadPatientAccountSuccess({ id, account }))
}

export function* loadPatientGroupsSaga (action: ReturnType<typeof Actions.LoadPatientGroups>) {
  try {
    const { id } = action.payload
    const authToken = yield select(getAuthToken)
    const { data: groups } = yield call(Api.getPatientGroupsFromLambda(authToken), id)
    yield put(Actions.LoadPatientGroupsSuccess({ id, groups }))
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

export function* loadPatientDocumentsSaga (action: ReturnType<typeof Actions.LoadPatientDocuments>) {
  try {
    const { id } = action.payload

    // get already loaded patient data
    const loadedPatients: Patient[] = yield select(state => state.patients.data)
    const existingPatient = loadedPatients.find(p => p.id === id)

    const allMedia = (existingPatient && existingPatient.media) || []

    // load patient documents
    yield loadPatientDocuments(id, allMedia)
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

export function* loadPatientDocuments (id: EntityId, existingMedia: Media[]) {
  const authToken = yield select(getAuthToken)
  const { data }: Api.PaginatedDataResponse<Media> = yield call(Api.getPatientMediaFromLambda(authToken), id, 'patient-doc')
  const mergedMedia = uniqBy(existingMedia.concat(data), 'id')
  yield put(Actions.LoadPatientDocumentsSuccess({ patientId: id, media: mergedMedia }))
}

export function* loadPatientNotesSaga (action: ReturnType<typeof Actions.LoadPatientNotes>) {
  try {
    const { id } = action.payload
    yield loadPatientNotes(id)
  } catch (error) {
    yield put(Actions.LoadPatientError({ error }))
  }
}

function* loadPatientNotes (id: EntityId) {
  const authToken = yield select(getAuthToken)
  const { data: notes } = yield call(Api.getPatientNotesFromLambda(authToken), id)
  yield put(Actions.LoadPatientNotesSuccess({ id, notes }))
  yield fork(loadPatientNotesCreators, notes, authToken)
}

function* loadPatientNotesCreators (notes: Note[], token: string) {
  const creatorsIds = uniq(notes.map(e => e.created_by_id))
  const existingCreators = yield select(state => state.notes.creators.byId)
  const account = yield select(getAuthAccount)
  const existingCreatorsIds = Object.keys(existingCreators)
  const newIds = difference(creatorsIds, existingCreatorsIds)

  const creators = yield all(newIds.map(id => {
    if (account && account.id === id) {
      return { data: account }
    } else {
      return call(Api.getAccountFromLambda(token), id)
    }
  }))

  if (creators.length) {
    yield put(AddCreatorsById({ creators: creators.map(e => e.data) }))
  }
}

/*
might be useful / needed for loading procedures

function * loadPatientProcedures (patient: Patient, allProcedures: Procedure[]) {
  const { appointments, id } = patient
  const authToken = yield select(getAuthToken)

  const associations: Api.AssociationValue = [{ model: 'procedure', associations: [{ model: 'account', as: 'provider' }] } ]
  const { data: { procedures: patientProcedures } } = yield call(Api.getPatient(authToken), id, associations)

  if (patientProcedures) {
    patientProcedures.forEach(procedure => {
      allProcedures = replaceInData(allProcedures, procedure)
    })
  }

  // gather procedures from all appointments
  if (appointments) {
    for (let a = 0; a < appointments.length; a++) {
      const { data: apptWithProcedures } = yield call(Api.getAppointment(authToken), appointments[a].id, [{ model: 'procedure', associations: [{ model: 'account', as: 'provider' }] }])
      const { procedures: nestedProcedures } = apptWithProcedures
      allProcedures = allProcedures.concat(nestedProcedures)
    }

    yield putResolve(SendAllProcedures({ data: allProcedures, patientId: id }))
  }
  yield put(Actions.LoadPatientProceduresSuccess({ patientId: id, procedures: allProcedures }))
}
*/
