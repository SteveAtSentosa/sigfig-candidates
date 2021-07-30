import styled from 'styled-components';

import { SvgImage, Button } from 'Components/Common';

export const Container = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 13px;
  border: 1px solid #98a6bc;
  border-radius: 5px;
  background: #ffffff;
  color: #707e93;
  font-size: 14px;
  font-weight: 400;
  height: 36px;

  ${props => props.small && `
    height: 30px;
    padding: 6px 12px;
  `}

  &:hover {
    border: 1px solid #707e93;
  }

  &:focus {
    border: 1px solid #62d382;
    outline: 0;
  }

  &:active {
    border: 1px solid #707e93;
    background: #fefeff;
  }

  ${props => props.minimal && `
    border: unset;
    background-color: transparent;

    &:hover, &:focus, &:active {
      border: unset;
      background-color: transparent;
    }
  `}

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Icon = styled(SvgImage)`
  display: inline-block;
  height: 12px;
  width: 12px;
  margin-right: 6px;
  color: #98a6bc;

  ${props => props.right && `
    margin-right: 0;
    margin-left: 6px;
  `}

  ${props => props.noText && `
    margin: 0;
  `}
`;

export const Text = styled.span`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
