import styled from 'styled-components';

export const Container = styled.div`
`;

export const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 15px 0;
  ${({ height }) => `
    height: ${height};
  `}
`;

export const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  color: #354a60;
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
`;
