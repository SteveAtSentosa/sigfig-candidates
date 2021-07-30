import { difference, isEqual, isPlainObject, omit } from 'lodash'

import { PatchedEntity } from '#/api/types'
import { format } from 'date-fns'
import { getUTCDateString } from './Dates'

export default (form: any, record: any): PatchedEntity => {

  // transform any arrays of entities in the record into arrays of ids for comparison with form values later
  const formattedRecord: any = Object.keys(record).reduce((obj, key) => {
    if (Array.isArray(record[key])) {
      const arrayOfIds = record[key].reduce((arr, value) => {
        if (isPlainObject(value)) {
          arr.push(value['id'])
        } else {
          arr.push(value)
        }
        return arr
      }, [])
      obj[key] = arrayOfIds
    } else {
      obj[key] = record[key]
    }
    return obj
  }, {})

  // some fields will have values of type { label: string, value: string }, or Array<{ label: string, value: string }>
  // we just want the raw value(s)
  const formattedForm: any = Object.keys(form).reduce((obj, key) => {
    if (isPlainObject(form[key])) {
      if (key === 'groups') {
        obj[key] = [ form[key]['value'] ]
      } else {
        obj[key] = form[key]['value']
      }
    } else if (Array.isArray(form[key])) {
      const arrayOfValues = form[key].reduce((arr, objValue) => {
        arr.push(objValue['value'])
        return arr
      }, [])
      obj[key] = arrayOfValues
    } else {
      obj[key] = form[key]
    }
    return obj
  }, {})

  // specific to Account records
  // concatenate groups and practices >_<
  if (formattedForm['groups'] && formattedForm['practices']) {
    if (formattedForm['practices'].length) {
      formattedForm['groups'] = formattedForm['practices']
    }
    delete formattedForm['practices']
  }

  const omittedKeys = [
    'confirm_password', 'updated_by', 'updated_at', 'updated_by_id', 'created_by',
    'created_at', 'created_by_id', 'properties', 'media', 'picture', 'group_license',
    'group_type_id', 'group_type', 'parent_group', 'child_groups', 'group',
    'group_consent_policy'
  ]

  const patchedEntity: PatchedEntity = Object.keys(formattedForm).reduce((obj, key) => {

    // exceptions
    if (omittedKeys.includes(key)) {
      return obj
    } else if (key === 'password') {
      obj[key] = { value: formattedForm[key], op: 'replace' }
    } else if (key === 'procedure_code') {
      if (formattedRecord.procedure_code_id !== formattedForm['procedure_code']) {
        obj[key] = { value: formattedForm[key], op: 'replace' }
      }
    } else if (key === 'licenses') {
      if (formattedRecord.group_license.license_quantity !== formattedForm['licenses']) {
        obj[key] = { value: formattedForm[key], op: 'replace' }
      }
    } else if (key === 'dob') {
      if (format(formattedForm[key], 'YYYY-MM-DD') !== format(getUTCDateString(formattedRecord[key]), 'YYYY-MM-DD')) {
        obj[key] = { value: format(formattedForm[key], 'YYYY-MM-DD'), op: 'replace' }
      }
    } else if (!record[key] && formattedForm[key]) {
      obj[key] = { value: formattedForm[key], op: 'add' }
    } else if (formattedRecord[key] && !formattedForm[key] && typeof formattedForm[key] !== 'boolean') {
      // make sure boolean values (e.g. can_video) are preserved
      obj[key] = { value: null, op: 'remove' }
    } else if (Array.isArray(formattedForm[key])) {
      // isEqual cannot adequately compare two arrays
      if (difference(formattedForm[key], formattedRecord[key]).length || difference(formattedRecord[key], formattedForm[key]).length) {
        obj[key] = { value: formattedForm[key], op: 'replace' }
      }
    } else if (!isEqual(formattedForm[key], formattedRecord[key]) && formattedForm[key]) {
      obj[key] = { value: formattedForm[key], op: 'replace' }
    }

    return obj
  }, {})

  // in order to edit account_roles, we have to use the key: roles
  // see REST API docs
  if (Object.keys(patchedEntity).includes('account_roles')) {
    patchedEntity['roles'] = patchedEntity['account_roles']
  }

  return omit(patchedEntity, 'account_roles')
}
