import React from 'react';
import { shallow } from 'enzyme';

import { InlinePieChart } from './InlinePieChart';

describe('InlinePieChart', () => {
  it('is defined', () => {
    const component = shallow(
      <InlinePieChart
        diameter={20}
        strokeWidth={3}
        color="#4489fb"
        percentage={0.75}
      />,
    );
    expect(component).toBeDefined();
  });
});
