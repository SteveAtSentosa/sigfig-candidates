import React from 'react';
import styled from 'styled-components';
import {
  SvgImage,
  HelpPopover,
} from 'Components/Common';

import { exclamationCircleIcon } from 'images/icons/common';

const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  color: #707e93;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;

  ${props => props.required && `
    &::after {
      content: '*';
      margin-left: 3px;
      color: #ff573e;
      font-size: 14px;
    }
  `}
  ${props => props.inline && `
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0;
    padding-right: 12px;
    vertical-align: middle;
  `}

  ${props => props.inlineOnSmallScreen && `
    @media screen and (max-width: 768px) {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 0;
      padding-right: 12px;
      vertical-align: middle;
    }
  `}
`;

const HelpIcon = styled(SvgImage).attrs({ source: exclamationCircleIcon })`
  margin-left: 8px;
  color: #98a6bc;
  svg {
    width: 13px;
    height: 13px;
  }
`;

const Label = ({ label, required, inline, inlineOnSmallScreen, helpTooltip }) => (
  <LabelContainer required={required} inline={inline} inlineOnSmallScreen={inlineOnSmallScreen}>
    {label}
    {helpTooltip &&
    <HelpPopover content={helpTooltip} position="bottom">
      <HelpIcon />
    </HelpPopover>
    }
  </LabelContainer>
);

export { Label };
