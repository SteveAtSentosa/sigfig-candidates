import React from 'react';
import { shallow } from 'enzyme';

import Statistics from './Statistics';

describe('Statistics', () => {
  it('is defined', () => {
    const component = shallow(
      <Statistics
        objectives={[]}
        filteredObjectives={[]}
        userList={[]}
        segmentList={[]}
      />,
    );

    expect(component).toBeDefined();
  });
});
