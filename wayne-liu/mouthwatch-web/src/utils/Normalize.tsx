import { Patient } from '#/types'

export const normalizePhone = value => {
  if (!value) {
    return ''
  }

  const onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
  }

  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`
}

export const removeUSACountryCode = value => {
  return !value ? '' : value.replace(/\D/g, '').replace(/\b1/, '')
}

export const sanitizeFilename = (filename: string) => filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()

export const msToTime = (milliseconds: number, hideMilliseconds = false) => {
  const ms = milliseconds % 1000
  milliseconds = (milliseconds - ms) / 1000
  const secs = milliseconds % 60
  milliseconds = (milliseconds - secs) / 60
  const mins = (milliseconds % 60)
  return (isNaN(ms) || isNaN(secs) || isNaN(mins)) ? false
    : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${!hideMilliseconds ? `:${Math.trunc(ms).toFixed(2)}` : ''}`
}

export const getAddress = (patient: Patient) => `${patient.address1 ? patient.address1 + ', ' : ''} ${patient.address2 || ''} ${patient.city ? patient.city + ',' : ''} ${patient.state || ''} ${patient.zip_code || ''}`

export const normalizeState = (value: string) => value.toUpperCase()

export const upperCaseFirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
