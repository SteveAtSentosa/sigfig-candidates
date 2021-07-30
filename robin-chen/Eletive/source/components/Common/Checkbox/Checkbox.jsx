import React from 'react';
import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

import { checkboxIcon } from 'images/icons/common';

const Label = styled.label`
  display: inline-flex;
  justify-items: center;
  line-height: 0.7;
`;

const Input = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const CheckedMark = styled(SvgImage).attrs({ source: checkboxIcon })`
  cursor: pointer;
  ${props => props.disabled && `
    cursor: not-allowed;
  `}

  svg {
    width: 22px;
    height: 22px;
    ${props => props.small && `
    width: 16px;
    height: 16px;
  `}
    rect{
      fill: none;
      stroke: #C9D0DB;
      ${props => props.isChecked && `
        fill: #66D587;
        stroke: #66D587;
      `}
      ${props => props.disabled && `
        stroke: #98a6bc;
        fill: #e5eaf1;
      `}
    }
    path{
      stroke: transparent;
      ${props => props.isChecked && `
        stroke: #ffffff;
      `}
    }

  }

  &:hover {
    svg {
      rect{
        stroke: #98a6bc;
      }
    }
  }

  ${Input}:focus + & {
    svg {
      rect{
        stroke: #66d587;
        ${props => props.isChecked && `
          stroke: #707e93;
        `}
      }
    }
  }
`;


export const Checkbox = ({ isChecked, disabled, onClick, small, ...props }) => (
  <Label>
    <Input checked={isChecked} disabled={disabled} {...props} />
    <CheckedMark isChecked={isChecked} small={small} disabled={disabled} />
  </Label>
);
