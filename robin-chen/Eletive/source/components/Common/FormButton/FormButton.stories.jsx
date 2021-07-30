import React from 'react';
import { action } from '@storybook/addon-actions';

import { filterIcon } from 'images/icons/common';
import { FormButton } from './FormButton';

export default {
  title: 'Common|FormButton',
  parameters: {
    component: FormButton,
  },
};

const props = {
  icon: filterIcon,
  text: 'Form Button',
  onClick: action('onClick'),
};

export const normal = () => (
  <FormButton {...props} />
);

export const disabled = () => (
  <FormButton disabled {...props} />
);
