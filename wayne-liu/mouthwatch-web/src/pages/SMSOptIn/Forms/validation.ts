import { Errors, FormData } from './types'

export const validate = (values: FormData) => {
  const errors: Errors = {}
  const { phone, send_text_alerts } = values

  if (send_text_alerts === undefined) {
    errors.send_text_alerts = 'Please select one'
  }

  if (send_text_alerts && !phone) {
    errors.phone = 'Required'
  }

  return errors
}
