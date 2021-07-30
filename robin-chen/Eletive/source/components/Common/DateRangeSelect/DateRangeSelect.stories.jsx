import React from 'react';
import moment from 'moment';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { store } from 'store';
import { DateRangeSelect } from 'Components/Common';

export default {
  title: 'Common|DateRangeSelect',
  parameters: {
    component: DateRangeSelect,
    componentSubtitle: 'DateRangePicker as popup from select like input',
  },
};

const props = new Store({
  value: [moment().add(1, 'day'), moment().add(1, 'month')],
  minDate: moment(),
  maxDate: moment().add(2, 'month'),
  onChange: (value) => {
    action('onChange')(value);
    props.set({ value });
  },
});

export const normal = () => (
  <Provider store={store}>
    <State store={props}>
      <DateRangeSelect />
    </State>
  </Provider>
);
