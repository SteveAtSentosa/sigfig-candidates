import React from 'react';
import { action } from '@storybook/addon-actions';

import { SearchBox } from './SearchBox';

export default {
  title: 'Common|SearchBox',
  parameters: {
    component: SearchBox,
  },
};

const props = {
  placeholder: 'Search',
  onChange: action('onChange'),
};

export const normal = () => (
  <SearchBox {...props} />
);
