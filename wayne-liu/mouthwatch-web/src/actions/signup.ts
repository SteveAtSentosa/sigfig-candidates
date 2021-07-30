import { TeleDentSignUpFormValues } from '@m***/library'
import { defineAction } from 'redoodle'

export const SignUp = defineAction('[groups] create_group')<{
  data: TeleDentSignUpFormValues
  clearForm: VoidFunction
  redirectAfterAuth: VoidFunction
}>()
export const SignUpSuccess = defineAction('[groups] create_group_success')()
export const SignUpError = defineAction('[groups] create_group_error')<{ error: Error }>()
