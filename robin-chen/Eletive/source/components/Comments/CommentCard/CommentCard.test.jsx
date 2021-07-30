import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import { CommentCard } from './CommentCard';

describe('CommentCard', () => {
  it('is defined', () => {
    const MockComment = {
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
    const mockStore = configureStore();
    const initialState = {
      app: {
        selectedOrganizationID: 0,
      },
      auth: {
        currentUser: {},
      },
    };
    const store = mockStore(initialState);

    const component = shallow(
      <CommentCard comment={MockComment} store={store} />,
    );

    expect(component).toBeDefined();
  });
});
