import styled from 'styled-components';
import React from 'react';

import { SvgImage } from 'Components/Common';

export const LaunchSelectionTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;
  color: #354A60;
`;

export const LaunchTitle = styled.div`
  margin-top: 35px;
  text-align: center;
  font-weight: bold;
  font-size: 40px;
  line-height: 60px;
  color: #16498b;
`;

export const LaunchSelection = styled.div`
 margin: 55px 64px;
 display: flex;
  justify-content: space-between;
`;

export const LaunchImage = styled(SvgImage)`
  svg {
    width: 120px;
    height: 120px;
  }
`;

export const LaunchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px;
 `;

const LaunchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 331px;
  height: 256px;
  padding: 37px 55px;
  cursor: pointer;

  &:hover {
    background-color: #f4f6fa;
    border-radius: 20px;
  }
`;

const TargetTitle = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  color: #354a60;
`;

export const Launch = ({ title, selected, onClick, icon }) => (
  <LaunchContainer
    selected={selected}
    onClick={onClick}
  >
    <LaunchImage source={icon} />
    <TargetTitle>{title}</TargetTitle>
  </LaunchContainer>
);

export const LaunchText = styled.p`
  font-size: 22px;
  line-height: 33px;
  color: #707e93;
`;

export const LaunchDateTime = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #354A60;
`;


const SeparatorContainer = styled.div`
  margin: 0 0 0 48px;
  border-left: 1px solid #c9d0db;

  > div {
    transform: translate(-50%, 105px);
    padding: 15px;
    background: #fff;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #707e93;
  }
`;

export const Separator = ({ text }) => (
  <SeparatorContainer><div>{text}</div></SeparatorContainer>
);
