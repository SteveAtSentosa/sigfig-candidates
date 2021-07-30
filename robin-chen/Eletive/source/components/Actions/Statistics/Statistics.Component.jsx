import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  margin-top: 24px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));;
  }
`;

export const DynamicWidthCardContainer = styled.div`
  ${({ isFullWith }) => (isFullWith ? 'grid-column: 1 / span 2;' : '')}

  @media screen and (max-width: 768px) {
    grid-column: unset;
  }
`;
