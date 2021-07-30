import React from 'react';
import PropTypes from 'prop-types';

import * as reportUtils from 'utilities/reports';

import StatisticPieChart from 'Components/Common/StatisticPieChart/StatisticPieChart';
import { Card } from 'Components/Common';


const ObjectiveStatisticCard = ({ title, data, colors, centerText }) => (
  <Card headerText={title} showHeader>
    <StatisticPieChart
      data={data}
      colors={colors}
      chartData={reportUtils.statisticPieChart.chartData({ data, colors })}
      centerText={centerText}
      height="150px"
      showCenterText
    />
  </Card>
);

ObjectiveStatisticCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    name: PropTypes.string,
  })),
  colors: PropTypes.arrayOf(PropTypes.string),
  centerText: PropTypes.string,
};

export default ObjectiveStatisticCard;
