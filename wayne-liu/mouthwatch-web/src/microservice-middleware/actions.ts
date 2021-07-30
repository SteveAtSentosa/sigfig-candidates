import { ActionResponses, OutgoingArchiveChannel, OutgoingMarkAsRead, OutgoingMediaMessage, OutgoingSetSubscription, OutgoingTouch, OutgoingVideoMessage } from './types'
import { ClientState, OutgoingCreateChannel, OutgoingMessageToChannel, OutgoingMessageToUser, Response, Transaction } from '.'

import { defineAction } from 'redoodle'

export const Init = defineAction('[microservice] initialize')<{initialState: ClientState}>()
export const Close = defineAction('[microservice] close')()
export const CloseSuccess = defineAction('[microservice] close success')()
export const Transact = defineAction('[microservice] transaction')<{transaction: Transaction}>()
export const ResponseTransaction = defineAction('[microservice] response')<{response: ActionResponses}>()
export const TransactError = defineAction('[microservice] transaction error')<{ message: string }>()
export const UnknownTransact = defineAction('microservice unknown transaction')<{data: Response}>()
export const CreateChannel = defineAction('[microservice] create channel')<OutgoingCreateChannel>()
export const DestroyOwnChannel = defineAction('[microservice] destroy own channel')()
export const Authenticate = defineAction('[microservice] authenticate')()
export const SendMessageToUser = defineAction('[microservice] send messages')<OutgoingMessageToUser>()
export const SendMessageToChannel = defineAction('[microservice] send message to channel')<OutgoingMessageToChannel>()
export const SendMultimediaMessage = defineAction('[microservice] send multimedia message')<OutgoingMediaMessage>()
export const SendVideoMessage = defineAction('[microservice] send video message')<OutgoingVideoMessage>()
export const Touch = defineAction('[microservice] touch')<OutgoingTouch>()
export const MarkAsRead = defineAction('[microservice] mark as read')<OutgoingMarkAsRead>()
export const ArchiveChannel = defineAction('[microservice] archive channel')<OutgoingArchiveChannel>()
export const SetSubscription = defineAction('[microservice] set subscription')<OutgoingSetSubscription>()
export const Connect = defineAction('[microservice] connect')()
export const SetReadyState = defineAction('[microservice set ready state')<number>()
