import React from 'react';
import moment from 'moment';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { DateRangePicker } from './DateRangePicker';

export default {
  title: 'Common|DateRangePicker',
  parameters: {
    component: DateRangePicker,
    componentSubtitle: 'Date range picker',
  },
};

const props = new Store({
  value: [moment().add(1, 'month'), moment().add(2, 'month')],
  minDate: moment(),
  maxDate: moment().add(12, 'month'),
  labelText: 'DateRangerPicker label',
  onChange: (value) => {
    action('onChange')(value);
    props.set({ value });
  },
});

export const normal = () => (
  <State store={props}>
    <DateRangePicker />
  </State>
);
