import React from 'react';
import { action } from '@storybook/addon-actions';

import { editIcon, searchIcon } from 'images/icons/common';
import { ActionMenu } from './ActionMenu';

export default {
  title: 'Common|ActionMenu',
  parameters: {
    component: ActionMenu,
    componentSubtitle: 'Inline action popup menu',
  },
};

const props = {
  popoverProps: {
    position: 'bottom',
    align: 'end',
  },
  items: [{
    title: 'Edit',
    icon: editIcon,
    onClick: action('onClickItem'),
  }, {
    title: 'Search',
    icon: searchIcon,
  }],
};

export const normal = () => (
  <ActionMenu {...props} />
);
