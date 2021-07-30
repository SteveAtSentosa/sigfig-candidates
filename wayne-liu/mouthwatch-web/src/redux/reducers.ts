import {
  State as AccountsState,
  initialState as accountsInitialState,
  stateNamespace as accountsNamespace,
  reducer as accountsReducer
} from '#/reducers/accounts'
import {
  State as AppointmentsState,
  initialState as appointmentsInitialState,
  reducer as appointmentsReducer
} from '#/reducers/appointments'
import {
  State as AudioState,
  initialState as audioInitialState,
  reducer as audioReducer
} from '#/reducers/audio'
import {
  State as AuthState,
  initialState as authInitialState,
  stateNamespace as authNamespace,
  reducer as authReducer
} from '#/reducers/auth'
import {
  State as AvatarsState,
  initialState as avatarsInitialState,
  reducer as avatarsReducer
} from '#/reducers/avatars'
import {
  State as BulkSelectState,
  initialState as bulkSelectInitialState,
  reducer as bulkSelectReducer
} from '#/reducers/bulkSelect'
import {
  State as CameraState,
  initialState as cameraInitialState,
  reducer as cameraReducer
} from '#/reducers/camera'
import {
  State as ChatState,
  initialState as chatInitialState,
  reducer as chatReducer
} from '#/reducers/chat'
import { ClientState, initialClientState, stateSyncReducer as microserviceReducer } from '#/microservice-middleware'
import {
  State as CollisionsState,
  initialState as collisionsInitialState,
  reducer as collisionsReducer
} from '#/reducers/collisions'
import { FormStateMap, reducer as formReducer } from 'redux-form'
import {
  State as GChatState,
  initialState as gchatInitialState,
  reducer as gchatReducer
} from '#/reducers/gchat'
import {
  State as GlobalSearchState,
  initialState as globalSearchInitialState,
  reducer as globalSearchReducer
} from '#/reducers/globalSearch'
import {
  State as GroupsState,
  initialState as groupsInitialState,
  stateNamespace as groupsNamespace,
  reducer as groupsReducer
} from '#/reducers/groups'
import {
  State as LocationsState,
  initialState as locationsInitialState,
  stateNamespace as locationsNamespace,
  reducer as locationsReducer
} from '#/reducers/locations'
import {
  State as MediaState,
  initialState as mediaInitialState,
  reducer as mediaReducer
} from '#/reducers/media'
import {
  State as MediaViewerState,
  initialState as mediaViewerInitialState,
  reducer as mediaViewerReducer
} from '#/reducers/mediaViewer'
import {
  State as ModalsState,
  initialState as modalsInitialState,
  reducer as modalsReducer
} from '#/reducers/modals'
import {
  State as NotesState,
  initialState as notesInitialState,
  reducer as notesReducer
} from '#/reducers/notes'
import {
  State as NotificationPopUpState,
  initialState as notificationPopUpInitialState,
  reducer as notificationPopUpReducer
} from '#/reducers/notificationPopUp'
import {
  State as NotificationsState,
  initialState as notificationsInitialState,
  stateNamespace as notificationsNamespace,
  reducer as notificationsReducer
} from '#/reducers/notifications'
import {
  State as PasswordState,
  initialState as passwordInitialState,
  reducer as passwordReducer
} from '#/reducers/password'
import {
  State as PatientsState,
  initialState as patientsInitialState,
  stateNamespace as patientsNamespace,
  reducer as patientsReducer
} from '#/reducers/patients'
import {
  State as PracticesState,
  initialState as practicesInitialState,
  stateNamespace as practicesNamespace,
  reducer as practicesReducer
} from '#/reducers/practices'
import {
  State as ProcedureCodesState,
  initialState as procedureCodesInitialState,
  stateNamespace as procedureCodesNamespace,
  reducer as procedureCodesReducer
} from '#/reducers/procedurecodes'
import {
  State as ProceduresState,
  initialState as proceduresInitialState,
  stateNamespace as proceduresNamespace,
  reducer as proceduresReducer
} from '#/reducers/procedures'
import {
  State as PropertiesState,
  initialState as propertiesInitialState,
  reducer as propertiesReducer
} from '#/reducers/properties'
import {
  State as SignUpState,
  initialState as signUpInitialState,
  stateNamespace as signUpNamespace,
  reducer as signUpReducer
} from '#/reducers/signup'
import {
  State as SsoState,
  initialState as ssoInitialState,
  stateNamespace as ssoNamespace,
  reducer as ssoReducer
} from '#/reducers/sso'
import {
  State as SubscriptionState,
  initialState as subscriptionIntialState,
  reducer as subscriptionReducer
} from '#/reducers/subscription'
import {
  State as TasksState,
  initialState as tasksInitialState,
  stateNamespace as tasksNamespace,
  reducer as tasksReducer
} from '#/reducers/tasks'
import {
  initialState as UIInitialState,
  reducer as UIReducer,
  State as UIState
} from '#/reducers/ui'
import {
  State as UsersState,
  initialState as usersInitialState,
  reducer as usersReducer
} from '#/reducers/users'
import {
  State as VideoState,
  initialState as videoInitialState,
  reducer as videoReducer
} from '#/reducers/video'
import {
  initialState as treatmentPlansInitialState,
  stateNamespace as treatmentPlansNamespace,
  reducer as treatmentPlansReducer,
  State as treatmentPlansState
} from '#/reducers/treatmentPlans'

import { combineReducers } from 'redoodle'

export interface AppState {
  [accountsNamespace]: AccountsState
  appointments: AppointmentsState
  form: FormStateMap
  [patientsNamespace]: PatientsState
  [tasksNamespace]: TasksState
  media: MediaState
  [locationsNamespace]: LocationsState
  notificationPopUp: NotificationPopUpState
  [notificationsNamespace]: NotificationsState
  notes: NotesState
  [proceduresNamespace]: ProceduresState
  users: UsersState
  video: VideoState
  modals: ModalsState
  mediaViewer: MediaViewerState
  [authNamespace]: AuthState
  [treatmentPlansNamespace]: treatmentPlansState
  [accountsNamespace]: AccountsState
  [groupsNamespace]: GroupsState
  [practicesNamespace]: PracticesState
  properties: PropertiesState
  globalSearch: GlobalSearchState
  password: PasswordState
  [signUpNamespace]: SignUpState
  [ssoNamespace]: SsoState
  [procedureCodesNamespace]: ProcedureCodesState
  bulkSelect: BulkSelectState
  chat: ChatState
  microservice: ClientState
  collisions: CollisionsState
  audio: AudioState
  camera: CameraState
  gchat: GChatState
  avatars: AvatarsState
  subscription: SubscriptionState
  ui: UIState
}

export const initialState: AppState = {
  appointments: appointmentsInitialState,
  [locationsNamespace]: locationsInitialState,
  notificationPopUp: notificationPopUpInitialState,
  [notificationsNamespace]: notificationsInitialState,
  form: {},
  [accountsNamespace]: accountsInitialState,
  [patientsNamespace]: patientsInitialState,
  [tasksNamespace]: tasksInitialState,
  media: mediaInitialState,
  notes: notesInitialState,
  [proceduresNamespace]: proceduresInitialState,
  users: usersInitialState,
  video: videoInitialState,
  modals: modalsInitialState,
  mediaViewer: mediaViewerInitialState,
  [authNamespace]: authInitialState,
  [treatmentPlansNamespace]: treatmentPlansInitialState,
  [accountsNamespace]: accountsInitialState,
  [groupsNamespace]: groupsInitialState,
  [practicesNamespace]: practicesInitialState,
  properties: propertiesInitialState,
  globalSearch: globalSearchInitialState,
  password: passwordInitialState,
  [signUpNamespace]: signUpInitialState,
  [ssoNamespace]: ssoInitialState,
  [procedureCodesNamespace]: procedureCodesInitialState,
  bulkSelect: bulkSelectInitialState,
  chat: chatInitialState,
  microservice: initialClientState,
  collisions: collisionsInitialState,
  audio: audioInitialState,
  camera: cameraInitialState,
  gchat: gchatInitialState,
  avatars: avatarsInitialState,
  subscription: subscriptionIntialState,
  ui: UIInitialState
}

export const reducers = combineReducers<AppState>({
  appointments: appointmentsReducer,
  [tasksNamespace]: tasksReducer,
  [locationsNamespace]: locationsReducer,
  notificationPopUp: notificationPopUpReducer,
  [notificationsNamespace]: notificationsReducer,
  form: formReducer,
  [accountsNamespace]: accountsReducer,
  [patientsNamespace]: patientsReducer,
  media: mediaReducer,
  notes: notesReducer,
  [proceduresNamespace]: proceduresReducer,
  users: usersReducer,
  video: videoReducer,
  modals: modalsReducer,
  mediaViewer: mediaViewerReducer,
  [authNamespace]: authReducer,
  [treatmentPlansNamespace]: treatmentPlansReducer,
  [accountsNamespace]: accountsReducer,
  [groupsNamespace]: groupsReducer,
  [practicesNamespace]: practicesReducer,
  properties: propertiesReducer,
  globalSearch: globalSearchReducer,
  password: passwordReducer,
  [signUpNamespace]: signUpReducer,
  [ssoNamespace]: ssoReducer,
  [procedureCodesNamespace]: procedureCodesReducer,
  bulkSelect: bulkSelectReducer,
  chat: chatReducer,
  microservice: microserviceReducer,
  collisions: collisionsReducer,
  audio: audioReducer,
  camera: cameraReducer,
  gchat: gchatReducer,
  avatars: avatarsReducer,
  subscription: subscriptionReducer,
  ui: UIReducer
})
