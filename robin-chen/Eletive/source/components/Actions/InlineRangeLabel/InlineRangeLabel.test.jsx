import React from 'react';
import { shallow } from 'enzyme';

import { InlineRangeLabel } from './InlineRangeLabel';

describe('InlineRangeLabel', () => {
  it('is defined', () => {
    const item = {
      name: 'Percent',
      type: 0,
      currency: '',
      value: 55,
      minValue: 20,
      maxValue: 100,
    };

    const component = shallow(
      <InlineRangeLabel
        item={item}
      />,
    );
    expect(component).toBeDefined();
  });
});
