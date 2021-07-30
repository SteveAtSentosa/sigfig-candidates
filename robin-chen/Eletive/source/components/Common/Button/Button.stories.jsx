import React from 'react';
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  title: 'Common|Button',
  parameters: {
    component: Button,
  },
};

const normal = () => (
  <Button onClick={action('onClick')}>
    Normal Button
  </Button>
);


export { normal };
