import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';

import { Targets } from 'utilities/reports';

import { CommentCard } from './CommentCard';

export default {
  title: 'Features|Comments/CommentCard',
  parameters: {
    component: CommentCard,
  },
};

const comment = {
  id: 0,
  organization: 1,
  commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
  question: {
    id: 1,
    driver: 1,
    content: {
      en: 'Do you have a clear understanding of your career or promotion path?',
    },
    answerTypes: ['text'],
  },
  label: 1,
  acknowledge: false,
  createdAt: 1575280062,
  managers: [
    {
      isCurrentUser: true,
      firstName: 'Alex',
      lastName: 'Fevral',
    },
    {
      isCurrentUser: false,
      firstName: 'Eric',
      lastName: 'Heflin',
    },
  ],
  chatStatistic: {
    messagesCount: 3,
    unreadMessagesCount: 1,
    repliedByMe: false,
    replied: true,
  },
  leftByMe: true,
};

export const normal = () => (
  <Provider store={store}>
    <CommentCard comment={comment} onEditLabel={() => {}} target={Targets.Segments} />
  </Provider>
);
