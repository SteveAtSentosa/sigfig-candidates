import { defineAction } from 'redoodle'

// Actions

export const SsoLogin = defineAction('[sso] login')<{ accountId: string, bounceTo: string, token: string }>()
export const SsoLoginSuccess = defineAction('[sso] login_success')<{ bounceTo: string }>()
export const SsoLoginError = defineAction('[sso] login_error')<{ error: Error }>()

export const selectors = {}
