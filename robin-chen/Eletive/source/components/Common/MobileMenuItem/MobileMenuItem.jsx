import styled from 'styled-components';

export const MobileMenuItem = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-bottom: 1px solid #f0f4f5;
  color: rgba(24, 32, 38, 0.9);
  background-color: transparent;
  font-size: 14px;
  text-align: left;

  ${props => props.active && `
    color: white;
    background-color: #1e64bf;
  `}
`;
