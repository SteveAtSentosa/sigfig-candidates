import React from 'react';
import { Chat } from './Chat';
import { CommentTitle } from '../Comments/CommentTitle/CommentTitle';

export default {
  title: 'Features|Chat/Chat',

  parameters: {
    component: Chat,
    componentSubtitle: '',
  },
};

const props = {
  titleRender: () => <CommentTitle
    title="Do you have a clear understanding of your career or promotion path?"
    numberOfManagers={2}
    timestamp={Date.now() / 1000 - 70000}
  />,
  chatMessages: [
    {
      messageText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
 laborum.`,
      user: {
        firstName: 'Micheal',
        lastName: 'Sen',
        isCurrentUser: true,
      },
      createdAt: Date.now() / 1000 - 5000,
      isUnread: false,
    },
    {
      messageText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
 laborum.`,
      user: null,
      createdAt: Date.now() / 1000 - 3000,
      isUnread: true,
    },
    {
      messageText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
 laborum.`,
      user: null,
      createdAt: Date.now() / 1000 - 1000,
      isUnread: true,
    },
  ],
};

export const normal = () => (
  <Chat {...props} />
);
