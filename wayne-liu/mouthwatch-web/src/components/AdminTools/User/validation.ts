import { validatePasswordWithMessages, validatePhoneNo } from '#/utils'

import { validateGroupsAndPractices } from '#/components/Form/FormSections/GroupsFormSection'
import validator from 'validator'

const validate = (values) => {
  let errors: typeof values = {}
  if (!values.id) {
    // Create validation
    if (values.groups || values.practices) {
      const { groups, practices } = values
      errors = { ...errors, ...validateGroupsAndPractices({ groups, practices }) }
    }
  } else {
    // Edit validation
    if (!values.groups) {
      if (!values.practices || !values.practices.length) {
        errors.groups = 'Please select at least one group or practice'
        errors.practices = 'Please select at least one group or practice'
      }
    }

    // password
    if (values.password) {
      if (!values.confirm_password) {
        errors.confirm_password = 'Required'
      }

      const validatePasswordMessages = validatePasswordWithMessages(values.password)
      if (validatePasswordMessages) {
        errors.password = validatePasswordMessages
      }

      if (values.confirm_password && values.password !== values.confirm_password) {
        errors.confirm_password = 'Passwords must match'
      }
    }

    if (values.confirm_password && !values.password) {
      errors.password = 'Required'
    }
  }

  if (!values.account_roles || !values.account_roles.length) {
    errors.account_roles = 'Required'
  }

  if (values.phone && !validatePhoneNo(values.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!values.username) {
    errors.username = 'Required'
  }

  if (!values.first_name) {
    errors.first_name = 'Required'
  }

  if (!values.last_name) {
    errors.last_name = 'Required'
  }

  if (!values.email) {
    errors.email = 'Required'
  }

  if (values.email && !validator.isEmail(values.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (values.phone && !validatePhoneNo(values.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  return errors
}

export default validate
