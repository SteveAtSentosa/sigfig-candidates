import React from 'react';
import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

export const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 313px;
  width: 268px;
  background: #ffffff;
`;

export const LabelContainer = styled.div`
  display: flex;
  height: 24px;
  margin-bottom: 10px;
  color: #707e93;
`;

export const LabelIcon = styled(SvgImage)`
    width: 24px;
    height: 24px;
    margin-right: 10px;
    color: #354a60;
`;

export const LabelText = styled.span`
  height: 100%;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;

export const CalendarNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
`;

export const NavigationLabel = styled.div`
  flex: 5;
  color: #707e93;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;

export const WeekdaysLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 2px 7px;
  border-radius: 5px;
  color: #ffffff;
  background: #4489fb;
  font-size: 14px;
  font-weight: bold;

  div {
    width: 40px;
    text-align: center;
  }
`;

export const DayContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  height: 192px;
  padding: 0 13px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;

const DayBox = styled.div`
  display: flex;
  justify-content: center;
  width: 42px;
  height: 24px;

  ${props => (props.range || props.startRange || props.endRange || props.firstDay || props.lastDay) && `
    background: #E5eaf1;
  `}

  ${props => (props.startRange || props.firstDay) && `
    justify-content: flex-start;
    width: 36px;
    margin-left: 5px;
    margin-right: 0;
    border-radius: 24px 0 0 24px;
  `}

  ${props => (props.endRange || props.lastDay) && `
    justify-content: flex-end;
    width: 36px;
    margin-left: 0;
    margin-right: 5px;
    border-radius: 0 24px 24px 0;
  `}

  &:first-child {
    width: 36px;
    padding-right: 8px;
    border-radius: 24px 0 0 24px;
    ${props => (props.startRange || props.firstDay) && `
      margin: 0;
    `}
    ${props => props.endRange && `
      background: initial;
      margin: 0;
    `}
    ${props => props.lastDay && `
      width: 28px;
      padding-right: 0;
      margin: 0;
      margin-right: 8px
      border-radius: 24px
    `}
  }

  &:last-child {
    width: 36px;
    padding-left: 8px;
    border-radius: 0 24px 24px 0;
    ${props => props.startRange && `
      background: initial;
      margin: 0;
    `}
    ${props => (props.endRange || props.lastDay) && `
      margin: 0;
    `}
    ${props => props.firstDay && `
      width: 28px;
      padding-left: 0;
      margin: 0;
      margin-left: 8px
      border-radius: 24px
    `}

  }
`;

const DayNumber = styled.div`
  width: 24px;
  height: 24px;
  padding: 3px;
  color: #707e93;
  font-size: 14px;
  text-align: center;
  cursor: pointer;

${props => props.blank && `
  color: #C9d0db;
  cursor: default;
`}

${props => props.selected && `
  border-radius: 24px;
  color: #ffffff;
  background: #F68e7e;
`}
`;

export const Day = props => (
  <DayBox {...props} onClick={null}>
    <DayNumber {...props} />
  </DayBox>
);
