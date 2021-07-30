import { all, call } from 'redux-saga/effects'

import { saga as UISaga } from '#/sagas/ui'
import { saga as accountsSaga } from '#/sagas/accounts'
import { saga as appointmentsSaga } from '#/sagas/appointments'
import { saga as authSaga } from '#/sagas/auth'
import { saga as bulkSelectSaga } from '#/sagas/bulkSelect'
import { saga as chatSaga } from '#/sagas/chat'
import { saga as collisionsSaga } from '#/sagas/collisions'
import { saga as gChatSaga } from '#/sagas/gchat'
import { saga as globalSearchSaga } from '#/sagas/globalSearch'
import { saga as groupsSaga } from '#/sagas/groups'
import { saga as iotSaga } from '#/sagas/iot'
import { saga as locationsSaga } from '#/sagas/locations'
import { saga as mediaSaga } from '#/sagas/media'
import { saga as mediaViewerSaga } from '#/sagas/mediaViewer'
import { saga as microserviceSaga } from '#/sagas/microservice'
import { saga as notesSaga } from '#/sagas/notes'
import { saga as notificationPopUpSaga } from '#/sagas/notificationPopUp'
import { saga as notificationsSaga } from '#/sagas/notifications'
import { saga as passwordSaga } from '#/sagas/password'
import { saga as patientsSaga } from '#/sagas/patients'
import { saga as practicesSaga } from '#/sagas/practices'
import { saga as procedureCodesSaga } from '#/sagas/procedurecodes'
import { saga as proceduresSaga } from '#/sagas/procedures'
import { saga as propertiesSaga } from '#/sagas/properties'
import { saga as signUpSaga } from '#/sagas/signup'
import { saga as ssoSaga } from '#/sagas/sso'
import { saga as subscriptionSaga } from '#/sagas/subscription'
import { saga as tasksSaga } from '#/sagas/tasks'
import { saga as treatmentPlansSaga } from '#/sagas/treatmentPlans'
import { saga as usersSaga } from '#/sagas/users'
import { saga as videoSaga } from '#/sagas/video'

export default function* rootSaga () {
  yield all([
    call(accountsSaga),
    call(appointmentsSaga),
    call(authSaga),
    call(globalSearchSaga),
    call(groupsSaga),
    call(locationsSaga),
    call(mediaSaga),
    call(mediaViewerSaga),
    call(notesSaga),
    call(notificationsSaga),
    call(passwordSaga),
    call(patientsSaga),
    call(practicesSaga),
    call(procedureCodesSaga),
    call(proceduresSaga),
    call(propertiesSaga),
    call(signUpSaga),
    call(ssoSaga),
    call(tasksSaga),
    call(treatmentPlansSaga),
    call(usersSaga),
    call(videoSaga),
    call(notificationPopUpSaga),
    call(bulkSelectSaga),
    call(microserviceSaga),
    call(collisionsSaga),
    call(chatSaga),
    call(gChatSaga),
    call(iotSaga),
    call(subscriptionSaga),
    call(UISaga)
  ])
}
