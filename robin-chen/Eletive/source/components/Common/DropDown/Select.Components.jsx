import styled from 'styled-components';

export const Container = styled.div``;

export const Input = styled.input.attrs({
  readOnly: true,
})`
  height: ${({ small }) => (small ? '30' : '40')}px;
  width: 100%;
  padding: 7.5px;
  border-radius: 5px;
  border: ${({ minimal }) => (minimal ? 'unset' : '1px solid #98a6bc')};
  background-color: ${({ minimal }) => (minimal ? 'transparent' : 'white')};
  cursor: pointer;
  box-sizing: border-box;
`;
