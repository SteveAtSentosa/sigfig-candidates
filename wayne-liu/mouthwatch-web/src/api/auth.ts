import { ConnectSocialResponse, LinkForLMSSSOResponse, LoginResponse, ValidateRegistrationResponse } from './types'
import { makeAuthedJsonRequest, makeJsonRequest } from './common'

export const login = (username: string, password: string) =>
  makeJsonRequest<LoginResponse>('/auth', {
    method: 'POST',
    body: { username, password }
  })

export const registerPatient = (email: string, one_time_password: string, password: string) =>
  makeJsonRequest<LoginResponse>('/register', {
    method: 'POST',
    body: { email, one_time_password, password }
  })

export const validateRegistration = (username: string, one_time_password: string) =>
  makeJsonRequest<ValidateRegistrationResponse>('/register/validate', {
    method: 'POST',
    body: { username, one_time_password }
  })

export const registerProvider = (username: string, one_time_password: string, password: string) =>
  makeJsonRequest<LoginResponse>('/register/account', {
    method: 'POST',
    body: { username, one_time_password, password }
  })

export const connectFacebook = (authToken) => (account_id: string, facebook_id: string, access_token: string) =>
makeAuthedJsonRequest<ConnectSocialResponse>('/connect/_facebook', {
  authToken,
  method: 'POST',
  body: { account_id, facebook_id, access_token }
})

export const loginFacebook = (user_id: string, access_token: string) =>
  makeJsonRequest<LoginResponse>('/auth/_facebook', {
    method: 'POST',
    body: { user_id, access_token }
  })

export const connectGoogle = (authToken) => (account_id: string, id_token: string) =>
makeAuthedJsonRequest<ConnectSocialResponse>('/connect/_google', {
  authToken,
  method: 'POST',
  body: { account_id, id_token }
})

export const loginGoogle = (id_token: string) =>
  makeJsonRequest<LoginResponse>('/auth/_google', {
    method: 'POST',
    body: { id_token }
  })

export const linkForLMSSSO = (authToken) => () =>
  makeAuthedJsonRequest<LinkForLMSSSOResponse>('/third_party', {
    authToken,
    method: 'GET',
    query: {
      app_name: 'thinkific',
      api_key: ''
    }
  }, { useLambda: true })
