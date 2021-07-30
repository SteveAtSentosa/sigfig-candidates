import React from 'react';
import { shallow } from 'enzyme';

import { TimezonePicker } from './TimezonePicker';

describe('TimezonePicker', () => {
  it('is defined', () => {
    const component = shallow(
      <TimezonePicker
        value={{
          abbreviation: 'GMT',
          offset: 0,
          offsetAsString: '+00:00',
          timezone: 'Europe/London',
          key: 'Europe/London',
          text: 'Europe/London (GMT)',
        }}
        onChange={() => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
