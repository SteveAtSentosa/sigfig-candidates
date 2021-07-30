import { defineAction } from 'redoodle'

// Actions
export const ForgotPassword = defineAction('[password] forgot password')<{ username: string }>()
export const ForgotPasswordSuccess = defineAction('[password] forgot success')<{ status: boolean }>()
export const ForgotPasswordError = defineAction('[password] forgot error')<{ error: Error }>()

export const ResetPassword = defineAction('[password] reset password')<{ token: string, password: string }>()
export const ResetPasswordSuccess = defineAction('[password] reset success')<{ status?: boolean }>()
export const ResetPasswordError = defineAction('[password] reset error')<{ error: Error }>()
