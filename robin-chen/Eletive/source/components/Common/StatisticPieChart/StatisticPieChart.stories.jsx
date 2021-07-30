import React from 'react';

import * as reportUtils from 'utilities/reports';

import Constants from 'Constants/Actions';
import StatisticPieChart from './StatisticPieChart';

export default {
  title: 'Common|StatisticPieChart',
  parameters: {
    component: StatisticPieChart,
  },
};

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

const props = {
  data,
  colors,
  chartData: reportUtils.statisticPieChart.chartData({ data, colors }),
  height: '153px',
};

export const normal = () => <StatisticPieChart {...props} />;

const propsWithCenterText = {
  data,
  colors,
  chartData: reportUtils.statisticPieChart.chartData({ data, colors }),
  height: '153px',
  showCenterText: true,
  centerText: '100%',
};

export const withCenterText = () => <StatisticPieChart {...propsWithCenterText} />;

const dataWithLongLabels = [
  {
    name: 'With long labels testing on tooltip and legend',
    value: 75,
  },
  {
    name: 'Without long labels testing on tooltip and legend',
    value: 25,
  },
];

const propsWithLongLabel = {
  data: dataWithLongLabels,
  colors,
  chartData: reportUtils.statisticPieChart.chartData({ data: dataWithLongLabels, colors }),
  height: '153px',
};

export const withLongLabel = () => <StatisticPieChart {...propsWithLongLabel} />;
