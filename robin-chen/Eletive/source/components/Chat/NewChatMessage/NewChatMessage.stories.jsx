import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { NewChatMessage } from './NewChatMessage';

export default {
  title: 'Features|Comments/NewChatMessage',

  parameters: {
    component: NewChatMessage,
    componentSubtitle: '',
  },
};

export const normal = () => (
  <Provider store={store}>
    <NewChatMessage />
  </Provider>
);
