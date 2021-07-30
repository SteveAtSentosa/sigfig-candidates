import {
  AddAttachments,
  ChannelCreated,
  ClearAllAttachments,
  ClearPopulatedMessage,
  CloseAttachmentsMenu,
  CreateChannelAutoSelect,
  InitSuccess,
  InitViewableMessages,
  PopulateMessage,
  PrepareAttachment,
  SelectChannel,
  SelectChannelSuccess,
  SendTreatmentPlanToPatient,
  SetOnlineStatus,
  SetStatus,
  SetViewableMessages,
  UpdateScrollPosition,
  UploadMessageAttachments,
  UploadMessageAttachmentsSuccess,
  UserToChannelsUpdated,
  channelsSelector,
  defaultMessageSubscriptionCountSelector,
  getPatientInChatUsers,
  getSelectedChannel,
  getViewableMessagesForChannel,
  initializedSelector
} from '#/actions/chat'
import { ArchiveChannel, Channel, CloseSuccess, Connect, CreateChannel, Init, MarkAsRead, ResponseTransaction, SendMultimediaMessage, SetReadyState, SetSubscription, Touch, Transact, WSReadyState } from '#/microservice-middleware'
import { AttachedFile, EntityId, Media, Patient } from '#/types'
import { DataResponse, LoginResponseAccount, TreatmentPlanEntity, createMedia, getPatient, getTreatmentPlan } from '#/api'
import { allowedPatientUploadTypes, checkHistory } from '#/utils'
import { call, delay, put, select, take, takeEvery, takeLatest, throttle } from 'redux-saga/effects'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'
import { isEmpty, xor } from 'lodash'

import { AppState } from '#/redux'
import { InviteUserToPatientPortal } from '#/actions/accounts'
import { LoadPatient } from '#/actions/patients'
import { OpenModal } from '#/actions/modals'
import { ShowNotificationPopUp } from '#/actions/notificationPopUp'
import { convertToTeledentChatType } from '#/utils/CheckMediaType'

export function* handleResponsesSaga (action: ReturnType<typeof ResponseTransaction>) {
  const { response } = action.payload
  yield put(ArchiveChannel({ archived: false, channelId: response.data.channel.id }))

  if (response.action === 'sendMessage') {
    // copy channelMessages over to viewableMessages when the user sends a new message
    yield updateViewableMessagesWithNewMessages(response.data.channel.id)
  }

  if (response.action === 'createChannel') {
    yield put(ChannelCreated({ actionResponse: response }))
  }
}

function* checkFileBeforeAdding (file: File) {
  const authAccount: LoginResponseAccount = yield select(getAuthAccount)

  const defaultFileSize = 5
  const videoFileSize = 50
  const isVideoFile = file.type.includes('video')

  // File upload size limit
  const filesizeMB = Number.parseFloat(((file.size / 1024) / 1024).toFixed(2))
  if (!isVideoFile && filesizeMB > defaultFileSize) throw new Error('File is too big. Limit: 5 MB')
  if (isVideoFile && filesizeMB > videoFileSize) throw new Error('Video file is too big. Limit: 50mb')
  // Check allowed file types for patients
  if (!allowedPatientUploadTypes.includes(file.type) && authAccount.is_patient) throw new Error('File type not allowed. Only MOV, OGG, MP4, WEBM, JPG, PNG, DOC, and PDF files are allowed.')
}

function* getEntityIdAndType () {
  const authAccount: LoginResponseAccount = yield select(getAuthAccount)
  // look for a patient in the selected channel (a channel can have 0 or 1 patient)
  const patientUserInChannel = yield select(getPatientInChatUsers)
  /*
    if there is a patient in the channel, we will associate the media with the patient
    so that it will appear in their collected data
    (NOTE: this works even if the currently logged in account is a patient)
    otherwise, associate the media with the currently logged in account
  */
  const entityId = patientUserInChannel ? patientUserInChannel.accountData.patient_id : authAccount.id
  const entityType = patientUserInChannel ? 'patient' : 'account'
  return { entityId, entityType }
}

export function* prepareAttachmentSaga (action: ReturnType<typeof PrepareAttachment>) {
  yield put(CloseAttachmentsMenu())
  const { file, duration } = action.payload
  if (!file) return
  try {
    yield checkFileBeforeAdding(file)
    const propertiesObject = { type: convertToTeledentChatType(file) }
    if (duration) {
      propertiesObject['duration'] = duration
    }
    const properties = JSON.stringify(propertiesObject)
    const { entityId, entityType } = yield getEntityIdAndType()
    const attachedFile: AttachedFile = { file, properties, association: entityType, association_id: entityId }
    yield put(AddAttachments([attachedFile]))
  } catch (e) {
    yield put(ShowNotificationPopUp({ type: 'error', content: e.message }))
    console.error(e)
  }
}

function patientIdsFromAttachments (attachments: AttachedFile[]) {
  return attachments
    .filter(a => a.association === 'patient')
    .map(a => a.association_id)
}

function patientNeedsRefresh () {
  return patientIdsFromAttachments.length > 0
}

export function* uploadMessageAttachmentsSaga (action: ReturnType<typeof UploadMessageAttachments>) {
  yield put(CloseAttachmentsMenu())
  const { channelId, message, attachments } = action.payload
  const mediaIds: string[] = []
  try {
    const authToken: string = yield select(getAuthToken)
    for (let i = 0; i < attachments.length; i++) {
      if ('media' in attachments[i]) {
        mediaIds.push(attachments[i].media.id)
      } else {
        const { association, association_id, properties, file } = attachments[i]
        const response: DataResponse<Media> = yield call(createMedia(authToken), { properties, association, association_id, file })
        mediaIds.push(response.data.id)
      }
    }
    yield put(SendMultimediaMessage({ channelId, data: { message, mediaIds }, messageType: 'media' }))
    if (patientNeedsRefresh()) {
      yield put(LoadPatient({
        id: patientIdsFromAttachments(attachments)[0],
        associations: [
          {
            model: 'media',
            associations: [
              { model: 'account', as: 'createdBy' },
              { model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }
            ]
          },
          { model: 'appointment' },
          { model: 'treatmentplan', associations: [{ model: 'media' }] },
          { model: 'group', associations: [{ model: 'group' }] }
        ],
        collectedMedia: true
      }))
    }
    yield put(UploadMessageAttachmentsSuccess())
  } catch (e) {
    yield put(ShowNotificationPopUp({ type: 'error', content: e.message }))
    console.error(e)
  }
}

export function* selectChannelSaga (action: ReturnType<typeof SelectChannel>) {
  const { channelId } = action.payload
  const channels: Channel[] = yield select(channelsSelector)
  const channel = channels.find(c => c.id === channelId)
  // Check if the channel user is populated.
  if (channel && channel.userToChannels.length > 1) {
    yield put(SelectChannelSuccess({ channelId }))
    const parsedUrl = checkHistory()
    // Check if the route has parameters meaning the component should derive from URL and is being sent data that needs to be pre-populated.
    if (parsedUrl && parsedUrl.params.accountId) return
    yield put(ClearAllAttachments())
    yield put(ClearPopulatedMessage())
  }
}

export function* initViewableMessages (action: ReturnType<typeof InitViewableMessages>) {
  const { isUnread = false, after = () => { /* no-op*/ } } = action.payload
  let selectedChannel = yield select(getSelectedChannel)
  const viewableMessages = yield select(getViewableMessagesForChannel)
  if (!selectedChannel) {
    yield take(SelectChannelSuccess.TYPE)
    selectedChannel = yield select(getSelectedChannel)
  }
  const { id: channelId, messages: channelMessages } = selectedChannel
  if (!viewableMessages || isUnread) {
    // Only if the selected channel doesn't already have viewable messages
    // OR if the channel has unread messages
    yield put(SetViewableMessages({ channelId, messages: channelMessages, after }))
  } else {
    after()
  }
}

export function* setViewableMessages (action: ReturnType<typeof SetViewableMessages>) {
  const { after = () => { /* no-op*/ } } = action.payload
  // runs after the reducer
  after()
}

/* only mark the channel as read if we're on the Chat page */
function* markAsRead (channelId: EntityId) {
  yield put(MarkAsRead({ channelId }))
}

export function* transactSaga (action: ReturnType<typeof Transact>) {
  const { transaction } = action.payload
  try {
    /*
      FIXME: It would be useful to break up Transact into distinct actions:
      i.e. InsertTransact, SetTransact, UpdateTransact, as well as plain Transact (see below)
    */
    // New messages sent to channel, subscribe to new messages
    if (transaction.type === 'insert' && transaction.entityType === 'message') {
      yield put(ArchiveChannel({ archived: false, channelId: transaction.data.channelId }))
    }

    if (transaction.type === 'update' && transaction.entityType === 'userToChannel' && transaction.data.unread) {
      yield call(updateViewableMessagesWithNewMessages, transaction.data.channelId)
      const channel = yield select(getSelectedChannel)
      yield put(UpdateScrollPosition({ channel: transaction.data.channelId, position: undefined }))
      if (channel && channel.id === transaction.data.channelId) {
        // if the selected channel receives a new message, mark as read
        yield markAsRead(transaction.data.channelId)
      }
    }
    /*
      Plain Transact would still be necessary in order to run this saga
      Or, we could just run it in each of the distinct sagas
    */
    // Update users
    if (transaction.type === 'insert' && transaction.entityType === 'userToChannel') {
      yield put(UserToChannelsUpdated({ transaction }))
    }
  } catch (error) {
    console.error(error)
  }
}

function* updateViewableMessagesWithNewMessages (channelId: string) {
  const subscriptionCount = yield select(defaultMessageSubscriptionCountSelector)
  yield put(SetSubscription({
    from: null,
    to: null,
    throughId: channelId,
    throughType: 'channel',
    entityType: 'message',
    count: subscriptionCount
  }))
}

function* initializeChatState (_action: ReturnType<typeof Init>) {
  yield put(InitSuccess())
}

// Checks for if a channel already exist, if it does select it. If not create and wait for the channel to be fully created before selecting it to avoid whitescreens.
// Some of this could be mitigated by the microservice?
function* createChannelAndAutoSelectSaga (action: ReturnType<typeof CreateChannelAutoSelect>) {
  const { payload: { userIds } } = action

  const loggedInUser: LoginResponseAccount = yield select(getAuthAccount)
  const userIdsToCheckFor = userIds.concat([ loggedInUser.id ])
  const channels: Channel[] = yield select(channelsSelector)

  const channel = channels.find(channel => isEmpty(xor(channel.userToChannels.map(c => c.userId), userIdsToCheckFor)))

  if (channel) {
    yield put(SelectChannelSuccess({ channelId: channel.id }))
    return
  }

  yield put(CreateChannel({ userIds }))

  const chatUsers = yield select(state => state.microservice.users)
  const inactiveUser = chatUsers.find(user => userIds.includes(user.id) && user.accountData.status === 'inactive')
  if (inactiveUser) {
    yield put(Touch({ updateUsers: true }))
  }

  let channelId = null

  while (!isEmpty(userIdsToCheckFor)) {
    const { payload: { transaction } }: ReturnType<typeof UserToChannelsUpdated> = yield take(UserToChannelsUpdated.TYPE)
    const { userId } = transaction.data
    const index = userIdsToCheckFor.indexOf(userId)

    if (index > -1) {
      userIdsToCheckFor.splice(index, 1)
    }
    if (isEmpty(userIdsToCheckFor)) channelId = transaction.throughId
  }
  yield put(SelectChannelSuccess({ channelId }))
}

function* setStatus () {
  const initialized: boolean = yield select(initializedSelector)
  if (initialized) {
    yield put(Touch({ updateUsers: false }))
  }
}

function* maybeReconnectSaga ({ payload: isOnline }: ReturnType<typeof SetOnlineStatus>) {
  const readyState: WSReadyState = yield select((state: AppState) => state.microservice.readyState)
  if (readyState !== 'CLOSED') {
    yield take(CloseSuccess.TYPE)
  }
  if (isOnline) {
    yield put(Connect())
  }
}

function* readyStateSaga ({ payload: readyState }: ReturnType<typeof SetReadyState>) {
  const isOnline: boolean = yield select((state: AppState) => state.chat.online)

  if (isOnline && (readyState > 2)) {
    yield put(Connect())
  }

}

function* sendTreatmentPlanToPatientSaga (action: ReturnType<typeof SendTreatmentPlanToPatient>) {
  const { treatmentPlanId, messageText = '', navigateToChat } = action.payload
  try {
    // Get the media from the treatment plan
    const authToken: string = yield select(getAuthToken)
    const response: DataResponse<TreatmentPlanEntity> = yield call(getTreatmentPlan(authToken), treatmentPlanId, [{ model: 'media', as: 'media' }])
    const pdf: Media = response.data.media.find(m => m.type === 'exam-rpt')
    // Get the userId for the patient
    const { data: patient }: DataResponse<Patient> = yield call(getPatient(authToken), response.data.patient_id, [{ model: 'account', as: 'account' }])
    const userId: string = patient.account_id
    if (!userId) throw new Error('Please add an email for the patient first.')
    if (patient.account.status === 'inactive') {
      yield put(InviteUserToPatientPortal({ accountId: userId }))
    } else if (patient.account.status === 'invited') {
      yield put(ShowNotificationPopUp({ type: 'info', content: 'Patient still needs to complete registration to view your message. Forwarding to provider chat...' }))
      yield delay(3000)
    }
    // Have to navigate to chat before creating channel
    // Otherwise, handleResponsesSaga will clear attachaments / message after CreateChannel
    navigateToChat()
    yield put(CreateChannelAutoSelect({ userIds: [userId] }))
    // NOTE: Eventually they'll want to pre-populate the message with some text. Do that here.
    yield put(PopulateMessage(messageText))
    const attachedFile: AttachedFile = { media: pdf }
    yield put(AddAttachments([attachedFile]))
  } catch (e) {
    yield put(OpenModal({ modal: 'sendTreatmentPlan' }))
    yield put(ShowNotificationPopUp({ type: 'error', content: e.message }))
  }
}

export function* saga () {
  yield takeEvery(Init.TYPE, initializeChatState)
  yield takeEvery(InitViewableMessages.TYPE, initViewableMessages)
  yield takeEvery(PrepareAttachment.TYPE, prepareAttachmentSaga)
  yield takeEvery(ResponseTransaction.TYPE, handleResponsesSaga)
  yield takeEvery(SelectChannel.TYPE, selectChannelSaga)
  yield takeEvery(SendTreatmentPlanToPatient.TYPE, sendTreatmentPlanToPatientSaga)
  yield takeEvery(SetViewableMessages.TYPE, setViewableMessages)
  yield takeEvery(UploadMessageAttachments.TYPE, uploadMessageAttachmentsSaga)
  yield takeEvery(Transact.TYPE, transactSaga)
  yield takeEvery(CreateChannelAutoSelect.TYPE, createChannelAndAutoSelectSaga)
  yield throttle(1000 * 60 * 10, SetStatus.TYPE, setStatus)
  yield takeEvery(SetOnlineStatus.TYPE, maybeReconnectSaga)
  yield takeLatest(SetReadyState.TYPE, readyStateSaga)
}
