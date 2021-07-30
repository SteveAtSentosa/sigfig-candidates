import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 5px 30px;

  ${props => `
    @media screen and (max-width: ${props.smallScreenWidth}) {
      padding: 5px 14px;
    }
  `}
`;

PageContainer.defaultProps = {
  smallScreenWidth: '768px',
};

export const WidePageContainer = styled(PageContainer).attrs({ smallScreenWidth: '1200px' })``;
