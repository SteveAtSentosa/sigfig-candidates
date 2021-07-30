import styled from 'styled-components';


export const Container = styled.div`
  margin-top: 4px;
`;

export const PanelContainer = styled.div`
  display: flex;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-right: auto;
  margin-top: 44px;
`;

export const ListContainer = styled.div`
  margin-top: 16px;
`;

export const LabelWrap = styled.div`
  display: flex;
  width: 166px;
  margin-top: 16px;
  margin-left: 12px;

  @media screen and (max-width: 768px) {
    width: auto;
    margin-left: 0;
  }
`;
