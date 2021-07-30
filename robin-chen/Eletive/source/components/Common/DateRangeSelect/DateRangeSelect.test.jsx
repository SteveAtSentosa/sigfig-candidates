import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';

import { DateRangeSelect } from './DateRangeSelect';


describe('DateRangeSelect', () => {
  it('is defined', () => {
    const dateRange = [moment().add(1, 'day'), moment().add(1, 'month')];
    const handleChange = () => {};
    const component = shallow(
      <DateRangeSelect
        value={dateRange}
        minDate={moment()}
        maxDate={moment().add(2, 'month')}
        onChange={handleChange}
      />,
    );
    expect(component).toBeDefined();
  });
});
