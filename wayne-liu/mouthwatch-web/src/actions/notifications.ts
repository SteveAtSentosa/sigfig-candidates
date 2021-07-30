import { EntityId, MessageNotificationPayload, Notification, NotificationPayloadType } from '#/types'

import { AppState } from '#/redux'
import { defineAction } from 'redoodle'

// selectors
export const getActiveNotifications = (state: AppState) => state.notifications.activeNotifications
export const getBrowserNotificationIds = (state: AppState) => state.notifications.browserNotificationIds
export const getActiveNotificationsCount = (state: AppState) => state.notifications.count

export const getActiveMessageNotificationsByChannelId = (state: AppState, channelId: EntityId) => {
  return state.notifications.activeNotifications.filter(notification => {
    const { payload } = notification as Notification<MessageNotificationPayload>
    return notification.type === 'Message' && payload.channel_id === channelId
  })
}

// Actions
export const StartPolling = defineAction('[notifications] start polling')()

export const Poll = defineAction('[notifications] poll')<{ page?: number, perPage?: number, order?: string }>()
export const PollSuccess = defineAction('[notifications] poll success')<{ notifications: Notification<NotificationPayloadType>[], count?: number, page?: number, perPage?: number }>()
export const PollError = defineAction('[notifications] poll error')<{ error: Error }>()

export const Acknowledge = defineAction('[notifications] acknowledge')<{ id: EntityId }>()
export const AcknowledgeSuccess = defineAction('[notifications] acknowledge success')<{ id: EntityId }>()
export const AcknowledgeError = defineAction('[notifications] acknowledge error')<{ error: Error }>()

export const FetchHistory = defineAction('[notifications] fetch history')()
export const FetchHistorySuccess = defineAction('[notifications] fetch history success')<{ notifications: Notification<NotificationPayloadType>[] }>()
export const FetchHistoryError = defineAction('[notifications] fetch history error')<{ error: Error }>()

export const Send = defineAction('[notifications] send')<{ type: string, recipientId: string, body: string }>()
export const SendSuccess = defineAction('[notifications] send success')()
export const SendError = defineAction('[notifications] send error')<{ error: Error }>()

export const NotifyBrowser = defineAction('[notifications] notify browser')<{ notification: Notification<NotificationPayloadType> }>()
export const NotifyBrowserError = defineAction('[notifications] notify browser error')<{ error: Error }>()
export const CheckBrowserNotificationSettings = defineAction('[notifications] check browser notification setting')()
