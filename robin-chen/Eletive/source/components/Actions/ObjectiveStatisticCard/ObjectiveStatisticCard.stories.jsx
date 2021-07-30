import React from 'react';
import styled from 'styled-components';

import Constants from 'Constants/Actions';
import ObjectiveStatisticCard from './ObjectiveStatisticCard';

export default {
  title: 'Features|Actions/ObjectiveStatisticCard',
  parameters: {
    component: ObjectiveStatisticCard,
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

const props = {
  data,
  title: 'Employees with Objectives',
  colors: Constants.StatisticsPieChartColors.Employees,
  centerText: '100%',
};

const Container = styled.div`
  width: 360px;
  padding: 30px;
`;

export const normal = () => (
  <Container>
    <ObjectiveStatisticCard {...props} />
  </Container>
);
