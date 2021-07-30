import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const RatingItems = styled.div`
  display: flex;
  height: 4px;
`;

export const RatingItem = styled.div`
  background-color: ${({ color }) => color};
  height: 4px;
  width: 28px;
  margin-left: 5px;

  &:first-child {
    margin-left: 0px;
  }
`;

export const Label = styled.div`
  margin-left: 10px;
  color: #707e93;
  font-weight: 600;
  font-size: 12px;
`;
