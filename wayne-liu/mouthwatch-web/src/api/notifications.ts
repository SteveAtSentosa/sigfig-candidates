import { DataResponse, NotificationEntity, PaginatedDataResponse, ListQueryOpts } from './types'

import { EntityId } from '#/types'
import { makeAuthedJsonRequest, normalizeQueryOpts } from './common'

/**
 * Subscribes to un-acknowledged notifications
 */
export const subscribeNotifications = (authToken: string) => (opts?: ListQueryOpts) =>
  makeAuthedJsonRequest<PaginatedDataResponse<NotificationEntity>>('/notifications', {
    authToken,
    query: normalizeQueryOpts(opts)
  }, {
    useLambda: true
  })

/**
 * Sends a notification
 */
export const sendNotification = (authToken: string) => (type: string, recipientId: string, body: string) =>
  makeAuthedJsonRequest<DataResponse<NotificationEntity>>('/notifications/send', {
    authToken,
    method: 'POST',
    body: {
      type,
      recipientId,
      body
    }
  })

/**
 * Acknowledges a notification
 */
export const acknowledgeNotification = (authToken: string) => (notificationId: EntityId) =>
  makeAuthedJsonRequest<DataResponse<boolean>>(`/notifications/acknowledge/${notificationId}`, {
    authToken,
    method: 'POST'
  })

/**
 * Fetches notification history
 */
export const getNotificationHistory = (authToken: string) => (recipientId: EntityId) =>
  makeAuthedJsonRequest<PaginatedDataResponse<NotificationEntity>>('/notifications/history', {
    authToken,
    query: {
      where: getWhereQuery(recipientId)
    }
  })

function getWhereQuery (recipientId: EntityId): string {
  return JSON.stringify([{ prop: 'recipientId', comp: '=', param: recipientId }])
}
