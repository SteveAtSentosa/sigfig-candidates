import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';

import { store } from 'store';
import {
  editIcon,
  searchIcon,
  applyIcon,
} from 'images/icons/common';
import { Select } from './Select';

export default {
  title: 'Common|Select',
  parameters: {
    component: Select,
    componentSubtitle: 'SelectBase with SelectList as popup',
  },
};

const props = {
  filterable: true,
  items: [
    {
      id: 1,
      title: 'Edit',
      icon: editIcon,
      onClick: action('onClickItem'),
    }, {
      id: 2,
      title: 'Search',
      icon: searchIcon,
      onClick: action('onClickItem'),
    }, {
      id: 3,
      title: 'Apply',
      icon: applyIcon,
      onClick: action('onClickItem'),
    },
  ],
  activeItem: { id: 2 },
  itemFilter: () => {},
  itemRenderer: item => item.title,
  labelRenderer: () => 'bla bla bla',
};

export const normal = () => (
  <Provider store={store}>
    <Select {...props} />
  </Provider>
);
