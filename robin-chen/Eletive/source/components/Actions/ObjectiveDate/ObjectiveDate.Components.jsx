import styled from 'styled-components';

export const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  div{
    display: block;
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const DateWrapper = styled.div`
  min-width: 0;
  &:first-of-type {
    flex: 0 0 calc(50% - 11px);

    ${({ width }) => width && `
      flex-basis: calc(${width} - 11px);
    `}
  }

  &:last-of-type {
    flex: 0 0 calc(50% - 11px);
    ${({ width }) => width && `
      flex-basis: calc(${width} - 11px);
    `}
  }

  div {
    display: block;
  }

  @media screen and (max-width: 768px) {
    &:first-of-type {
      flex-basis: 100%;
      margin-bottom: 10px;
    }

    &:last-of-type {
      flex-basis: 100%;
    }
  }
`;
