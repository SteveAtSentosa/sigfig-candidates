import { Patient } from '#/types'
import { mapping as mediaMapping } from '#/schemas/media'
import { schema } from 'normalizr'

export const patientSchema = new schema.Entity<Patient>('patient', {
  ...mediaMapping
})

export const patientListSchema = new schema.Array(patientSchema, 'patients')
