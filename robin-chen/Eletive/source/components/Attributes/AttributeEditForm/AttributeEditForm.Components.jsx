import styled from 'styled-components';

export const Container = styled.div`
padding: 24px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin: 20px 0;

  &:first-child {
    margin-top: 0;
  }
`;

export const ToggleWrapper = styled.div`
  display: flex;
  margin: 15px 0;

  & > * {
    margin-right: 10px;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
