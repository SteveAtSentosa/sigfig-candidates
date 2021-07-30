import React from 'react';
import { action } from '@storybook/addon-actions';

import {
  editIcon,
  searchIcon,
  applyIcon,
} from 'images/icons/common';
import { List } from './List';

export default {
  title: 'Common|List',

  parameters: {
    component: List,
    componentSubtitle: 'List of items with search/filtering.',
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
};

export const normal = () => (
  <List {...props} />
);
