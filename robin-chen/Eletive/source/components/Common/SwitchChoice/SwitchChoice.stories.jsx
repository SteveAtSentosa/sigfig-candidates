import React from 'react';
import { action } from '@storybook/addon-actions';

import { publicIcon, privateIcon } from 'images/icons/common';
import { SwitchChoice } from './SwitchChoice';

export default {
  title: 'Common|SwitchChoice',

  parameters: {
    component: SwitchChoice,
    componentSubtitle: 'Switch choice',
  },
};

const props = {
  value: 0,
  choices: [
    {
      value: 0,
      title: 'Public',
      description: 'Use this if segments and employees should be able to align with this objective.',
      icon: publicIcon,
    },
    {
      value: 1,
      title: 'Private',
      // eslint-disable-next-line max-len
      description: 'If the objective should be private and only accessible to people with access to the organization, use this.',
      icon: privateIcon,
    },
  ],
  onChange: action('onChange'),
};

export const normal = () => (
  <SwitchChoice {...props} />
);
