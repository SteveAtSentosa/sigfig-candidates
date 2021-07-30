import React from 'react';
import { shallow } from 'enzyme';

import { DateTimeSelect } from 'Components/Common';
import moment from 'moment';


describe('DateTimeSelect', () => {
  it('is defined', () => {
    const handleChange = () => {};
    const component = shallow(
      <DateTimeSelect
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
