import React from 'react';
import { action } from '@storybook/addon-actions';

import { Popover } from './Popover';

export default {
  title: 'Common|Popover',
  parameters: {
    component: Popover,
    componentSubtitle: 'Popover base component',
  },
};

const props = {
  isOpen: true,
  content: <div>Popover node</div>,
  onClickOutside: action('onClickOutside'),
};

export const normal = () => (
  <Popover {...props}><div>Target</div></Popover>
);
