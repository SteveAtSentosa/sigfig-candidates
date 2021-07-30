import * as Actions from '#/actions/appointments'
import * as Api from '#/api'
import * as React from 'react'

import { Appt as Appointment, CreateAppt } from '#/types'
import { SendAllMedia, TriggerCollectedMediaRefresh } from '#/actions/media'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'

import { CreateOptionsFromValues } from '#/utils'
import { PatchedEntity } from '#/api/types'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { ThrowCollisionStart } from '#/actions/collisions'
import { UpdateAccount } from '#/actions/accounts'
import moment from 'moment-timezone'
import { updateAccountSaga } from '#/sagas/accounts'

// Sagas

export function* saga () {
  yield all([
    takeLatest(Actions.ReloadAppointments.TYPE, reloadAppointmentsSaga),
    takeLatest(Actions.LoadAppointment.TYPE, loadAppointmentSaga),
    takeLatest(Actions.LoadAppointmentList.TYPE, loadAppointmentListSaga),
    takeLatest(Actions.UpdateAppointment.TYPE, updateAppointmentSaga),
    takeLatest(Actions.SearchAppointments.TYPE, searchAppointmentsSaga),
    takeLatest(Actions.CreateAppointment.TYPE, createAppointmentSaga),
    takeLatest(Actions.DeleteAppointment.TYPE, deleteAppointmentSaga)
  ])
}

const mapStatusToValue = (statusOptions: Api.PropertyOpts[], apptStatus: string, forClientOrQuery: | 'client' | 'query') => {
  if (forClientOrQuery === 'client') {
    const value = statusOptions.filter(option => option.id === apptStatus)[0]['value']
    return { status: value }
  } else {
    const priority = apptStatus
    const id = statusOptions.filter(option => option.value === priority)[0]['id']
    return { status: id }
  }
}

function normalizeApptPropertiesForQuery (data: CreateAppt, capture: boolean, statuses: Api.PropertyOpts[]): Appointment {
  const normalizedAppointment = {}
  for (const key in data) {
    switch (key) {
      case 'appointment_type':
        normalizedAppointment[key] = data[key]['value']
        break
      case 'assignee':
        normalizedAppointment['provider_id'] = data[key]['value']
        break
      case 'provider_id':
        normalizedAppointment['provider_id'] = data[key]
        break
      case 'duration':
        normalizedAppointment[key] = data[key]['value']
        break
      case 'location':
        normalizedAppointment['location_id'] = data[key]['value']
        break
      case 'patient':
        normalizedAppointment['patient_id'] = data[key]['value']
        break
      case 'patient_id':
        normalizedAppointment['patient_id'] = data[key]
        break
      case 'appointment_start':
        // convert to UTC, e.g. 2019-10-04T20:00:00.000Z (equivalent to Fri Oct 04 2019 16:00:00 GMT-0400 (Eastern Daylight Time))
        normalizedAppointment[key] = new Date(data[key]).toISOString()
        break
      case 'status':
        normalizedAppointment[key] = mapStatusToValue(statuses, data[key], 'query')['status']
        break
      case 'patient_send_email':
        normalizedAppointment['patient_send_email'] = data[key]
        break
      case 'provider_send_email':
        normalizedAppointment['provider_send_email'] = data[key]
        break
    }
  }

  normalizedAppointment['capture'] = capture

  return normalizedAppointment as Appointment
}

export function* createAppointmentSaga (action: ReturnType<typeof Actions.CreateAppointment>) {
  try {
    const authToken = yield select(getAuthToken)
    const { data, redirectToCapture } = action.payload
    const { data: statuses } = yield call(Api.getProperty(authToken), 'appointment', 'status')
    const normalizedData = normalizeApptPropertiesForQuery(data, redirectToCapture, statuses.options)

    // make sure the logged in user has a time_zone_pref before creating the appointment
    yield forceAccountTimeZone()

    const { data: appointment }: Api.DataResponse<Appointment> = yield call(Api.createAppointment(authToken), normalizedData)
    const successMessage = React.createElement('div', null, React.createElement('a', { href: `/patients/appointments_detail/${appointment.patient_id}/appointment/${appointment.id}` }, 'Appointment'), ' has been added')
    yield put(ShowNotificationPopUp({ type: 'success', content: (successMessage) }))
    yield put(TriggerCollectedMediaRefresh({ patientId: appointment.patient_id }))
    // does not have necessary associations yet
    yield put(Actions.LoadAppointment({ id: appointment.id, associations: [['patient'], ['location'], ['account', 'provider'], ['note'], ['task']] }))
    yield put(Actions.CreateAppointmentSuccess())

    if (redirectToCapture) {
      const url = `/capture/${appointment.patient_id}/appointment/${appointment.id}?quickCapture=1`
      window.location.href = url
    }
  } catch (error) {
    yield put(ShowNotificationPopUp({ type: 'error', content: ('Error: ' + error.message) }))
    yield put(Actions.CreateAppointmentError({ error }))
  }
}

/*
  If the logged in user does not have a time_zone_pref, set one
*/
function* forceAccountTimeZone () {
  // state.auth.data.account.updated_at will be stale if it is persisted from localforage
  const authAccount = yield select(getAuthAccount)
  const authToken = yield select(getAuthToken)
  const { id } = authAccount
  // ...so, in this specific case, we do a fetch to get a value for updated_at
  const { data: loggedInUser } = yield call(Api.getAccountFromLambda(authToken), id)
  const { updated_at } = loggedInUser
  // we also use the recently-fetched account to check for time_zone_pref,
  // since this may have been already set by someone else
  if (!loggedInUser.time_zone_pref) {
    const data: PatchedEntity = { time_zone_pref: { value: moment.tz.guess(), op: 'add' } }
    const action = UpdateAccount({ id, data, updated_at })
    yield call(updateAccountSaga, action)
  }
}

export function* searchAppointmentsSaga (action: ReturnType<typeof Actions.SearchAppointments>) {
  try {
    const authToken = yield select(getAuthToken)
    const { associations, where, page, perPage, order, sort, orderAs, orWhere } = action.payload
    const response: Api.PaginatedDataResponse<Appointment> = yield call(Api.getAppointmentList(authToken), { associations, where, page, per_page: perPage, order, sort, order_as: orderAs, or_where: orWhere } as any)
    yield put(Actions.SearchAppointmentsSuccess({ data: response.data, count: response.count, page: response.page, perPage: response.per_page }))
  } catch (error) {
    yield put(Actions.SearchAppointmentsError({ error }))
  }
}

export function* loadAppointmentSaga (action: ReturnType<typeof Actions.LoadAppointment>) {
  const { id, associations } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    let data: any = {}
    // break up large requests into smaller ones
    // this number is arbirtary and may need to be adjusted
    if (associations.length > 3) {
      for (let i = 0; i < associations.length; i++) {
        const { data: appointmentData }: Api.DataResponse<Appointment> = yield call(Api.getAppointment(authToken), id, [ associations[i] ] as Api.AssociationValue)
        data = Object.assign(data, appointmentData)
      }
    } else {
      const { data: appointmentData }: Api.DataResponse<Appointment> = yield call(Api.getAppointment(authToken), id, associations)
      data = Object.assign(data, appointmentData)
    }
    const { tasks, media } = data
    if (tasks) {
      for (let i = 0; i < tasks.length; i++) {
        tasks[i] = Object.assign(tasks[i], { patient: data.patient })
        tasks[i] = CreateOptionsFromValues(['patient'], tasks[i])
      }
    }
    const appointmentWithTasks = tasks ? Object.assign({}, data, { tasks: tasks }) : data
    if (media) {
      yield put(SendAllMedia({ data: data.media }))
    }

    yield put(Actions.LoadAppointmentSuccess({ appointment: appointmentWithTasks }))
  } catch (error) {
    yield put(Actions.LoadAppointmentError({ id, error }))
  }
}

function* getAppointments ({ where, page, perPage, order, sort, orderAs, associations, forDashboard, all = false }) {
  const authToken = yield select(getAuthToken)
  if (all) {
    const response: Api.PaginatedDataResponse<Appointment> = yield call(Api.getAppointmentList(authToken), { associations, where, order, sort, order_as: orderAs })
    yield put(Actions.LoadAppointmentListSuccess({ data: response.data, count: response.count, page: response.page, perPage: response.per_page, forDashboard }))
  } else {
    const response: Api.PaginatedDataResponse<Appointment> = yield call(Api.getAppointmentList(authToken), { associations, where, page, per_page: perPage, order, sort, order_as: orderAs }, { useV2: true })
    yield put(Actions.LoadAppointmentListSuccess({ data: response.data, count: response.count, page: response.page, perPage: response.per_page, forDashboard }))
  }
}

export function* loadAppointmentListSaga (action: ReturnType<typeof Actions.LoadAppointmentList>) {
  try {
    const { where, page, perPage, order, sort, orderAs, associations, forDashboard, all = false } = action.payload
    yield getAppointments({ where, page, perPage, order, sort, orderAs, associations, forDashboard, all })
  } catch (error) {
    yield put(Actions.LoadAppointmentListError({ error }))
  }
}

export function* reloadAppointmentsSaga () {
  try {
    const prevPayload = yield select(state => state.appointments.payload)
    const { where, page, perPage, order, sort, orderAs, associations, forDashboard, all = false } = prevPayload
    yield getAppointments({ where, page, perPage, order, sort, orderAs, associations, forDashboard, all })
  } catch (error) {
    yield put(Actions.LoadAppointmentListError({ error }))
  }
}

export function* updateAppointmentSaga (action: ReturnType<typeof Actions.UpdateAppointment>) {
  const { id, data: patch, updated_at } = action.payload
  try {
    const authToken = yield select(getAuthToken)
    const { data }: Api.CollisionDataResponse<Appointment> = yield call(Api.editAppointment(authToken), id, patch, updated_at)
    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'appointments' }))
    } else {
      yield put(Actions.UpdateAppointmentSuccess())
      yield put(ShowNotificationPopUp({ type: 'success', content: 'Appointment updated' }))
      // reload the appointment after PATCH
      // make sure we refresh the patient with the required associations
      const associations = [
        { model: 'account', as: 'provider' },
        { model: 'patient' },
        { model: 'location' },
        { model: 'media', associations: [{ model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }, { model: 'account', as: 'createdBy' }] },
        { model: 'note', associations: [{ model: 'account', as: 'createdBy' }] },
        { model: 'task' }
      ]
      yield put(Actions.LoadAppointment({ id, associations }))
    }

  } catch (error) {
    yield put(Actions.UpdateAppointmentError({ error }))
    yield put(ShowNotificationPopUp({ type: 'error', content: `Error: ${error.message}` }))
  }
}

function* deleteAppointmentSaga (action: ReturnType<typeof Actions.DeleteAppointment>) {
  const { id, patientId } = action.payload

  try {
    const authToken = yield select(getAuthToken)
    // first, check for open tasks / upcoming appointments
    const { data: { procedures } }: Api.DataResponse<Appointment> = yield call(Api.getAppointment(authToken), id, [{ model: 'procedure' }])
    const { data: { media } }: Api.DataResponse<Appointment> = yield call(Api.getAppointment(authToken), id, [{ model: 'media' }])
    const { data: tasks } = yield call(Api.getTaskList(authToken), { associations: [{ model: 'appointment', where: [{ prop: 'id', comp: '=', param: id }] }], where: [{ and: [{ prop: 'status', comp: '=', param: 'Open' }] }] }, { useV2: true })
    if (tasks.length || procedures.length || media.length) {
      throw new Error('This appointment has open tasks, codes added, captured images, notes added, or uploaded documents. You must remove these items before you may proceed.')
    }
    yield call(Api.deleteAppointment(authToken), id)
    yield put(TriggerCollectedMediaRefresh({ patientId }))
    yield put(Actions.DeleteAppointmentSuccess({ appointmentId: id }))
  } catch (error) {
    yield put(Actions.DeleteAppointmentError({ error }))
  }
}
