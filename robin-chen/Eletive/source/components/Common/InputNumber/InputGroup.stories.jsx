import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { InputNumber } from './InputNumber';

export default {
  title: 'Common|InputNumber',
  parameters: {
    component: InputNumber,
  },
};

const props = new Store({
  value: 0,
  onChange: (value) => {
    action('onChange')(value);
    props.set({ value });
  },
});

export const normal = () => (
  <State store={props}>
    <InputNumber {...props} showLeadingZero placeholder="HH" min={0} max={24} />
  </State>
);

export const withoutZero = () => (
  <State store={props}>
    <InputNumber {...props} placeholder="HH" min={0} max={24} />
  </State>
);

export const mini = () => (
  <State store={props}>
    <InputNumber {...props} mini placeholder="HH" min={0} max={24} />
  </State>
);
