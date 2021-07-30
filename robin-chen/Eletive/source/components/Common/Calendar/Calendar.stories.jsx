import React from 'react';
import moment from 'moment';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { Calendar } from './Calendar';

export default {
  title: 'Common|Calendar',
  parameters: {
    component: Calendar,
  },
};

const props = new Store({
  value: [moment()],
  labelText: 'Calendar label',
  onSelect: (value) => {
    action('onSelect')(value);
    props.set({ value: [value] });
  },
  onChangeMonth: action('onChangeMonth'),
});

const propsRange = new Store({
  value: [moment(), moment().add(1, 'month')],
  selectRange: true,
  labelText: 'Calendar label',
  onSelect: (value) => {
    action('onSelect')(value);
    const old = propsRange.get('value');
    const val = [];
    if (!old || !old.length || !old.some(e => !e)) {
      val.push(value, null);
    } else {
      const dates = [value, ...old.filter(e => e)];
      val.push(moment.min(dates), moment.max(dates));
    }
    propsRange.set({ value: val });
  },
  onChangeMonth: action('onChangeMonth'),
});

export const normal = () => (
  <State store={props}>
    <Calendar />
  </State>
);

export const range = () => (
  <State store={propsRange}>
    <Calendar />
  </State>
);
