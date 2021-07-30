import React from 'react';
import { shallow } from 'enzyme';

import { Card } from './Card';

describe('Card', () => {
  it('is defined', () => {
    const component = shallow(
      <Card
        headerText="Test Header"
        showHeader
      />,
    );

    expect(component).toBeDefined();
  });
});
