import styled from 'styled-components';


export const Container = styled.div`
  margin-top: 24px;
`;

export const PanelContainer = styled.div`
  display: flex;

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-basis: 80%;
  margin-right: auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-basis: 100%;
    margin-bottom: 12px;
  }
`;

export const SortContainer = styled.div`
    width: 100%;
`;

export const ListContainer = styled.div`
  margin-top: 16px;
`;
