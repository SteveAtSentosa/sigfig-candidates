import React from 'react';
import styled from 'styled-components';
import { RoundedButton, InlineButton } from 'Components/Common';


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 30px 0;
  margin-top: 30px;
  border-top: 1px solid #c9d0db;

  ${({ hasCustom }) => hasCustom && 'justify-content: space-between;'}
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  padding: 0 7px;
  &:first-child {
    ${({ isLeftAligned }) => isLeftAligned && `
      margin-right: auto;
    `}
  }
`;

export const FormActions = ({ actions, custom }) => (
  <Container data-cy="form-actions" hasCustom={!!custom}>
    {custom}
    <ActionContainer>
      {actions.map(({ isInline, isLeftAligned, ...restProps }, i) => (
        <ButtonContainer key={i} isLeftAligned={isLeftAligned}>
          {isInline ? <InlineButton {...restProps} large /> : <RoundedButton {...restProps} />}
        </ButtonContainer>
      ))}
    </ActionContainer>
  </Container>
);
