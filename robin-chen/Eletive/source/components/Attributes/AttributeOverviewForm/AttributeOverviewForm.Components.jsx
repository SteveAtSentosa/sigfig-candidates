import React from 'react';
import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const Icon = styled(SvgImage)`
  margin-right: 20px;
  svg{
    width: 25px;
    height: 25px;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #354a60;

`;

export const TittleButtonsWrapper = styled.div``;

export const FlagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const FlagIcon = styled(SvgImage)`
  color: #244986;
  margin-right: 8px;
  svg{
    width: 14px;
    height: 14px;
  }
`;

const FlagText = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #244986;
`;

const FlagContainer = styled.div`
  display: flex;
  padding: 6px 0;
`;

export const ViewFlag = ({ text, icon }) => (
  <FlagContainer>
    <FlagIcon source={icon} />
    <FlagText>{text}</FlagText>
  </FlagContainer>
);

export const MenuContainer = styled.div`
  margin-bottom: 20px;
`;

export const SearchBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const NewChoicePopoverFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px -8px -8px;
  padding: 3px;
  border-radius: 0 0 5px 5px;
  background: #F4F6FA;
`;
