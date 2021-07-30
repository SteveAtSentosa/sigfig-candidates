import { Option } from '#/types'

// TODO TYPES: these functions should have (better) type definition

export const createOption = (value: string): Option => (
  { label: value, value }
)

const convertAssociation = (data: object, key: string) => {
  if (data[key].length) {
    switch (key) {
      case 'patients':
        return { patient: { label: `${data[key][0]['first_name']} ${data[key][0]['last_name']}`, value: data[key][0]['id'] } }
      case 'assignments':
        return { assignee: { label: `${data[key][0]['assigned_to']['first_name']} ${data[key][0]['assigned_to']['last_name']}`, value: data[key][0]['id'] } }
      case 'practices':
      case 'groups':
      case 'account_roles':
        const groups = data[key].map(({ name, id }) => ({ label: name, value: id }))
        return { [key]: groups }
    }

  } else if (!data[key]['id']) {
    return {}
  } else {
    switch (key) {
      case 'created_by':
      case 'assignee':
      case 'provider':
      case 'patient':
        return { [key]: { label: `${data[key]['first_name']} ${data[key]['last_name']}`, value: data[key]['id'] } }
      case 'task':
        return { [key]: { label: data[key]['type'], value: data[key]['id'] } }
      case 'appointment':
        return { [key]: { label: data[key]['title'], value: data[key]['id'] } }
      case 'media':
        return { [key]: { label: data[key]['original_name'], value: data[key]['id'] } }
      case 'procedure':
        return { [key]: { label: data[key]['code'], value: data[key]['id'] } }
      case 'groups':
      case 'group':
      case 'practice':
      case 'location':
        return { [key]: { label: data[key]['name'], value: data[key]['id'] } }
      case 'property':
        return { [key]: { label: data[key]['value'], value: data[key]['id'] } }
      case 'procedure_code':
        return { [key]: { label: `${data[key]['code']} - ${data[key]['subcategory'].toLowerCase()} - ${data[key]['description']}`, value: data[key]['id'], fee: data[key]['fee'] } }
      case 'type':
        return { [key]: { label: data[key], value: data['type_option_id'] } }
      case 'note':
      case 'treatment':
      default:
        return { [key]: { label: `${key} ${data[key]['id']}`, value: data[key]['id'] } }
    }
  }
}
const updateKeyWithOption = (key: string, data: object) => {
  if (key in data) {
    if (typeof data[key] === 'object') {
      const obj = convertAssociation(data, key)
      return obj
    } else {
      const obj = { [key]: createOption(data[key]) }
      return obj
    }
  }
}
const convertValues = (keys: Array<string>, data: object) => {
  let obj = {}
  keys.forEach((key) => {
    obj = Object.assign({}, obj, updateKeyWithOption(key, data))
  })
  return obj
}

// i.e. Given an object, create a { label: string, value: string } for the specified keys
export const ConvertDataValueToOption = (keys: Array<string>, data: object) => Object.assign({}, data, convertValues(keys, data))

// e.g. Given an array of patients, output a { label: string, value: string } for each patient
// specify 'patient' (singular) as the model
export const ConvertDataArrayToOptions = (model: string, data: Array<object>): Option[] => {
  const result = []
  data.forEach(item => {
    const obj = { [model]: item }
    const convertedObj = ConvertDataValueToOption([model], obj)
    result.push(convertedObj[model])
  })
  return result
}
