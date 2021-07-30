import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { Targets } from 'utilities/reports';

import { CommentList } from './CommentList';

export default {
  title: 'Features|Comments/CommentList',

  parameters: {
    component: CommentList,
    componentSubtitle: '',
  },
};

const comments = [
  {
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
  },
  {
    id: 1,
    organization: 1,
    commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    question: {
      id: 1,
      driver: 1,
      content: {
        en: 'My Relationship with Manager is Great',
      },
      answerTypes: ['text'],
    },
    label: 2,
    acknowledge: true,
    createdAt: 1575270062,
    managers: [
      {
        isCurrentUser: false,
        firstName: 'Alex',
        lastName: 'Fevral',
      },
    ],
    chatStatistic: {
      messagesCount: 12,
      unreadMessagesCount: 8,
      repliedByMe: true,
      replied: true,
    },
    leftByMe: false,
  },
  {
    id: 2,
    organization: 1,
    commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    question: {
      id: 1,
      driver: 1,
      content: {
        en: 'I believe that I have healthy exercise habits',
      },
      answerTypes: ['text'],
    },
    label: 2,
    acknowledge: false,
    createdAt: 1575280062,
    managers: [
      {
        isCurrentUser: true,
        firstName: 'Eric',
        lastName: 'Heflin',
      },
    ],
    chatStatistic: {
      messagesCount: 3,
      unreadMessagesCount: 1,
      repliedByMe: false,
      replied: false,
    },
    leftByMe: false,
  },
];

export const normal = () => (
  <Provider store={store}>
    <CommentList comments={comments} language="en" target={Targets.Segments} />
  </Provider>
);
