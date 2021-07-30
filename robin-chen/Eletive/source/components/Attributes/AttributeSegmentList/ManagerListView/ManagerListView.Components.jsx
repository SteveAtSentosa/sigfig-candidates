import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100% - 42px);
  padding: 24px;
`;

export const SuggestContainer = styled.div`
  display: flex;
`;


export const ManagerListContainer = styled.div`
  flex-basis: 100%;
  margin-top: 20px;
`;

export const ManagerListItem = styled.div.attrs(({ isDeleting }) => ({
  disabled: isDeleting,
}))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px 0;

  ${props => props.isDeleting && `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
