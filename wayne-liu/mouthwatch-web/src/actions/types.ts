import {
  AssociationValue,
  BillingAddressEntity,
  InvoiceEntity,
  PatchedEntity,
  PaymentInfoEntity,
  SortOrder,
  SubscriptionType,
  WhereValue
} from '#/api/types'
import { EntityId, GroupConsentPolicy, Option, Patient, RoleName } from '#/types'

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
  useV2?: boolean
}

export type ErrorPayload = { error: Error }

// Auth
export type CallbackPayload = { after?: () => void }

export interface RegisterPatientPayload {
  email: string
  one_time_password: string
  password: string
  after?: (error?: Error | string, id?: EntityId) => void
}

export interface ValidateRegistrationPayload {
  email: string
  one_time_password: string
  after?: (groupConsentPolicies?: GroupConsentPolicy[]) => void
}

export interface RegisterProviderPayload {
  username: string
  one_time_password: string
  password: string
  after?: (error?: Error | RoleName[]) => void
}

export interface UpdateSMSOptStatusPayload {
  phone?: string
  after?: () => void
  sms_opt_in: boolean
  is_registration?: boolean
}

// Tasks
type OptionArg<T> = { label: T, value: T }
type FilterStatus = 'Open' | 'Complete' | 'all'
type FilterStatusOption = OptionArg<FilterStatus>
type FilterDueDate = 'currently_overdue' | 'due_today' | 'due_5_days' | 'between_dates'

export interface FilterObject {
  filter_search?: string
  filter_by_status?: FilterStatusOption
  filter_by_due_date?: FilterDueDate
  filter_by_type?: Option[]
  filter_by_assignee?: {
    assignee_all?: boolean
    assignee_myself?: boolean
    assignees?: Option[]
  }
  start_date?: Date
  end_date?: Date
  created_by_me?: boolean
}

export type UpdateTaskPayload = {
  id: EntityId
  data: PatchedEntity
  updated_at: string
  patientId?: EntityId
  appointmentId?: EntityId
  order?: string
  sort?: SortOrder
  defaultFilter?: FilterObject
}

export type DeleteTaskPayload = Omit<UpdateTaskPayload, 'data' | 'updated_at'>

export type SortAndFilterTasksPayload = {
  filters: FilterObject
  order?: string
  orderAs?: string
  sort?: SortOrder
  accountId: EntityId
  patientId?: EntityId
  appointmentId?: EntityId
}

/* Patient Actions */
export interface GetPatientsOptsWhere {
  dob?: string
  phone?: string
  status?: string
  ref_num?: string
  account?: boolean
  archived?: boolean
  last_name?: string
  first_name?: string
  appointment_location_id?: string
  appointment_start_after?: string
  appointment_start_before?: string
}

export interface GetPatientsOpts {
  page?: number
  per_page?: number
  where?: GetPatientsOptsWhere
  associations?: AssociationValue
  order?: SortOrder | string
  sort?: SortOrder | string
  orderAs?: string
  forDropdown?: boolean
}

export interface GetPatientsSuccessOpts {
  page: number
  patients: Patient[]
  count: number
}

export interface PatientDetailAssociations {
  notes?: boolean
  groups?: boolean
  account?: boolean
  documents?: boolean
  collectedData?: boolean
}

export interface AdminToolsSearchPracticesPayload extends AdminToolsSearchGroupsPayload {
  parentGroupId: EntityId
}

export interface AdminToolsSearchGroupsPayload {
  searchQuery?: string
  page?: number
  perPage?: number
  order?: SortOrder
  sort?: string
  orderAs?: string
}

/* Subscription Actions */
export type UpdatePaymentInfoPayload = PaymentInfoPayload & CallbackPayload

export type UpdateBillingAddressPayload = BillingAddressPayload & CallbackPayload

export type PaymentInfoPayload = PaymentInfoEntity

export type BillingAddressPayload = BillingAddressEntity

export interface PagePayload {
  page: number
}

export interface InvoicesPayload extends PagePayload {
  count: number
  invoices: InvoiceEntity[]
}

export interface SubscriptionPayload {
  type: SubscriptionType
}

export type UpdateSubscriptionPayload = SubscriptionPayload & CallbackPayload
