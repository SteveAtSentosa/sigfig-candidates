import React from 'react';
import moment from 'moment';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { DateSelect } from 'Components/Common';

export default {
  title: 'Common|DateSelect',
  parameters: {
    component: DateSelect,
    componentSubtitle: 'DatePicker as popup',
  },
};

const props = new Store({
  value: moment().add(1, 'day'),
  minDate: moment(),
  maxDate: moment().add(2, 'month'),
  labelText: 'Select Date for this 1-0n-1',
  onChange: (value) => {
    action('onChange')(value);
    props.set({ value });
  },
});

export const normal = () => (
  <State store={props}>
    <DateSelect />
  </State>
);

export const checked = () => (
  <State store={props}>
    <DateSelect isChecked />
  </State>
);

export const disabled = () => (
  <State store={props}>
    <DateSelect disabled />
  </State>
);
