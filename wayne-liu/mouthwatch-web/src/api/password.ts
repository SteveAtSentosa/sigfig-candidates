import { makeJsonRequest, makeAuthedJsonRequest } from './common'

export const forgotPassword = (username: string) =>
  makeJsonRequest<{ status: boolean }>('/password/forgot', {
    method: 'POST',
    body: { username }
  })

export const resetPassword = (token: string, password: string) =>
  makeAuthedJsonRequest<{ status: boolean }>('/password/reset', {
    authToken: token,
    method: 'POST',
    body: { password }
  })
