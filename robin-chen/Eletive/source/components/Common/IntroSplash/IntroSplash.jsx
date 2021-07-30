import React from 'react';
import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

import { startArrowIcon } from 'images/icons/common';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 25vh auto;
  max-width: 650px;

  @media screen and (max-width: 768px) {
    width: auto;
  }
`;

const Message = styled.div`
  width: 100%;
  max-width: 282px;
  padding: 0 12px;
  color: #354a60;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
`;

const StartImageContainer = styled.div`
  width: 100px;
`;

const ArrowImageContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 100px;

  @media screen and (max-width: 768px) {
    top: 0;
  }
`;

const Description = styled.div`
  margin-top: 16px;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: #98a6bc;
`;

const IntroSplash = ({ title, icon, description }) => (
  <Container>
    <StartImageContainer>
      <SvgImage source={icon} />
    </StartImageContainer>
    <Message>
      {title}
    </Message>
    <ArrowImageContainer>
      <SvgImage source={startArrowIcon} />
    </ArrowImageContainer>
    {description &&
    <Description>{description}</Description>
    }
  </Container>
);

export { IntroSplash };
