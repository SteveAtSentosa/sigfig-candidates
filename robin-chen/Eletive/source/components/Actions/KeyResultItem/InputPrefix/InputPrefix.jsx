import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 7px 15px;
  border: 1px solid #98a6bc;
  border-radius: 5px;
  background: #ffffff;
  color: #98a6bc;
  text-align: center;
`;

const Label = styled.p`
  margin: 0;
  padding-right: 15px;
  border-right: 1px solid #c9d0db;
  color: #707e93;
  font-weight: 500;
  font-size: 12px;
  line-height: 26px;
`;

export const InputPrefix = ({ label, children }) => {
  const input = React.cloneElement(children, {
    style: { border: 'none', padding: 0 },
  });
  return (
    <Container>
      <Label>{label}</Label>
      {input}
    </Container>
  );
};
