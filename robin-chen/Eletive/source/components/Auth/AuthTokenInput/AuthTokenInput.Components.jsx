import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

export const Input = styled.input.attrs({
  maxLength: 1,
  className: Classes.INPUT,
})`
  width: 42px;
  height: 52px;
  padding-bottom: 2px;
  font-size: 32px;
  text-align: center;

  @media (max-width: 374px) {
    width: 39px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;

  ${Input}:not(:first-child) {
    margin-left: 10px;
    @media (max-width: 374px) {
      margin-left: 7px;
    }
  }
`;
