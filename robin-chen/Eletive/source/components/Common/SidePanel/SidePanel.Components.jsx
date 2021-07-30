import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  right: 0;
  width: 476px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #c9d0db;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 0 3px 16px rgba(36, 73, 134, 0.2);
  z-index: 10;
  transition: right 300ms ease-in-out;

  ${props => (!props.isOpen || props.willClose) && 'right: -476px;'}

  ${props => props.scrollable && `
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    > * {
      flex-shrink: 0;
    }
  `}
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  width: 100%;
  padding: 0 15px;
  font-weight: 500;
  font-size: 12px;
  color: #707e93;
  background: #e5eaf1;
`;
