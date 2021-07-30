import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import Constants from 'Constants/Comments';
import { CommentHeader } from './CommentHeader';

export default {
  title: 'Features|Comments/CommentHeader',

  parameters: {
    component: CommentHeader,
    componentSubtitle: '',
  },
};

const props = {
  messageCount: 20,
  unreadCount: 6,
  label: Constants.Labels.Important,
  acknowledge: true,
};

export const normal = () => (
  <Provider store={store}>
    <CommentHeader {...props} />
  </Provider>
);
