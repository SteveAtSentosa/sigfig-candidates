import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';

import { DateRangePicker } from './DateRangePicker';


describe('DateRangePicker', () => {
  it('is defined', () => {
    const dateRange = [moment().add(1, 'day'), moment().add(1, 'month')];
    const handleChange = () => {};
    const component = shallow(
      <DateRangePicker
        value={dateRange}
        minDate={moment()}
        maxDate={moment().add(2, 'month')}
        onChange={handleChange}
      />,
    );
    expect(component).toBeDefined();
  });
});
