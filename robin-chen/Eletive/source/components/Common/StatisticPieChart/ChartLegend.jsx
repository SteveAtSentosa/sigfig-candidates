import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;

  &:last-child {
    margin-right: 0;
  }
`;

export const LegendCircle = styled.div`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-right: 5px;
  border-radius: 6px;

  ${({ color }) => `background-color: ${color};`}
`;

export const LegendLabel = styled.p`
  margin-bottom: 0;
  color: #707e93;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
`;

const ChartLegend = ({ data, colors }) => (
  <Container>
    {data.map(({ name }, index) => (
      <LegendItem key={name}>
        <LegendCircle color={colors[index]} />
        <LegendLabel>{name}</LegendLabel>
      </LegendItem>
    ))}
  </Container>
);

ChartLegend.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    name: PropTypes.string,
  })),
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default ChartLegend;
