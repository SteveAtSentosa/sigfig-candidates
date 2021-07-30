import { AppointmentEntity, PatientEntity, TreatmentPlanEntity } from './api'

import { Notification } from './components/Notifications/ActivityFeed/Notificaiton'
import { PatchedEntity } from './api/types'

export type EntityId = string

export interface EntityWithId {
  id: EntityId
  updated_by?: AccountAuditView
  updated_at?: string
  created_by?: AccountAuditView
  created_at?: string
}

export type Direction = 'ASC' | 'DESC'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R

export interface RouteProps {
  history: History
  location: Location
  match: {
    isExact: boolean
    params: {
      [k: string]: void | string
    }
    path: string
    url: string
  }
}

export interface Associations {
  model: string
  as?: string
}

export type AttachedFile = {
  media?: Media
  file?: File
  properties?: string
  association?: 'patient' | 'account'
  association_id?: string
}

export interface InputComponentProps<T> {
  name: string
  value?: object
  onChange?: (newValue: T, oldValue?: T) => void
}

export type Plan = {
  id: string
  code: string
  name: string
  first_month_total: number
  plan_fee: number
  account_price_tiers: {
    limit: number
    price: number
  }[]
  storage_fee: number
  estimated_total: number
}

export type Appt = {
  id: EntityId
  location_id: EntityId
  patient_id: EntityId
  provider_id: EntityId
  appointment_type: EntityId
  appointment_start: Date
  duration?: string
  status: EntityId
  patient?: Patient
  provider?: Account
  location?: PracticeLocation
  notes?: Note[]
  media?: Media[]
  procedures?: ProcedureFromForm[]
  tasks?: TaskFromAPI[]
  updated_at: string
}

export type CreateAppt = {
  appointment_start: Date
  patient_id: EntityId
  provider_id: EntityId
  appointment_type?: EntityId
  duration?: string
  status?: EntityId
  location?: PracticeLocation
}

export type RoleName = 'primarybillingowner' | 'accountowner' | 'groupadmin' | 'specialist' | 'dentist' | 'assistant' | 'patient' | 'superuser' | 'hssales'

export type Role = {
  id: EntityId
  name: RoleName
}

export type GroupTypeCode = 'dentistry' | 'practice' | 'root'

export type Group = {
  id: EntityId
  name: string
  parent_id: EntityId
  group_type: GroupType
  group_type_id: EntityId
  child_groups: Group[]
  group_license: {
    id: EntityId
    license_quantity: number
    licenses_used: number
  }
  group_logo?: object
  parent_group?: Group
  group_type_code?: GroupTypeCode
  accounts?: Account[]
  locations?: PracticeLocation[]
  group_consent_policy?: GroupConsentPolicy[]
  media?: Media[]
  updated_at: string
}

export type GroupConsentPolicy = {
  id: string
  language: string // "English"
  consent_policy: string // "<p>Consent to P..."
  agree_button_text: string // "Agree"
  decline_button_text: string // "Decline"
  group_id: string
  created_by_id?: string
  updated_by_id?: string
  created_at?: string
  updated_at?: string
  reconfirm?: boolean
}

export type GroupType = {
  id: EntityId
  name: string
  code: string
}

export type Practice = {
  id: EntityId
  group_type_id: EntityId
  name: string
  address1: string
  address2: string
  city: string
  state: string
  zip_code: string
  country: string
  phone: string
  media?: Media[]
}

export type RegistrationStatus = 'inactive' | 'invited' | 'active'

export interface Account {
  id: EntityId
  username: string
  account_roles: Array<Role>
  groups: Array<Group>
  practices?: Array<Group>
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  phone: string
  prefix: string
  suffix: string
  specialty: string
  videoid: string
  is_patient: boolean
  can_video: string
  time_zone_pref: string
  properties: ExtraProps
  status: RegistrationStatus
  media?: Media[]
  updated_at: string
  patient?: Patient
  patient_id?: EntityId
  group_id: EntityId
  last_email_sent?: string
  last_email_sent_by_id?: string
  last_email_status?: string
  display_name?: string
  created_at: string
  lastEmailSentBy?: string
  sms_opt_in: boolean
}

export interface Me extends Account {
  view_permission: ViewPermissions
}

interface AccountAuditView {
  id: EntityId
  media?: Media[]
  properties: ExtraProps
  last_name: string
  first_name: string
  suffix?: string
}

type ExtraProps = {
  [k: string]: any
}

export type MediaProperties = {
  type: EntityId
}

export type Login = {
  success: boolean
  token: string
  account: {
    id: number
    uuid: string
    username: string
    createdById: string
    updatedById: string
    createdAt: string
    updatedAt: string
    publicProperties: object
  }
}

export type PracticeLocation = {
  id: EntityId
  name: string
  group_id?: EntityId
  created_by_id?: string
  updated_by_id?: string
  updated_by: AccountAuditView
  created_at?: string
  updated_at?: string
  properties?: object
  group?: Group
}

export type TaskFromAPI = {
  id: EntityId
  type: Option | string
  appointments: AppointmentEntity[]
  details: string
  due_date: Date
  priority: string
  status: string
  created_at?: string
  updated_at?: string
  created_by_id?: string
  updated_by_id?: string
  created_by?: AccountAuditView
  patients?: PatientEntity[]
  assignments?: TaskAssignments[]
  assignee?: Account
  no_time_set: boolean
}

export interface EditableTask extends TaskFromAPI {
  patient: Option
}

type TaskAssignments = {
  id: EntityId
  task_id: EntityId
  assigned_to: {
    first_name: string
    last_name: string
    id: EntityId
    media: Media[]
    properties: {
      [k: string]: any
    }
  }
  assigned_by: AccountAuditView
  assigned_to_id: EntityId
  assigned_by_id: EntityId
  assigned_at: string
  updated_at: string
  time?: Date
}

export type PatientStatus = 'New' | 'Archived'
export interface Patient {
  id: EntityId
  first_name: string
  middle_name?: string
  last_name: string
  dob: string
  ssn?: string
  address1: string
  address2: string
  city: string
  state: string
  zip_code?: string
  phone1: string
  account_id?: string
  phone2: string
  email: string
  guardian: string
  emergency_contact: string
  emergency_phone: string
  guardian_phone: string
  groups?: Group[]
  account_number?: string
  insurance: {
    referenceNumber: string
  }
  ref_num?: string
  ins_plan?: string
  ins_member_number?: string
  ins_group_number?: string
  health: {
    tags: string
  }
  medical_alert?: string
  health_history?: string
  additional_details?: string
  properties: ExtraProps
  tasks?: TaskFromAPI[]
  notes?: Note[]
  media?: Media[]
  procedures?: ProcedureFromForm[]
  treatment_plans?: TreatmentPlanEntity[]
  appointments?: Appt[]
  status?: PatientStatus
  updated_at: string
  groups_practices?: {
    practices: Group[]
    groups: Group
    practiceOptions: Practice[]
  }
  send_invite?: boolean
  account?: Account
}

export type MediaType = 'image' | 'video' | 'xray' | 'audio' | 'doc' | 'plan'

export interface Media {
  id: EntityId
  url: string
  file_name: string
  mime_type: string
  length?: string
  size?: number
  encoding?: string
  type?: string
  data?: {
    data: any
    type: string
  }
  properties: {}
  caption?: string
  tooth?: string[]
  notes?: Note[]
  created_by_id: EntityId
  updated_by_id?: EntityId
  created_at: string
  updated_at?: string
  created_by: AccountAuditView
  media_treatment_plan_caption?: string
  treatment_plan_id?: EntityId
}

export interface Note {
  id: EntityId
  created_at: string
  created_by_id: EntityId
  updated_at: string
  updated_by_id: EntityId
  title: string
  body?: string
  created_by?: Account
}

export interface Document {
  id: EntityId
  created_at: string
  file_name: string
  type: string
}

export interface Audio {
  id: EntityId
  created_at: string
  file_name: string
  length?: string
  creator?: Account
  caption?: string
}

export interface ProcedureFromAPI {
  id: EntityId
  category: string
  subcategory: string
  code: string
  description: string
  year: number
}
export interface Option {
  label: string
  value: string
  id?: string
}
export interface CodeOption extends Option {
  fee?: string
}
export interface ProviderOption extends Option {
  image?: string
}

export interface GroupsPracticesValidation {
  groups: Array<Option>
  practices: Array<Option>
  hasPracticeOptions?: boolean
  practiceIsRequiredIfAvailable?: boolean
}

export interface ProcedureFromForm {
  id: string
  code: CodeOption | string
  provider: Account
  tooth: string[]
  surface: string[]
  area: string[]
  start_date: Date
  end_date: Date
  fee: string
  status: string
  appointment_id: EntityId
  provider_id: EntityId
  procedure_code?: ProcedureCode
  treatment_plan_id?: EntityId
  patient?: Patient
  patient_id?: string
  updated_at: string
  created_at: string
}

export type TransformedProcedure = Modify<ProcedureFromForm, {
  tooth: Option[]
  surface: Option[]
}>

export interface ProcedureCode {
  id: EntityId
  category: string
  subcategory: string
  code: string
  description: string
  year: number
  fee: string
  group_id: EntityId
  createdById?: EntityId
  updatedById?: string
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
}

export interface VideoSession {
  success: boolean
  room_id: string
  login_url: string
}

export type MediaDictionary = {
  [id: string]: { caption: string, data?: Media }
}

export type MediaMap = {
  [id: string]: Media
}

export type SectionTypes = 'title' | 'patient' | 'procedures' | 'images' | 'provider_notes'

export type Layout = {
  template_id?: EntityId
  sections: LayoutSection[]
}

export type LayoutSection = {
  id: string
  type: SectionTypes
  title?: string
  draggable?: boolean
  removable?: boolean
}

export type SectionData = {
  section_id: string
  section_type: SectionTypes
  title?: string
  // Provider Notes section
  text?: string
  // Images section
  media?: MediaDictionary
  order?: string[]
  columns?: number
  // Procedures section
  procedures?: EntityId[]
  // Patient section
  visible_details?: string[]
  // Title section
  logo_url?: string
}

export interface Property {
  code: string
  name: string
  global: boolean
  group: { id: EntityId, name: string }
  type: string
  options?: Array<{ id: EntityId, value: string }>
}

interface Iterable<T> {
  [Symbol.iterator] (): Iterator<T>
}
export type AccountLookup = Iterable<Account>
export type PatientLookup = {[id: string]: Patient}
export type MediaLookUp = {[id: string]: Media}

export type NotificationType = 'Appointment' | 'Appointment Change' | 'Task Assignee' | 'Task Overdue' | 'Video Conferencing' | 'Message'
export type NotificationPayloadType = AppointmentNotificationPayload | TaskNotificationPayload | MessageNotificationPayload | VideoConferenceNotificationPayload
export interface Notification<NotificationPayloadType> {
  id: EntityId
  type: NotificationType
  body: string
  payload: NotificationPayloadType
  created_by: {
    id: EntityId
    first_name: string
    last_name: string
    account_avatar: string
  }
  recipient_id: EntityId
  created_at: Date
  acknowledged_at: null | Date
  updated_at: Date
  updated_by: null | EntityId
}

export interface AppointmentNotificationPayload {
  id: EntityId
  patient_id: EntityId
  provider_id: EntityId
  appointment_id: EntityId
  patient?: {
    first_name: string
    last_name: string
  }
  provider?: {
    first_name: string
    last_name: string
    display_name: string
  }
}
export interface MessageNotificationPayload {
  sender: {
    last_name: string
    first_name: string
    display_name: string
  }
  channel_id: EntityId
}

export interface TaskNotificationPayload {
  task_id: EntityId
  task_type: string
}

export interface VideoConferenceNotificationPayload {
  uri: string
  sender: {
    last_name: string
    first_name: string
    display_name: string
  }
}

export type Model = 'appointment' | 'task' | 'patient' | 'procedure' | 'account' | 'group'

export interface Collision {
  [id: string]: CollisionData
}

export interface CollisionData {
  existingRecord: EntityWithId
  transformedRecord?: EntityWithId
  patchedRecord: PatchedEntity
  namespace: string
  confirmedData?: ConfirmedData
}

export interface ConfirmedData {
  [k: string]: any
}

type ViewPerm = 'granted' | 'hidden' | 'readonly' | 'disabled'

export interface ViewPermissions {
  billing_history_past_invoices: ViewPerm
  browser_media_upload: ViewPerm
  capture: ViewPerm
  consent_policy: ViewPerm
  group_vc: ViewPerm
  group_logo: ViewPerm
  group_messaging: ViewPerm
  intraoral_camera_integration: ViewPerm
  locations: ViewPerm
  multi_camera_vc: ViewPerm
  payment_method: ViewPerm
  procedure_codes: ViewPerm
  subscription_plan_pricing: ViewPerm
  subscription_plan_update: ViewPerm
  tasks: ViewPerm
  treatment_plan_builder: ViewPerm
  vc_record: ViewPerm
  vc_snapshots: ViewPerm
  video_audio_messages: ViewPerm
}

export type ViewPermission = keyof ViewPermissions

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'failed' | 'future' | 'paused'

export type Currency = {
  currency: string
  unitAmount: number
}

export type Tier = {
  ending_quantity: number
  currencies: Currency[]
}

export type EstimatedBillingAddOn = {
  id: string
  plan_id: string
  code: string
  name: string
  current_quantity: number
  current_tier: Tier
}

export type EstimatedBilling = {
  subscription_total: number
  current_period_ends_at: string
  plan_base_fee: number
  plan_name: string
  addons: EstimatedBillingAddOn[]
}
