import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

import { eletiveLogo, eletiveLogoMobile } from 'images';

export const Container = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  z-index: 1;
  min-height: calc(100vh - 72px);

  ${props => props.demoMode && `
    minHeight: calc(100vh - 124px);`}
`;

export const Content = styled.div.attrs({
  'data-cy': 'content',
})`
  flex-grow: 1;
  position: relative;
  padding: 10px;
  background-color: #f4f6fa;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media screen and (max-width: 768px) {
    margin-left: -100%;
    padding: 10px 0 100px;
  }
`;

export const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const DefaultLogo = styled(SvgImage).attrs({
  source: eletiveLogo,
})``;

export const DefaultLogoMobile = styled(SvgImage).attrs({
  source: eletiveLogoMobile,
})``;
