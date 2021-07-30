import { EntityId } from '#/types'
import { ClearAllAttachments } from '#/actions/chat'
import { ThumbnailOptions } from '#/components/Media/Thumbnail'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  patientId: string
  thumbnailOptions: ThumbnailOptions
  token: string
  clearSelectedMedia: () => void
  clearAllAttachments: typeof ClearAllAttachments
}

export interface State {
  selectedPatientId: EntityId
}

export type StateProps = Pick<Props, 'token'>
export type ActionProps = Pick<Props, 'clearAllAttachments'>
