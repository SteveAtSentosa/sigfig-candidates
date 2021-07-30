import { shape, arrayOf, string, number, bool } from 'prop-types';

import { MinimalUser } from './Users';

export const ChatMessage = shape({
  id: number,
  messageText: string,
  createdAt: number,
  isUnread: bool,
  user: MinimalUser,
});

export const ChatMessages = arrayOf(ChatMessage);
