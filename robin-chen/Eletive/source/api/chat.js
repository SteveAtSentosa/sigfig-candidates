import _ from 'lodash';
import client from './client';

export const queries = {
  chatMessageResponse: `
    id, messageText, createdAt, isUnread, user {
      firstName, lastName, isCurrentUser
    }
  `,
  fetchChatMessageList: subject => `{
    ChatMessages${client.getArgs({ subject })} {
      page, totalCount, pageLimit, items {
        ${queries.chatMessageResponse}
      }
    }
  }`,
};


export function fetchChatMessageList(subject) {
  const query = queries.fetchChatMessageList(subject);

  return client.graphql(query)
    .then(response => response.data.data.ChatMessages.items);
}

export function createChatMessage(chatSubjectID, chatMessage) {
  const chatMessageModel = _.pick(chatMessage, [
    'messageText',
  ]);

  const request = `
    mutation AddChatMessage($subject: Int!, $input: AddChatMessage!) {
      addChatMessage(subject: $subject, input: $input) {
        ${queries.chatMessageResponse}
      }
    }
  `;

  return client.graphql(request, { subject: chatSubjectID, input: chatMessageModel })
    .then(response => response.data.data.addChatMessage);
}

export function updateChatMessage(chatMessageID, chatMessage) {
  const request = `
    mutation UpdateChatMessage($id: Int!, $input: UpdateChatMessage!) {
      updateChatMessage(id: $id, input: $input) {
        ${queries.chatMessageResponse}
      }
    }
  `;

  return client.graphql(request, { id: chatMessageID, input: chatMessage })
    .then(response => response.data.data.updateChatMessage);
}
