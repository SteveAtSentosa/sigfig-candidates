import { AttachedFile } from '#/types'
import { RemoveAttachments } from '#/actions/chat'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  attachment: AttachedFile
  token: string
  removeAttachments: typeof RemoveAttachments
}

export type StateProps = Pick<Props, 'token'>
export type ActionProps = Pick<Props, 'removeAttachments'>
export type OwnProps = Pick<Props, 'attachment'>
