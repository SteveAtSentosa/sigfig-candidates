import { makeAuthedJsonRequest } from './common'

import { DataResponse } from './types'

/**
 * Fetches AWSIoT Endpoint
 */
export const getIoTEndpoint = (authToken: string) => () => {
  return makeAuthedJsonRequest<DataResponse<string>>('/iot_endpoint', {
    authToken
  }, {
    useLambda: true
  })
}
