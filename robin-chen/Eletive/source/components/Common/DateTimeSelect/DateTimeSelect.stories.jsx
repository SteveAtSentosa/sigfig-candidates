import React from 'react';
import moment from 'moment';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { DateTimeSelect } from 'Components/Common';

export default {
  title: 'Common|DateTimeSelect',
  parameters: {
    component: DateTimeSelect,
    componentSubtitle: 'DateTimePicker as popup',
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
    <DateTimeSelect />
  </State>
);

export const checked = () => (
  <State store={props}>
    <DateTimeSelect isChecked />
  </State>
);

export const disabled = () => (
  <State store={props}>
    <DateTimeSelect disabled />
  </State>
);
