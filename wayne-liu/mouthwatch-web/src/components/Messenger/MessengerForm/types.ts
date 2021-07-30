import { ArchiveChannel, Channel, SendMessageToChannel, SendMessageToUser, SendMultimediaMessage, WSReadyState } from '#/microservice-middleware'
import { CloseAttachmentsMenu, OpenAttachmentsMenu, PrepareAttachment, UploadMessageAttachments } from '#/actions/chat'
import { LoginResponseAccount, TreatmentPlanEntity } from '#/api'

import { AttachedFile, ViewPermissions } from '#/types'
import { InjectedFormProps } from 'redux-form'
import { OpenAudioRecordingModal } from '#/actions/audio'
import { OpenModal } from '#/actions/modals'
import { RouteComponentProps } from 'react-router'
import { RouteParams } from '#/components/Messenger'

export interface DefaultProps {
  treatmentPlans: TreatmentPlanEntity[]
}

export interface FormData {
  message: string
}

export interface Props extends Partial<DefaultProps>, InjectedFormProps<FormData>, RouteComponentProps<RouteParams> {
  sendMessageToUser: typeof SendMessageToUser
  sendMessageToChannel: typeof SendMessageToChannel
  openAttachmentsMenu: typeof OpenAttachmentsMenu
  closeAttachmentsMenu: typeof CloseAttachmentsMenu
  form: string
  selectedChannel: Channel
  loggedInAccount: LoginResponseAccount
  archiveChannel: typeof ArchiveChannel
  openAudioRecordingModal: typeof OpenAudioRecordingModal
  sendMultiMediaMessage: typeof SendMultimediaMessage
  openVideoRecordingModal: typeof OpenModal
  uploadMessageAttachments: typeof UploadMessageAttachments
  uploadingAttachments: boolean
  prepareAttachment: typeof PrepareAttachment
  attachments: AttachedFile[]
  isAttachmentsMenuOpen: boolean
  initialMessage: string
  currentMessage: string
  isSiteOnline: boolean
  webSocketReadyState: WSReadyState
  viewPerms: ViewPermissions
}

export type ActionProps = Pick<Props, 'sendMessageToUser' | 'openAttachmentsMenu' | 'sendMessageToChannel' | 'archiveChannel' | 'openAudioRecordingModal' | 'prepareAttachment' | 'sendMultiMediaMessage' | 'uploadMessageAttachments' | 'closeAttachmentsMenu' | 'openVideoRecordingModal'>

export type StateProps = Pick<Props, 'treatmentPlans' | 'selectedChannel' | 'loggedInAccount' | 'attachments' | 'isAttachmentsMenuOpen' | 'initialMessage' | 'currentMessage' | 'uploadingAttachments' | 'isSiteOnline' | 'webSocketReadyState' | 'viewPerms'>

export type OwnProps = Pick<Props, 'form'>
