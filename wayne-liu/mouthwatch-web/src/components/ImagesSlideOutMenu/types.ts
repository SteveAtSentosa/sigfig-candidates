import { CloseSideMenu, DeSelectMedia, SelectMedia } from '#/actions/media'
import { EntityId, Media, MediaDictionary } from '#/types'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  patientId: EntityId
  closeCollectedMediaMenu: typeof CloseSideMenu
  token: string
  preprocessed: { [k: string]: string[] }
  sectionId: EntityId
  select: typeof SelectMedia
  deselect: typeof DeSelectMedia
  onAddImages: (media: MediaDictionary) => void
  media: Media[]
  existingMedia: MediaDictionary
}

export type StateProps = Pick<Props, 'token' | 'preprocessed' | 'media'>
export type ActionProps = Pick<Props, 'closeCollectedMediaMenu' | 'select' | 'deselect'>
export type OwnProps = Pick<Props, 'patientId' | 'onAddImages'>
