import styled from 'styled-components';

export const PageContent = styled.div`
  margin: 25px auto 0;

  ${props => !props.fullWidth && `
    max-width: ${props.maxWidth};
  `}

  > div:not(:first-child) {
    margin-top: 24px;
  }

  ${props => `
    @media screen and (max-width: ${props.smallScreenWidth}) {
      margin: 9px 10px 0 10px;
    }
  `}
`;

PageContent.defaultProps = {
  maxWidth: '800px',
  smallScreenWidth: '768px',
};

export const WidePageContent = styled(PageContent).attrs({
  maxWidth: '1200px',
  smallScreenWidth: '1024px',
})``;
