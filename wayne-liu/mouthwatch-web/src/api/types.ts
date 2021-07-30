import { AdditionalUserFormValues, CheckoutFormValues, GroupFormValues, TeleDentAccountOwnerFormValues } from '@m***/library'
import {
  EntityId,
  GroupConsentPolicy,
  GroupTypeCode,
  Layout,
  Media,
  MediaProperties,
  Modify,
  Omit,
  Option,
  Patient,
  ProcedureFromForm as Procedure,
  RoleName,
  SectionData
} from '#/types'

import { GetPatientsOptsWhere } from '#/actions/types'

export type QueryParams = { [k: string]: boolean | number | string }

export type ApiVersions = 'v2' | 'v2.1'

export type UrlOpts = {
  useV2?: boolean
  useLambda?: boolean
}

export interface RequestOpts {
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH'
  query?: QueryParams
  headers?: { [k: string]: string }
  body?: any
}

export interface AuthedRequestOpts extends RequestOpts {
  authToken: string
}

export interface PatientPortalInvitationResponse {
  success: boolean
  account_id: EntityId
}

export interface DataResponse<T> {
  data: T
}

export interface CollisionData<T> {
  collision: boolean
  current: T
}

export interface CollisionDataResponse<T> {
  data: CollisionData<T>
}

export interface PaginatedDataResponse<T> {
  count: number
  page: number
  per_page: null | number
  data: T[]
}
export type SortOrder = 'ASC' | 'DESC'
export type Association = { model: string, as?: string, associations?: AssociationValue, attributes?: string[], where?: WhereValue[] }
export type AssociationValue =
  | Array<Association>
  | Array<string[]>
  | Array<string>

export type WhereOperator = '=' | '>' | '<' | '>=' | '<=' | 'in' | 'like' | '!='

export type WhereValue =
  | [string, WhereOperator, string]
  | { prop: string, comp: WhereOperator, param: string | string[] }
  | { and: WhereValue[] }
  | { or: WhereValue[] }

export interface ListQueryOpts {
  associations?: AssociationValue
  or_where?: WhereValue[]
  where?: WhereValue[]
  order_as?: string
  // TODO LAMBDA: Fix type definitions once lambdas are complete
  // order?: SortOrder
  // sort?: string
  order?: SortOrder | string
  sort?: SortOrder | string
  page?: number
  per_page?: number | null
  channel?: 'Teledent' | 'Henry Schein'
}

// TODO LAMBDA: remove extention of old ListQueryOpts
export interface AccountLambdaQueryOpts extends LambdaQueryOpts {
  inactive?: boolean
  is_patient?: boolean
  accountRoles?: RoleName[]
  full_name?: string
  email?: string
  hasAccessToPatient?: EntityId
}

export interface GroupLambdaQueryOpts extends LambdaQueryOpts {
  group_type?: GroupTypeCode
  name?: string
}

export interface LocationLambdaQueryOpts extends LambdaQueryOpts {
  hasAccessToPatient?: EntityId
}

export type PatientLambdaQueryOpts = GetPatientsOptsWhere & LambdaQueryOpts

export interface LambdaQueryOpts extends ListQueryOpts {
  offset?: number
  limit?: number
}

export type LambdaAssociations = 'accounts' | 'appointments' | 'groups' | 'locations' | 'media' | 'notes' | 'patients' | 'procedures' | 'tasks' | 'treatmentPlans'

export interface CommonIndividualPayload {
  id: EntityId
  associations?: AssociationValue
}

export interface CommonListPayload extends Pick<CommonIndividualPayload, 'associations'> {
  where?: WhereValue[]
  page?: number
  perPage?: number
  order?: string
  sort?: SortOrder
  orderAs?: string
}

export type PatchedEntity = {
  [property: string]: {
    value?: any
    op: 'add' | 'replace' | 'remove'
    options?: Option[]
  }
}

export interface ConnectSocialResponse {
  success: boolean
  account_id: number
}

export interface LoginResponse {
  token: string
  account: LoginResponseAccount
  updated_consent_policies?: GroupConsentPolicy[]
}

export interface ValidateRegistrationResponse {
  success: boolean
  group_consent_policy: string
}

export type LoginResponseAccount = {
  id: EntityId
  username: string
  suffix: string
  prefix: string
  middle_name?: string
  first_name: string
  last_name: string
  is_patient: boolean
  time_zone_pref: string
  group_id: EntityId
  groups: Array<{
    id: EntityId
    name: string
    parent_id: EntityId
    group_type_id: EntityId
    group_type: {
      id: EntityId
      code: string
      name: string
    }
    group_license?: {
      id: EntityId
      license_quantity: number
      licenses_used: number
    }
  }>
  account_roles: Array<{
    id: EntityId
    name: RoleName
  }>
  properties: {}
  media?: Media[]
  updated_at?: string
  facebook_id?: EntityId
  google_id?: EntityId
  email: string
  created_at: string
  phone: string
  sms_opt_in: boolean
}

export type PatientMediaType = 'exam-img' | 'patient-img' | 'chat-img' | 'xray' | 'exam-audio' | 'patient-audio' | 'chat-audio' | 'exam-rpt' | 'exam-doc' | 'patient-doc' | 'chat-pdf' | 'chat-doc' | 'patient-avatar' | 'exam-vid'

export interface RoleEntity {
  id: EntityId
  name: string
}
export interface AccountEntity {
  id: EntityId
  username: string
  groups: GroupEntity[]
  account_roles: RoleEntity[]
  first_name: string
  last_name: string
  avatar?: string
  email?: string
  phone?: string
  prefix?: string
  suffix?: string
  specialty?: string
  videoid?: string
  can_video?: boolean
  time_zone_pref?: string
  account_plan_id: EntityId
  sms_opt_in: boolean
  sms_opt_date: string
}

export type CreateAccountEntity = Modify<Omit<AccountEntity, 'id'>, {
  groups: EntityId[]
}>

export type BulkCreateAccountEntity = Pick<CreateAccountEntity, 'first_name' | 'last_name' | 'email'> & { roles: EntityId[] }

export interface GroupEntity {
  id: EntityId
  name: string
  parent_id: EntityId
  group_type_id: EntityId
  child_groups: Array<{
    id: EntityId
    name: string
    parent_id: EntityId
    group_type_id: EntityId
  }>
  group_license: Array<{
    license_quantity: number
    licenses_used: number
  }>
  address1: string
  address2?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  phone?: string
  secure_video_policy?: string
  practice_policy?: string
  consent_policy?: string
  tag_policy?: string
  properties: {}
}

export interface GroupType {
  id: EntityId
  name: string
  code?: GroupTypeCode
}

export type CreatePatientEntity = Modify<Omit<Partial<PatientEntity>, 'id'>, {
  groups: Option[]
}>

export interface PatientEntity {
  id: EntityId
  first_name: string
  middle_name?: string
  last_name: string
  dob: string
  groups: GroupEntity[]
  account_number?: string
  address1: string
  address2?: string
  city?: string
  state?: string
  zip_code?: string
  phone1: string
  phone2?: string
  emergency_contact?: string
  guardian?: string
  ssn: string
  email: string
  gender?: string
  ref_num?: string
  health_history?: string
  ins_plan?: string
  ins_member_number?: string
  ins_group_number?: string
  medical_alert?: string
  status?: string
  additional_details?: string
  properties: {}
  send_invite?: boolean
}

export type CreateTaskEntity = Omit<TaskEntity, 'id'>

export interface TaskEntity {
  id: EntityId
  type: string
  assignments: Array<{
    id: EntityId
    assigned_to_id: string
    assigned_by_id: string
    assigned_at: string
  }>
  details: string
  due_date: string
  priority: number
  status: number
  not_time_set: boolean
}

export interface UpdateTaskEntity {
  details?: string
  due_date?: string
  priority?: string
  status?: string
  type?: string
}

export interface AppointmentEntity {
  id: EntityId
  patient_id: EntityId
  location_id: EntityId
  provider_id: EntityId
  appointment_type: string
  appointment_start: string
  duration: number
  status: string
  patient?: PatientEntity
}

export interface CreateNoteEntity {
  title: string
  body: string
  account_id?: EntityId
  appointment_id?: EntityId
  form_data_id?: EntityId
  form_schema_id?: EntityId
  location_id?: EntityId
  media_id?: EntityId
  patient_id?: EntityId
  procedure_id?: EntityId
  task_id?: EntityId
}

export interface CreateLocationEntity {
  name: string
  group_id: EntityId
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip_code?: number
  country?: string
  phone?: string
  url?: string
  contact?: string
}

export interface CreateGroupEntity {
  name: string
  parent_id: EntityId
  group_type_id: EntityId
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip_code?: number
  country?: string
  phone?: string
  secure_video_policy?: string
  practice_policy?: string
  consent_policy?: string
  tag_policy?: string
  licenses?: number
}

export interface CreateGroupConsentPolicyEntity {
  language: string
  consent_policy: string
  agree_button_text: string
  decline_button_text: string
  group_id: string
}

export interface CreateProcedureEntity {
  procedure_code_id: EntityId
  provider_id: EntityId
  appointment_id?: EntityId
  patient_id?: EntityId
  treatment_plan_id?: EntityId
  surface?: string[]
  tooth?: string[]
  area?: string[]
  start_date?: string
  end_date?: string
  status?: string
  fee?: string
}

export type PropertyOpts = {
  id: EntityId
  value: string
}

export interface PropertyEntity {
  code: string
  name: string
  global: boolean
  group: {
    id: EntityId
    name: string
  }
  type: string
  options?: PropertyOpts[]
}

export type ValidAssociations = 'appointment' | 'location' | 'patient' | 'procedure' | 'task' | 'treatment_plan' | 'account' | 'group'

// we have to stringify MediaProperties
export interface CreateMediaEntity {
  file: Blob
  association: ValidAssociations
  association_id: EntityId
  properties: MediaProperties | string
}

export interface VideoSessionRequest {
  participants: string[]
}

export interface VideoSessionResponse {
  success: boolean
  session_id: number
  login_url: string
  room_id: string
}

export interface VideoSessionLoginRequest {
  redirect_uri: string
}

export interface VideoSessionLoginResponse {
  login_uri: string
}

export interface TreatmentPlanEntity {
  id: EntityId
  patient_id: EntityId
  summary?: string
  status?: string
  name?: string
  media: Media[]
  procedures?: Procedure[]
  layout?: Layout
  data?: SectionData[]
  patient?: Patient
  created_at?: string
  updated_at?: string
}

export type TreatmentPlanMedia = { id: EntityId, caption?: string }

export type CreateEditTreatmentPlanEntity = Modify<Omit<TreatmentPlanEntity, 'procedures' | 'id'>, {
  media?: EntityId[]
}> & { procedure_ids?: EntityId[] }

export interface NotificationEntity {
  id: EntityId
  type: string
  body: string
  created_by: EntityId
  recipient_id: EntityId
  created_at: string
  acknowledged_at: null | string
  updated_at: string
  updated_by: EntityId
}

export type LinkForLMSSSOResponse = {
  redirectUrl: string
}

export interface BillingAddressEntity {
  first_name: string
  last_name: string
  street1: string
  street2?: string
  city: string
  region: string // state or province
  postal_code: string
  country?: string
  phone?: string
}

export interface PaymentInfoEntity {
  type: string
  card_type: string
  last_four: number
  exp_month: number
  exp_year: number
  gateway_code: string
  gateway_token: string
}

export interface BillingInfoEntity {
  billing_address?: BillingAddressEntity
  payment_info?: PaymentInfoEntity
}

export type InvoiceState = 'paid' | 'pending' | 'processing' | 'past_due' | 'failed' | 'open' | 'closed' | 'voided'
export interface InvoiceEntity {
  company: string
  total: string
  state: InvoiceState
  account: {
    first_name: string
    last_name: string
    address: {
      address1: string
      address2: string
      city: string
      state: string
      zip: string
      country: string
      phone: string
    }
  }
  billing_address: {
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
    email: string
  }
  number: number
  created_at: string
  closed_at: string
  line_items: AdjustmentEntity[]
  pdf_download_link: string | null
}

export interface AdjustmentEntity {
  description: string
  start_date: string
  end_date: string
  product_code: string
  usage_amount: number
}

export interface BillingSection<Data> {
  fetching: boolean
  updating: boolean
  data?: Data
}

export type BillingAddress = BillingSection<BillingAddressEntity>

export type PaymentInfo = BillingSection<PaymentInfoEntity>

export type SubscriptionType = 'essential' | 'pro'

export type GroupRequestPayload = Pick<GroupFormValues, 'name' | 'phone'> & {
  plan_id: string
}

export type AccountOwnerRequestPayload = Pick<TeleDentAccountOwnerFormValues, 'first_name' | 'last_name' | 'email' | 'password'>

export type AdditionalUserRequestPayload = AdditionalUserFormValues

export type BillingInformationPayload = Pick<CheckoutFormValues, 'address' | 'po_box' | 'city' | 'state' | 'zip_code' | 'country'> & {
  token: string
}
