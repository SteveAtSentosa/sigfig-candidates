export const allowedDocumentTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/rtf',
  'text/rtf',
  'model/stl',
  'application/octet-stream'
]

export const allowedPatientUploadTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/ogg'
]

export const removeInvalidCharacters = (text: string) => {
  // using octal values for certain characters
  return text.replace(/(~|#|%|&|:|;|\52|\134|\74|\76|\133|\135|\173|\175|\77|\42|\47)/g, '')
}

export const allowedStates = [
  'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
  'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
  'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
  'VT','VI','VA','WA','WV','WI','WY'
]
