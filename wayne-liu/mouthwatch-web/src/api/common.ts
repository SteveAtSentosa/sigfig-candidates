import * as Api from '#/api'

import { AuthedRequestOpts, LambdaQueryOpts, ListQueryOpts, QueryParams, RequestOpts, UrlOpts } from './types'

import config from '#/config'
import { isArray } from 'lodash'

export class ApiError extends Error {}

export const buildFormData = (data: object) => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return formData
}

const buildQueryParams = (params: QueryParams) => {
  return Object.keys(params)
    .map(key => [key, encodeURIComponent(`${params[key]}`)])
    .map(keyVal => keyVal.join('='))
    .join('&')
}

export const buildJsonPatch = (entity: object, op = 'replace', includeValueInRemove?: boolean) => {

  const jsonPatch = Object.keys(entity).map((key => {
    if (entity[key]) {
      if (op === 'remove' && includeValueInRemove) {
        return { 'op': op, 'path': `/${key}`, 'value': entity[key] }
      } else if (op === 'remove' && !includeValueInRemove) {
        return { 'op': op, 'path': `/${key}` }
      } else {
        return { 'op': op, 'path': `/${key}`, 'value': entity[key] }
      }
    }
  }))

  return jsonPatch
}

const buildJsonPatchWithIndividualOps = (entity: Api.PatchedEntity) => {
  const jsonPatch = []
  for (const key in entity) {
    if (entity[key] && entity[key]['value'] !== null) {
      jsonPatch.push({ 'op': entity[key]['op'], 'path': `/${key}`, 'value': entity[key]['value'] })
    } else {
      jsonPatch.push({ 'op': entity[key]['op'], 'path': `/${key}` })
    }
  }
  return jsonPatch
}

export function buildCollisionPatch (data: Api.PatchedEntity, updatedAt: string, bypassCollisionHandling = false) {
  return { conflict_update_time: updatedAt, patch_data: buildJsonPatchWithIndividualOps(data), conflict_resolved: bypassCollisionHandling }
}

const convertToLonghand = (param: any[]): Api.AssociationValue | Api.WhereValue[] => {
  const long = param.reduce((arr, assoc) => {
    if (typeof assoc === 'string') {
      // associations
      // ['patient']
      arr.push({ model: assoc })
    } else if (isArray(assoc)) {
      switch (assoc.length) {
        case 1:
          // associations
          // [[ 'patient']]
          arr.push({ model: assoc[0] })
          break
        case 2:
          // associations
          // [[ 'account', 'provider']]
          arr.push({ model: assoc[0], as: assoc[1] })
          break
        case 3:
          // where, or_where
          // [[ 'first_name', '=', 'something' ]]
          arr.push({ prop: assoc[0], comp: assoc[1], param: assoc[2] })
      }
    } else if (Object.keys(assoc).includes('associations')) {
      // associations
      // [{ model: 'patient', associations: [[ 'account', 'provider' ]] }]
      assoc['associations'] = convertToLonghand(assoc['associations'])
      arr.push(assoc)
    } else {
      arr.push(assoc)
    }
    return arr
  }, [])

  return long
}

export const normalizeQueryOpts = (opts: ListQueryOpts | LambdaQueryOpts = {}): QueryParams => {
  const params: QueryParams = {}
  for (const option in opts) {
    if (typeof opts[option] === 'undefined') {
      // if undefined, continue
      continue
    } else if (option === 'associations') {
      params.associations = JSON.stringify(convertToLonghand(opts.associations))
    } else if (option === 'where') {
      params.where = JSON.stringify(convertToLonghand(opts.where))
    } else if (option === 'or_where') {
      params.or_where = JSON.stringify(convertToLonghand(opts.or_where))
    } else if (option && JSON.stringify(opts[option])) {
      params[option] = opts[option]
    }
  }
  return params
}

export const getUrl = (path: string, params: QueryParams = {}, urlOpts: UrlOpts = {}) => {

  const hasParams = Object.keys(params).length > 0
  const queryParams = hasParams ? `?${buildQueryParams(params)}` : ''

  // Determine which base url to use for requests
  const pathString = `${path}${queryParams}`
  if (urlOpts.useLambda) {
    return config.api.lambdaUrl + pathString
  } else if (urlOpts.useV2) {
    return config.api.baseUrlv2 + pathString
  } else {
    return config.api.baseUrl + pathString
  }
}

export const getVideoSessionUrl = (path: string, params: QueryParams = {}) =>
  `${config.api.webrtcUrl}${path}?${buildQueryParams(params)}`

export async function makeRequest<T> (path: string, opts: RequestOpts = {}, urlOpts?: UrlOpts): Promise<T> {
  const url = getUrl(path, opts.query, urlOpts)
  const authHeaders = ((opts as any).authToken)
    ? { Authorization: `Bearer ${(opts as any).authToken}` }
    : {}

  const response = await fetch(url, {
    method: opts.method,
    headers: {
      ...authHeaders,
      ...(opts.headers || {})
    },
    body: opts.body
  })
    .then(res => {
      if (res.status !== 204) {
        return res.json()
      } else {
        return true
      }
    })
    .catch(err => {
      throw new ApiError(err.message)
    })

  if (response.error === 'jwt expired' || response.error === 'invalid token' || response.error === 'No authorization token was found') {
    window.location.href = '/logout'
  } else if (response.error) {
    throw new ApiError(response.error)
  } else {
    return response
  }
}

// So we can get the raw image data
export async function makeRequestForImage (path: string, opts: RequestOpts = {}): Promise<Blob> {
  const url = getUrl(path, opts.query)
  const authHeaders = ((opts as any).authToken)
    ? { Authorization: `Bearer ${(opts as any).authToken}` }
    : {}
  const response = await fetch(url, {
    method: opts.method,
    headers: {
      ...authHeaders,
      ...(opts.headers || {})
    },
    body: opts.body
  })

  const body = await response.blob()

  if (response.ok) {
    return body
  } else {
    const errorMessage = `HTTP Error ${response.status}`
    throw new ApiError(errorMessage)
  }
}

export function makeAuthedRequest<T> (path: string, opts: AuthedRequestOpts) {
  return makeRequest<T>(path, opts)
}

// So we can get the raw image data
export function makeAuthedRequestForImage (path: string, opts: AuthedRequestOpts) {
  return makeRequestForImage(path, opts)
}

export function makeJsonRequest<T> (path: string, opts: RequestOpts = {}, urlOpts?: UrlOpts) {
  return makeRequest<T>(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    },
    body: JSON.stringify(opts.body)
  }, urlOpts)
}

export function makeAuthedJsonRequest<T> (path: string, opts: AuthedRequestOpts, urlOpts?: UrlOpts) {
  return makeJsonRequest<T>(path, opts, urlOpts)
}
