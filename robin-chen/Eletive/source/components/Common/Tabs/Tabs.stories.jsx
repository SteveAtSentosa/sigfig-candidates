import React from 'react';
import { action } from '@storybook/addon-actions';

import { Tabs } from './Tabs';

export default {
  title: 'Common|Tabs',
  parameters: {
    component: Tabs,
    componentSubtitle: 'Popover with styled container for popup',
  },
};

const props = {
  tabs: [
    {
      id: '1',
      title: 'Objectives',
    },
    {
      id: '2',
      title: 'Segments',
    },
    {
      id: '3',
      title: 'Statistics',
    },
  ],
  onChange: action('onChange'),
  selectedTabId: '2',
};

export const normal = () => (
  <Tabs {...props} />
);
