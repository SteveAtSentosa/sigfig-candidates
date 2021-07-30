import React from 'react';
import { State, Store } from '@sambego/storybook-state';

import { Checkbox } from 'Components/Common';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Common|Checkbox',

  parameters: {
    component: Checkbox,
    componentSubtitle: '',
  },
};

const props = new Store({
  isChecked: false,
  onChange(event) {
    action('onChange')(event);
    props.set({ isChecked: event.currentTarget.checked });
  },
});

export const normal = () => (
  <State store={props}>
    <Checkbox {...props} />
  </State>
);


export const disabled = () => (
  <Checkbox {...props} disabled />
);

export const disabledChecked = () => (
  <Checkbox {...props} disabled isChecked />
);
