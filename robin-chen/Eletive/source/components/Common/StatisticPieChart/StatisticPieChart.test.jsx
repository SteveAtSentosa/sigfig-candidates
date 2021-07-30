import React from 'react';
import { shallow } from 'enzyme';

import * as reportUtils from 'utilities/reports';

import Constants from 'Constants/Actions';
import StatisticPieChart from './StatisticPieChart';

describe('StatisticPieChart', () => {
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
    const colors = Constants.StatisticsPieChartColors.Employees;
    const chartData = reportUtils.statisticPieChart.chartData({ data, colors });

    const component = shallow(
      <StatisticPieChart
        data={data}
        colors={colors}
        chartData={chartData}
      />,
    );

    expect(component).toBeDefined();
  });
});
