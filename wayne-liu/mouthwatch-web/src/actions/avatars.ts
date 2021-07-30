import { defineAction } from 'redoodle'

// Actions

export const AddAvatar = defineAction('[avatar] add avatar')<{id: string, lambdaUrl: string}>()
export const ClearAvatars = defineAction('[avatar] clear avatars')()
