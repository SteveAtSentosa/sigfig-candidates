import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { InlineButton, SvgImage } from 'Components/Common';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 43px;
  padding: 0 24px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #e5eaf1;

  @media only screen and (max-width: 1024px) {
    padding: 0 10px 0 15px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const DesktopOnly = styled.div`
  ${({ isChat }) => (isChat ?
    `
      @media screen and (max-width: 768px) {
        display: none;
      }
    `
    :
    `
      @media screen and (max-width: 1024px) {
        display: none;
      }
    `
  )}
`;

export const TotalCount = styled.div`
  display: flex;
  margin-right: 6px;
  color: #707e93;
  font-size: 12px;
  font-weight: 500;
  white-space: pre;

  @media screen and (max-width: 1024px) {
    margin-right: 2px;
  }
`;

export const UnreadCount = styled.div`
  display: flex;
  color: #354a60;
  font-size: 12px;
  font-weight: 500;
  white-space: pre;
`;

const ButtonWrapper = styled.div`
  margin-left: 8px;

  @media screen and (max-width: 1024px) {
    margin-left: 5px;
  }
`;

const ButtonIcon = styled(SvgImage)`
  width: 20px;
  height: 20px;

  @media screen and (max-width: 1024px) {
    margin: 0 -5px;
  }
`;

const ButtonTitle = styled.div`
  margin-left: 7px;
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
`;

// NOTE:
// cannot use InlineButton's icon/text props because of style mismatch
// so just pass button content as children
export const HeaderButton = ({ icon, title, onClick }) => (
  <ButtonWrapper>
    <InlineButton onClick={onClick}>
      <ButtonIcon source={icon} />
      <DesktopOnly>
        <ButtonTitle>{ title }</ButtonTitle>
      </DesktopOnly>
    </InlineButton>
  </ButtonWrapper>
);

HeaderButton.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export const Label = styled(Container)`
  height: 20px;
`;

export const LabelCircle = styled.div`
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 5px;
  background-color: ${props => props.color};
`;

export const LabelTitle = styled.div`
  color: #707e93;
  font-size: 12px;
  font-weight: 500;
`;

export const SelectWrapper = styled.div`
  width: 135px;
  margin-right: -10px;

  @media only screen and (max-width: 1024px) {
    margin-right: -9px;
  }
`;
