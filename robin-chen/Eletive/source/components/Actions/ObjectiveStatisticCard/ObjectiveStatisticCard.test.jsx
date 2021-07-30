import React from 'react';
import { shallow } from 'enzyme';

import Constants from 'Constants/Actions';
import ObjectiveStatisticCard from './ObjectiveStatisticCard';

describe('ObjectiveStatisticCard', () => {
  it('is defined', () => {
    const data = [
      {
        name: 'With',
        value: 75,
      },
      {
        name: 'Without',
        value: 25,
      },
    ];

    const component = shallow(
      <ObjectiveStatisticCard
        title="Employees with Objectives"
        data={data}
        colors={Constants.StatisticsPieChartColors.Employees}
      />,
    );

    expect(component).toBeDefined();
  });
});
