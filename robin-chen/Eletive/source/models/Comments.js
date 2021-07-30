import { shape, arrayOf, string, number, bool } from 'prop-types';

import { MinimalUser } from './Users';
import { Question } from './Survey';

export const CommentChatStatistic = shape({
  messagesCount: number,
  unreadMessagesCount: number,
  repliedByMe: bool,
  replied: bool,
});

export const Comment = shape({
  id: number.isRequired,
  commentText: string,
  segments: arrayOf(string),
  question: Question,
  organizationLabel: number,
  individualLabel: number,
  segmentsLabel: number,
  acknowledge: bool,
  createdAt: number,
  managers: arrayOf(MinimalUser),
  leftByMe: bool,
  chatStatistic: CommentChatStatistic,
});

export const Comments = arrayOf(Comment);
