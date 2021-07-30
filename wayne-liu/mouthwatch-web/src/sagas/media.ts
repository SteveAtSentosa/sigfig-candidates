import * as Actions from '#/actions/media'
import * as Api from '#/api'
import * as React from 'react'

import { Buffer, buffers } from 'redux-saga'
import { EntityId, Media } from '#/types'
import { actionChannel, all, call, delay, put, putResolve, select, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { GetAccountById } from '#/actions/accounts'
import { LoadAppointment } from '#/actions/appointments'
import { LoadTreatmentPlan } from '#/actions/treatmentPlans'
import { LoadingPatientDocuments } from '#/actions/patients'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { ThrowCollisionStart } from '#/actions/collisions'
import { getAuthToken } from '#/actions/auth.selectors'
import { loadPatientDocuments } from '#/sagas/patients'

const {
  TriggerCollectedMediaRefresh,
  TakeSnapshot,
  CreateMedia,
  CreateMediaSuccess,
  CreateMediaError,
  SetCurrentMedia,
  SetCurrentMediaSuccess,
  SetCurrentMediaError,
  DeleteMedia,
  DeleteMediaSuccess,
  DeleteMediaError,
  ListenForSnapshots,
  EditMedia
} = Actions

// Sagas

export function* saga () {
  yield all([
    takeEvery(SetCurrentMedia.TYPE, setCurrentMediaSaga),
    takeLatest(EditMedia.TYPE, updateMediaSaga),
    takeEvery(CreateMedia.TYPE, createMediaSaga),
    takeEvery(DeleteMedia.TYPE, deleteMediaSaga),
    takeLatest(ListenForSnapshots.TYPE, listenForSnaphotsSaga)
  ])
}

export function* createMediaSaga (action: ReturnType<typeof CreateMedia>) {
  const { type, association, association_id, file, multiple, caption, duration, patientId, hideNotification = false, customSuccessMessage } = action.payload
  if (type === 'patient-doc') {
    yield put(LoadingPatientDocuments())
  }
  try {
    const authToken = yield select(getAuthToken)
    /*
      In some cases, you may want to hide the popper notification after creating media
      e.g. after uploading an account avatar as part of editing / creating an account
      or, when some other specific functionality is required (like in the AudioRecorder component)
      For those cases, use the `hideNotification` prop on this action
      and show the notification in the componentDidUpdate method
    */
    let properties: object | string = { type }
    if (caption) {
      properties['caption'] = caption
    }
    if (duration) {
      properties['duration'] = duration
    }
    properties = JSON.stringify(properties)
    const { data } = yield call(Api.createMedia(authToken), { properties, association, association_id, file })
    // Refresh collected media
    if (association === 'patient' && type !== 'patient-avatar') {
      yield put(TriggerCollectedMediaRefresh({ patientId: association_id }))

      if (type === 'patient-doc') {
        yield reloadPatientDocs(association_id)
      }
    } else if (patientId) {
      yield put(TriggerCollectedMediaRefresh({ patientId: patientId }))
    }
    if (type === 'exam-rpt') {
      // Reload treatment plan with the new PDF
      yield put(LoadTreatmentPlan({
        treatmentPlanId: association_id,
        withMediaMetadata: false,
        associations: [
         { model: 'patient', associations: [{ model: 'media' }] },
         { model: 'procedure', associations: [{ model: 'account', as: 'provider' }] },
         { model: 'media', associations: [{ model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }] }
        ]
      }))
    }
    yield put(CreateMediaSuccess({ media: data, multiple }))
    if (!hideNotification) {
      yield put(ShowNotificationPopUp({ type: 'success', content: customSuccessMessage || 'Media uploaded successfully' }))
    }
  } catch (error) {
    if (!hideNotification) {
      yield put(ShowNotificationPopUp({ type: 'error', content: error.message }))
    }
    yield put(CreateMediaError({ error }))
  }
}

function* reloadPatientDocs (id: EntityId) {
  // get already loaded patient data
  const loadedPatients = yield select(state => state.patients.data)
  const patientInStore = loadedPatients.find(p => p.id === id)

  const allMedia = (patientInStore && patientInStore['media']) || []
  yield loadPatientDocuments(id, allMedia)
}

export function* updateMediaSaga (action: ReturnType<typeof EditMedia>) {
  try {
    const authToken = yield select(getAuthToken)
    const { id, media: patch, patientId, updated_at, appointmentId } = action.payload
    const { data } = yield call(Api.editMedia(authToken), id, patch, updated_at)
    if (data.collision) {
      // handle collision
      yield put(ThrowCollisionStart({ existingRecord: data.current, patchedRecord: patch, namespace: 'media' }))
    } else {
      yield put(TriggerCollectedMediaRefresh({ patientId }))
      const successMessage = React.createElement('div', null, 'Media updated successfully.')
      yield put(ShowNotificationPopUp({ type: 'success', content: successMessage }))
      if (appointmentId) {
        yield put(LoadAppointment({
          id: appointmentId,
          associations: [
            { model: 'account', as: 'provider' },
            { model: 'patient' },
            { model: 'location' },
            { model: 'media', associations: [{ model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }, { model: 'account', as: 'createdBy' }] },
            { model: 'note', associations: [{ model: 'account', as: 'createdBy' }] },
            { model: 'task' }
          ]
        }))
      }
    }

  } catch (error) {
    const errorMessage = React.createElement('div', null, 'Error tooth was not updated / added successfully.')
    yield put(ShowNotificationPopUp({ type: 'error', content: errorMessage }))
  }
}

function* deleteMedia (patientId: EntityId, media: Media, authToken: string, providerId: EntityId) {
  if (patientId && media.type === 'exam-rpt' && media.treatment_plan_id) {
    // delete the treatment plan if necessary
    yield call(Api.deleteTreatmentPlan(authToken), media.treatment_plan_id)
  } else {
    yield call(Api.deleteMedia(authToken), media.id)
    if (providerId) {
      yield put(GetAccountById({ id: providerId }))
    }
  }
}

export function* deleteMediaSaga (action: ReturnType<typeof DeleteMedia>) {
  try {
    const authToken = yield select(getAuthToken)
    if (Array.isArray(action.payload)) {
      for (const mediaToBeDeleted of action.payload) {
        const { media, patientId, providerId } = mediaToBeDeleted
        yield deleteMedia(patientId, media, authToken, providerId)
      }
      yield put(ShowNotificationPopUp({ type: 'success', content: 'All Media has been deleted successfully!' }))

    } else {
      const { media, patientId, providerId } = action.payload
      yield deleteMedia(patientId, media, authToken, providerId)
      yield put(DeleteMediaSuccess({ media, patientId }))
      yield put(ShowNotificationPopUp({ type: 'success', content: 'Media has been deleted successfully!' }))
    }
  } catch (error) {
    yield put(DeleteMediaError({ error }))
  }
}

export function* setCurrentMediaSaga (action: ReturnType<typeof SetCurrentMedia>) {
  const { media } = action.payload
  try {
    yield put(SetCurrentMediaSuccess({ media }))
  } catch (error) {
    yield put(SetCurrentMediaError({ mediaId: media.id, error }))
  }
}

/*
  Initially tried to debounce the calls to the api. That sort of worked however, there's no telling how long a POST will take to resolve.
  Enter, actionChannels. In short they "channel" actions and give the dev control on how to handle it.
  In my case I created a Saga that listens to 'TakeSnapshot' actions. I queue up the actions and fire them one after the other.
  Once the entire buffer is empty I then load up the selected appointment.
  FIXME: @Jason Lalor you may want to apply this wherever you have multiple calls and are waiting for it all to resolve, before actually updating.

  Resources: `[actionChannel](https://redux-saga.js.org/docs/advanced/Channels.html)`
*/

export function* listenForSnaphotsSaga (action: ReturnType<typeof ListenForSnapshots>) {

  const buffer: Buffer<any> = buffers.expanding(5)
  const channel = yield actionChannel(TakeSnapshot.TYPE, buffer)

  while (true) {
    const { payload } = yield take(channel)

    try {
      const authToken = yield select(getAuthToken)
      const { type, association, association_id, file, multiple, patientId } = payload
      const properties = JSON.stringify({ type })
      const response = yield call(Api.createMedia(authToken), { properties, association, association_id, file })
      yield putResolve(CreateMediaSuccess({ media: response.data, multiple }))
      if (patientId) {
        yield putResolve(TriggerCollectedMediaRefresh({ patientId: patientId }))
      }
      /* Force a delay shooting up too many media post causes service crash */
      yield delay(300)
    } catch (error) {
      putResolve(CreateMediaError({ error }))
      yield put(ShowNotificationPopUp({ type: 'error', content: error }))
    }

    if (buffer.isEmpty()) {
      yield call(action.payload.onComplete)
      yield put(ShowNotificationPopUp({ type: 'success', content: 'Snapshots have been successfully captured!' }))
    }
  }
}
