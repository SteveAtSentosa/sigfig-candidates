import * as Api from '#/api'

import { EntityId, GroupConsentPolicy } from '#/types'
import { RegisterPatientPayload, RegisterProviderPayload, ValidateRegistrationPayload } from './types'

import { defineAction } from 'redoodle'

// Actions

type LoginPayload = {
  username: string
  password: string
  after?: (error?: Error | string) => void
}
export const Login = defineAction('[auth] login')<LoginPayload>()
export const LoginSuccess = defineAction('[auth] login_success')<{ data: Api.LoginResponse }>()
export const LoginError = defineAction('[auth] login_error')<{ error: Error }>()
export const Logout = defineAction('[auth] logout')<{ redirect?: string }>()

export const RefreshUser = defineAction('[auth] refresh')<{ account: Api.LoginResponseAccount }>()

export const ValidateRegistration = defineAction('[auth] validate_otp')<ValidateRegistrationPayload>()

export const RegisterPatient = defineAction('[auth] register for patient portal')<RegisterPatientPayload>()
export const RegisterProvider = defineAction('[auth] register account for teledent')<RegisterProviderPayload>()
export const RegisterSuccess = defineAction('[auth] register_success')<{ data: Api.LoginResponse }>()
export const RegisterError = defineAction('[auth] register_error')<{ error: Error }>()

export const ConnectGoogle = defineAction('[auth] connect_google')<{ accountId: EntityId, idToken: string }>()
export const ConnectGoogleSuccess = defineAction('[auth] connect_google_success')()
export const ConnectGoogleError = defineAction('[auth] connect_google_error')<{ error: Error }>()

export const LoginGoogle = defineAction('[auth] login_google')<{ idToken: string }>()

export const ConnectFacebook = defineAction('[auth] connect_facebook')<{ accountId: EntityId, facebookId: string, accessToken: string }>()
export const ConnectFacebookSuccess = defineAction('[auth] connect_facebook_success')()
export const ConnectFacebookError = defineAction('[auth] connect_facebook_error')<{ error: Error }>()

export const LoginFacebook = defineAction('[auth] login_facebook')<{ facebookId: string, accessToken: string }>()

export const SetRedirectAfterAuth = defineAction('[auth] set redirect after auth')<{ redirectTo: string }>()
export const ClearRedirectAfterAuth = defineAction('[auth] clear redirect after auth')()

export const SetUpdatedConsentPolicies = defineAction('[auth] set updated consent policies')<{
  consentPolicies: GroupConsentPolicy[]
}>()
export const AcceptConsentPolicies = defineAction('[auth] accept_updated_consent_policies')()
export const AcceptConsentPoliciesSuccess = defineAction('[auth] accept_updated_consent_policies_success')()
export const AcceptConsentPoliciesError = defineAction('[auth] accept_updated_consent_policies_error')<{ error: Error }>()
