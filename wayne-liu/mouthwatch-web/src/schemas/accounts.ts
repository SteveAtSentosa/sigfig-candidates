import { Account, AccountLookup, MediaLookUp, PatientLookup } from '#/types'

import { mapping as roleMapping } from '#/schemas/role'
import { schema } from 'normalizr'

export interface NormalizedResponse {
  accounts: AccountLookup
  media: MediaLookUp
  patients: PatientLookup
}

export type AccountEntity = Partial<NormalizedResponse>

const accountSchema = new schema.Entity<Account>('accounts', {
  ...roleMapping
  // ...mediaMapping, FIXME: This is for the media implementation.
  // patient: patientSchema FIXME: This is for when we want apatient implementation
})

export const accountListSchema = new schema.Array<Partial<NormalizedResponse>>(accountSchema)
