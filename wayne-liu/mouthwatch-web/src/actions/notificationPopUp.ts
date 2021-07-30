import * as React from 'react'
import { defineAction } from 'redoodle'

// Actions

export const ShowNotificationPopUp = defineAction('[notificationPopup] show')<{
  type: 'success' | 'warning' | 'error' | 'info'
  content: React.ReactNode
}>()

export const ShowNotificationPopUpStart = defineAction('[notificationPopup] start')<{
  type: 'success' | 'warning' | 'error' | 'info'
  content: React.ReactNode
}>()

export const HideNotificationPopUp = defineAction('[notificationPopup] hide')()
