import React from 'react';
import PropTypes from 'prop-types';
import { Charts } from 'Components/Reports';
import {
  Container,
  CenterLabel,
  ChartContainer,
} from './StatisticPieChart.Components';
import ChartLegend from './ChartLegend';

const StatisticPieChart = ({ showCenterText, centerText, height, data, colors, chartData }) => (
  <Container>
    <ChartContainer height={height}>
      {showCenterText && <CenterLabel>{centerText}</CenterLabel>}
      <Charts
        withTooltip
        type="pieMulti"
        data={{ values: chartData }}
      />
    </ChartContainer>
    <ChartLegend data={data} colors={colors} />
  </Container>
);

StatisticPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    name: PropTypes.string,
  })),
  showCenterText: PropTypes.bool,
  centerText: PropTypes.string,
  height: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array.isRequired,
};

StatisticPieChart.defaultProps = {
  height: '100%',
  colors: [],
};

export default StatisticPieChart;
