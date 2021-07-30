import React from 'react';
import { action } from '@storybook/addon-actions';

import { TextArea } from './TextArea';

export default {
  title: 'Common|TextArea',

  parameters: {
    component: TextArea,
    componentSubtitle: 'Text area input',
  },
};

const props = {
  placeholder: 'Input some text',
  onChange: action('onChange'),
};

export const normal = () => (
  <TextArea {...props} />
);
