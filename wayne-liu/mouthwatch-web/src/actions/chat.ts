import { ActionChannelResponse, Channel, Message, User as MicroserviceUser, Subscription, UserToChannelTransaction } from '#/microservice-middleware'
import { AttachedFile, EntityId, Media } from '#/types'
import { FilterState, MessagesSynced, ViewableMessages } from '#/reducers/chat'
import { ParametricSelector, createSelector } from 'reselect'
import { find, isEmpty, partition, sortBy } from 'lodash'

import { AppState } from '#/redux'
import { CallbackPayload } from './types'
import { defineAction } from 'redoodle'

export type FilterType = 'contacts' | 'messages'

export type PartitionedChannels = [Channel[], Channel[]]

export interface MessageAttachments {
  channelId: string
  message?: string
  attachments: AttachedFile[]
}

/* Contact Selector */
export const channelsSelector = (state: AppState) => state.microservice.channels
export const initializedSelector = (state: AppState) => state.chat.initialized
export const chatUsersSelector = (state: AppState) => state.microservice.users
export const microserviceUserSelector = (state: AppState) => state.microservice.users
export const filterSelector = (state: AppState) => state.chat.filter
export const loggedInUserSelector = (state: AppState) => state.auth.data.account.id
export const onlineUsersSelector = (state: AppState) => state.microservice.users
export const selectedChannelSelector = (state: AppState) => state.chat.selectedChannel
export const mediaByChannelIdSelector = (state: AppState) => state.chat.mediaByChannelId
export const socketURLSelector = (state: AppState) => state.chat.socketURL
export const chatConnectionSelector = (state: AppState) => state.chat.connected
export const subscriptionsSelector = (state: AppState) => state.microservice.subscriptions
export const viewableMessagesSelector = (state: AppState) => state.chat.viewableMessages
export const messagesSyncedSelector = (state: AppState) => state.chat.messagesSynced
export const defaultViewableMessagesSelector = (state: AppState) => state.chat.DEFAULT_VIEWABLE_MESSAGES
export const defaultMessageSubscriptionCountSelector = (state: AppState) => state.chat.DEFAULT_MESSAGE_SUBSCRIPTION_COUNT
export const channelIdSelector: ParametricSelector<AppState, string, string> = (_state, channelId) => channelId
/* Combiners */

const _getMediaForSelectedChannel = (mediaByChannelId: { [channelId: string]: Media[] }, selectedChannelId: string) => mediaByChannelId && mediaByChannelId[selectedChannelId]

const _getSelectedChannel = (selectedChannelId: string, channels: Channel[]) => {
  return channels.find(c => c.id === selectedChannelId)
}

const _getByIdSelector = (channels: Channel[], channelId: string) => channels.find(c => c.id === channelId)

const _getChannelSubscriptions = (subscriptions: Subscription[], selectedChannelId: string) => {
  return subscriptions.find(s => s.entityType === 'channel').subscriptions.find(t => t.throughId === selectedChannelId)
}

const _getViewableMessagesForChannel = (selectedChannelId: string, viewableMessages: ViewableMessages) => {
  return viewableMessages[selectedChannelId]
}

const _getMessagesSyncedForChannel = (selectedChannelId: string, messagesSynced: MessagesSynced) => {
  return Boolean(messagesSynced[selectedChannelId])
}

const _patientInChatUsers = (chatUsersInChannel: MicroserviceUser[] = []) => {
  const patientAccount = chatUsersInChannel.find(user => user && user.accountData.is_patient)
  return patientAccount
}

const _getChatUsersInSelectedChannel = (chatUsers: MicroserviceUser[], channelId: string, channels: Channel[]) => {
  const channel = channels.find(c => c.id === channelId)
  if (!channel) return null
  const { userToChannels } = channel

  if (userToChannels.length > 0) {
    return userToChannels.map(uC => find(chatUsers, { accountData: { id: uC.userId } }))
  }
}

const _getFilteredChannelList = (channels: Channel[], filter: FilterState, loggedInUser: string, microserviceUsers: MicroserviceUser[]) => {
  // its possible that chat users are not loaded. Therefore we have to make sure to check that it's empty.
  if (isEmpty(microserviceUsers)) return [[],[]] as [Channel[], Channel[]]
  const { users: searchTerm } = filter
  // filter the list by searchTerm
  const filteredList: Channel[] = channels.filter(channel => {
    if (channel.readOnly) return false
    // It's possible that the userToChannels is empty if not handled correctly will cause error on sort.
    if (channel.userToChannels.length === 0) return false
    // Do not show archived channels unless the searchTerm is populated.
    const loggedInUserToChannel = channel.userToChannels.find(c => c.userId === loggedInUser)
    if (!loggedInUserToChannel) return false
    if (loggedInUserToChannel.archived) return false
    const filterIsEmpty = searchTerm === ''
    if (filterIsEmpty) return true
    // remove current logged in user from searchable list.
    const searchableUsers = channel.userToChannels.filter(user => user.userId !== loggedInUser)
    // check if search term is similar to to the full name.
    return searchableUsers.some(user => {
      const { accountData: { first_name: firstName, last_name: lastName } } = user
      return `${firstName.toLowerCase()} ${lastName.toLowerCase()}`.includes(searchTerm.trim())
    })
  })
  // sort the channel list alphabetically

  // return [providerChannels[], patientChannels[]]
  return getPartitionedChannels(filteredList, loggedInUser, microserviceUsers)
}

const sortUserToChannels = (channel: Channel, loggedInUserId: string) => {
  return sortBy(channel.userToChannels.filter(u => u.userId !== loggedInUserId), ['accountData.first_name', 'accountData.last_name'])
}

export const getPartitionedChannels = (channels: Channel[], loggedInUser: string, chatUsers: MicroserviceUser[]) => {
  const filteredChannels = channels.filter(channel => channel.userToChannels.length > 1)

  /*
   We sort the userToChannels array by first / last name,
   get the first entry in that sorted array,
   and use the first / last names to sort the channels
  */
  const sortedChannels = sortBy(filteredChannels, [
    function (channel) {
      const sortedUsers = sortUserToChannels(channel, loggedInUser)
      return sortedUsers[0].accountData.first_name.toLowerCase()
    },
    function (channel) {
      const sortedUsers = sortUserToChannels(channel, loggedInUser)
      return sortedUsers[0].accountData.last_name.toLowerCase()
    }
  ])

  const partitionedChannels: PartitionedChannels = partition(sortedChannels, (channel: Channel) => !(channel.userToChannels.find(c => {
    // partition the channels by [provider, patients]
    if (c.userId === loggedInUser) {
      return false
    } else {
      const userAccount: MicroserviceUser = find(chatUsers, { accountData: { id: c.userId } })
      return (userAccount && userAccount.accountData.is_patient) || c.accountData.is_patient
    }
  })))
  return partitionedChannels
}

export const getFilteredChannels = createSelector([channelsSelector, filterSelector, loggedInUserSelector, chatUsersSelector], _getFilteredChannelList)
export const getSelectedChannel = createSelector([selectedChannelSelector, channelsSelector], _getSelectedChannel)
export const getChannelById = createSelector([channelsSelector, channelIdSelector], _getByIdSelector)

export const getChatUsersInSelectedChannel = createSelector([chatUsersSelector, selectedChannelSelector, channelsSelector], _getChatUsersInSelectedChannel)
export const getPatientInChatUsers = createSelector(getChatUsersInSelectedChannel, _patientInChatUsers)

export const getChannelSubscriptions = createSelector([subscriptionsSelector, selectedChannelSelector], _getChannelSubscriptions)
export const getViewableMessagesForChannel = createSelector([selectedChannelSelector, viewableMessagesSelector], _getViewableMessagesForChannel)
export const getMessagesSyncedForChannel = createSelector([selectedChannelSelector, messagesSyncedSelector], _getMessagesSyncedForChannel)
export const getMediaForSelectedChannel = createSelector([mediaByChannelIdSelector, selectedChannelSelector], _getMediaForSelectedChannel)

export const UploadMessageAttachments = defineAction('[chat] upload attachments')<MessageAttachments>()
export const UploadMessageAttachmentsSuccess = defineAction('[chat] upload attachments success')()

export const PrepareAttachment = defineAction('[chat] prepare attachment for storage')<{ file: File, duration?: number }>()
export const AddAttachments = defineAction('[chat] add attachments')<AttachedFile[]>()
export const RemoveAttachments = defineAction('[chat] remove attachments')<AttachedFile[]>()
export const ClearAllAttachments = defineAction('[chat] clear all attachments')()

export const Filter = defineAction('[chat] filter users')<{ searchTerm: string, type: FilterType}>()
export const UpdateScrollPosition = defineAction('[chat] update scroll positions')<{channel: string, position: number}>()
export const SelectChannel = defineAction('[chat] select channel')<{ channelId: string }>()
export const SelectChannelSuccess = defineAction('[chat] select success channel')<{ channelId: string, patientAccount?: string, clearOnSelection?: boolean }>()
export const ClearSelectedChannel = defineAction('[chat] clear selected channel')()
export const ChangeConnectedStatus = defineAction('[chat] change connected status')<boolean>()

export const OpenAttachmentsMenu = defineAction('[chat] open attachments menu')()
export const CloseAttachmentsMenu = defineAction('[chat] close attachments menu')()

export const PopulateMessage = defineAction('[chat] populate message')<string>()
export const ClearPopulatedMessage = defineAction('[chat] clear populated message')()

export const SelectAttachment = defineAction('[chat] select attachment')<EntityId>()
export const DeSelectAttachment = defineAction('[chat] deselect attachment')<EntityId>()

export const InitSuccess = defineAction('[chat] init success')()

export const InitViewableMessages = defineAction('[chat] init viewable messages')<{ isUnread?: boolean } & CallbackPayload>()

export const SetViewableMessages = defineAction('[chat] set viewable messages')<{ channelId: string, messages: Message[] } & CallbackPayload>()
export const ResetViewableMessages = defineAction('[chat] reset viewable messages')<{ channelId: string, messages: Message[] }>()
export const SyncMessages = defineAction('[chat] sync messages with microservice')<{ channelId: string }>()
export const SetStatus = defineAction('[chat] set status')()

interface SendTreatmentPlanToPatientPayload {
  treatmentPlanId: string
  messageText?: string
  navigateToChat: () => void
}
export const SendTreatmentPlanToPatient = defineAction('[chat] send treatment plan to patient')<SendTreatmentPlanToPatientPayload>()

export const ChannelCreated = defineAction('[chat] channel created')<{ actionResponse: ActionChannelResponse }>()
export const UserToChannelsUpdated = defineAction('[chat] user to channel updated')<{ transaction: UserToChannelTransaction}>()

export const CreateChannelAutoSelect = defineAction('[chat] create channel auto select')<{ userIds: string[]}>()
export const SetOnlineStatus = defineAction('[chat] set online status')<boolean>()
