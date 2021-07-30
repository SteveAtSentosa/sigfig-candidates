import styled from 'styled-components';

export const Container = styled.div`
  flex-grow: 1;
`;

export const NumberRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  font-size: 14px;
  padding: 7px 0;
`;

export const NumberValue = styled.div`
  flex-basis: 25%;
  max-width: 25%;
  font-size: 14px;
`;

export const RangeIcon = styled.div.attrs({ children: '-' })`
  flex-basis: 5%;
  max-width: 5%;
  font-size: 24px;
  line-height: 14px;
`;

export const InputNumberWrapper = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

export const ControlButtonContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  width: 76px;
`;
