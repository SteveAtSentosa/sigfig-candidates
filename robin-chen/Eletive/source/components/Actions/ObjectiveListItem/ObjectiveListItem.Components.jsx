import React from 'react';
import styled from 'styled-components';
import { SvgImage, HelpPopover } from 'Components/Common';

import Constants from 'Constants/Actions';

const StatusPopoverMessage = ['Statuses.OnTrack', 'Statuses.Behind', 'Statuses.AtRisk'];

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);

  ${props => props.expanded && `
    border-bottom: 1px solid #cccccc;
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
  `}
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;

export const HeaderMiddle = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 185px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  width: 120px;
  flex-shrink: 0;
`;

export const MobileHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);

  ${props => props.expanded && `
    border-bottom: 1px solid #cccccc;
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
  `}
`;

export const MobileHeaderContent = styled.div`
  flex-grow: 1;
  border-left: 1px solid #98a6bc4a;
  overflow: hidden;
`;

export const MobileHeaderHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding-left: 20px;
`;

export const TitleWrapper = styled.div.attrs({
  'data-cy': 'objective-title',
})`
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
`;

export const ArrowIcon = styled(SvgImage)`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-right: 25px;
  stroke: #98a6bc;

  @media screen and (max-width: 768px) {
    margin: 0 4px;
  }
`;

export const Title = styled.div`
  flex: 1 1 auto;
  padding-right: 36px;
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .05em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const ClockIcon = styled(SvgImage)`
  width: 14px;
  height: 14px;
  margin-right: 8px;
`;

export const Days = styled.div`
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .1em;
`;

export const DaysWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

export const Percentage = styled.div`
  max-width: 36px;
  min-width: 36px;
  margin: 0 auto 0 12px;
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .1em;
`;

export const PercentageWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

export const ObjectiveItemKeyResultListWrapper = styled.div``;

const StatusCirclesContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 36px;

  @media screen and (max-width: 768px) {
    margin-right: 20px;
  }
`;

const StatusCircle = ({ color, active, onClick }) => (
  <svg width={16} height={16} style={{ margin: '0 4px', cursor: 'pointer' }} onClick={onClick}>
    <circle cx={8} cy={8} r={7} stroke="#98a6bc" strokeWidth={1} fill="none" />
    <circle cx={8} cy={8} r={active ? 8 : 3} fill={color} />
  </svg>
);

export const StatusCircles = ({ status, onChangeStatus, i18n }) => (
  <StatusCirclesContainer>
    {
      StatusPopoverMessage.map((item, index) => (
        <HelpPopover key={index} content={i18n(item)}>
          <StatusCircle
            color={Constants.ObjectiveStatusColors[index]}
            active={status === index}
            onClick={() => onChangeStatus(index)}
          />
        </HelpPopover>
      ))
    }
  </StatusCirclesContainer>
);

export const Line = styled.div`
  position: absolute;
  top: 25px;
  left: 10px;
  bottom: 25px;
  width: 1px;
  background-color: #98a6bc80;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const Dot = styled.div`
  position: absolute;
  left: -33.5px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #98a6bc;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
