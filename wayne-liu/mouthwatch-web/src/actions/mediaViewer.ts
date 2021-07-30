import { EntityId, Media, MediaMap } from '#/types'

import { defineAction } from 'redoodle'

// Actions
export const OpenMediaViewer = defineAction('[media-viewer] open')<{
  mediaIds: string[]
  initialId: string
  notesOpen?: boolean
  metadataOpen?: boolean
  appointmentId?: EntityId
  patientId?: EntityId
  channelId?: string
  media?: {
    data: MediaMap
    fetching: boolean
    error: Error
  }
  metadata?: {
    fetching: boolean
    error: Error
  }
}>()

export const PreviousMedia = defineAction('[media-viewer] previous')()

export const NextMedia = defineAction('[media-viewer] next')()

export const CloseMediaViewer = defineAction('[media-viewer] close')()

export const OpenNotes = defineAction('[media-viewer] open notes tab')()
export const CloseNotes = defineAction('[media-viewer] close notes tab')()
export const ToggleNotes = defineAction('[media-viewer] toggle notes tab')()

export const OpenMetadata = defineAction('[media-viewer] open metadata tab')()
export const CloseMetadata = defineAction('[media-viewer] close metadata tab')()
export const ToggleMetadata = defineAction('[media-viewer] toggle metadata tab')()

export const GetMediaMetadataById = defineAction('[media-viewer] get media metadata by id')<{ id: EntityId }>()
export const GetMediaMetadataByIdSuccess = defineAction('[media-viewer] get media metadata by id success')<{ media: Media }>()
export const GetMediaMetadataByIdError = defineAction('[media-viewer] get media metadata by id error')<{ error: Error }>()

export const UpdateMediaMetadataById = defineAction('[media-viewer] update media metadata by id')<{ id: EntityId }>()
export const UpdateMediaMetadataByIdError = defineAction('[media-viewer] update media metadata by id error')<{ error: Error }>()
