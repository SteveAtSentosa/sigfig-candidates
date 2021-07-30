import * as Api from '#/api'

import { EntityId, Media } from '#/types'

import { AppState } from '#/redux'
import { createDeepEqualSelector } from './common'
import { defineAction } from 'redoodle'

interface DeleteMediaProps {
  id: EntityId
  media?: Media
  patientId?: EntityId
  providerId?: EntityId
}

// Actions
export const SendAllMedia = defineAction('[media] send_media_to_store')<{ data: Array<Media>, patientId?: EntityId }>()
export const TriggerCollectedMediaRefresh = defineAction('[media] trigger_collected_media_refresh')<{ patientId: EntityId }>()

interface ListenForSnapshotsPayload {
  onComplete: (...args: any) => void
}
export const ListenForSnapshots = defineAction('[media] listen_for_snapshots')<ListenForSnapshotsPayload>()

export const SetCurrentMedia = defineAction('[media] set_current_media')<{ media: Media }>()
export const SetCurrentMediaSuccess = defineAction('[media] set_current_media_success')<{ media: Media }>()
export const SetCurrentMediaError = defineAction('[media] set_current_media_error')<{ mediaId: EntityId, error: Error }>()

export const ClearCurrentMedia = defineAction('[media] clear_current_media')()

// specify patientId when refresh of collectedMedia is necessary
export const CreateMedia = defineAction('[media] create_media')<{ file: Blob, association: Api.ValidAssociations, association_id: EntityId, type: string, multiple?: boolean, patientId: EntityId, caption?: string, duration?: number, hideNotification?: boolean, customSuccessMessage?: string }>()
export const TakeSnapshot = defineAction('[media] take_snapshot')<{ file: Blob, association: Api.ValidAssociations, association_id: EntityId, type: string, multiple?: boolean, patientId: EntityId }>()

export const CreateMediaSuccess = defineAction('[media] create_media_successful')<{ media: Media, multiple?: boolean }>()
export const CreateMediaError = defineAction('[media] create_media_failed')<{ error: Error }>()

// copy over collected data to media.data so that MediaViewer can work properly
export const SetCollectedDataAsCurrentMedia = defineAction('[media] set_collected_data_as_current_media')<{ patientId: EntityId }>()

// specify patientId when refresh of collectedMedia is necessary
export const EditMedia = defineAction('[media] edit_media')<{ id: EntityId, media: Api.PatchedEntity, patientId: EntityId, updated_at: string, appointmentId?: EntityId }>()

// specify patientId to remove media from patient's collectedMedia in State
// does not require refresh of collectedMedia
export const DeleteMedia = defineAction('[media] delete_media')<DeleteMediaProps | DeleteMediaProps[]>()
export const DeleteMediaSuccess = defineAction('[media] delete_media_successful')<{ media: Media, patientId?: EntityId }>()
export const DeleteMediaError = defineAction('[media] delete_media_failed')<{ error: Error }>()

/* Collected Media Slide Out Menu */
export const ClearMedia = defineAction('[media] clear_media')()
export const OpenSideMenu = defineAction('[media] open collected media menu')()
export const CloseSideMenu = defineAction('[media] close collected media menu')()

export const SelectMedia = defineAction('[media] select collected media')<{ sectionId: EntityId, incomingMediaID: EntityId }>()
export const DeSelectMedia = defineAction('[media] deselect collected media')<{ sectionId: EntityId, incomingMediaID: EntityId }>()

// Selectors
export const collectedMediaSelector = (state: AppState, patientId: EntityId) => state.media.collected.find(entry => entry.id === patientId)
export const getCollectedMedia = createDeepEqualSelector(collectedMediaSelector, record => record && !record.shouldRefresh ? record.collectedMedia : null)
