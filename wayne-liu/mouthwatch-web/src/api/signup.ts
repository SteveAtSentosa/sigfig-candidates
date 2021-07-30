import {
  AccountOwnerRequestPayload,
  AdditionalUserRequestPayload,
  BillingInformationPayload,
  GroupRequestPayload
} from './types'

import { makeAuthedJsonRequest } from './common'

export const teledentSignUp = (authToken: string) => (
  token: string,
  group: GroupRequestPayload,
  account_owner: AccountOwnerRequestPayload,
  members: AdditionalUserRequestPayload[],
  billing_information: BillingInformationPayload
) =>
  makeAuthedJsonRequest<{ success: boolean }>('/teledentGroupRegistration', {
    authToken,
    method: 'POST',
    body: { token, account_owner, group, members, billing_information }
  }, { useLambda: true })
