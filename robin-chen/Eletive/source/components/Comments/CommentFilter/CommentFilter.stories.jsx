import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';
import { Provider } from 'react-redux';

import { store } from 'store';

import { CommentFilter } from './CommentFilter';


export default {
  title: 'Features|Comments/CommentFilter',

  parameters: {
    component: CommentFilter,
    componentSubtitle: '',
  },
};

const props = new Store({
  config: {
    labels: 1,
  },
  onApply: (config) => {
    action('OnApply')(config);
    props.set({
      config,
    });
  },
});

export const normal = () => (
  <Provider store={store}>
    <State store={props}>
      <CommentFilter />
    </State>
  </Provider>
);
