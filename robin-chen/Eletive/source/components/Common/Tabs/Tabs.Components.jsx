import styled from 'styled-components';

import { Button, SvgImage } from 'Components/Common';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Tab = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 0;
  border-bottom: 3px solid transparent;
  color: #707e93;
  background-color: transparent;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 30px;
  }

  &:hover {
    color: #354a60;
  }

  &:focus {
    border-bottom: 3px solid #66d5873a;
    ${props => props.selected && `
      border-bottom: 3px solid #66d587;
    `}
  }

  ${props => props.selected && `
    border-bottom: 3px solid #66d587;
    color: #354a60;
  `}
`;

export const Icon = styled(SvgImage)`
  display: flex;
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;

export const ActionContainer = styled.div`
  margin-left: auto;
`;
