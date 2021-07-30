import React from 'react';
import { ChatMessage } from './ChatMessage';

export default {
  title: 'Features|Chat/ChatMessage',

  parameters: {
    component: ChatMessage,
    componentSubtitle: '',
  },
};

const props = {
  message: {
    messageText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
 laborum.`,
    user: {
      firstName: 'Micheal',
      lastName: 'Sen',
    },
    createdAt: Date.now() / 1000,
  },
};

const propsAnonym = {
  message: {
    ...props.message,
    user: null,
  },
};

export const sender = () => (
  <ChatMessage {...props} />
);

export const anonym = () => (
  <ChatMessage {...propsAnonym} />
);

export const reciever = () => (
  <ChatMessage {...props} />
);
