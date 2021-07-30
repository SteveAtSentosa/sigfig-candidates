import React from 'react';
import { shallow } from 'enzyme';

import { DateSelect } from 'Components/Common';
import moment from 'moment';


describe('DateSelect', () => {
  it('is defined', () => {
    const handleChange = () => {};
    const component = shallow(
      <DateSelect
        value={moment().add(1, 'day')}
        minDate={moment()}
        maxDate={moment().add(2, 'month')}
        labelText="Select Date for this 1-0n-1"
        onChange={handleChange}
      />,
    );
    expect(component).toBeDefined();
  });
});
