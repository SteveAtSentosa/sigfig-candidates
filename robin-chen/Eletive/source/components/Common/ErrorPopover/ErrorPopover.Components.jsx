import styled from 'styled-components';

export const ChildWrapper = styled.div`
  position: relative;
`;

export const ErrorPopoverContent = styled.div`
  position: relative;
  padding: 19px;
  border: 1px solid #e46363;
  border-radius: 4px;
  background-color: white;
  max-width: 200px;
  transition: opacity 300ms ease-in-out;

  ${props => (!props.isOpen || props.willClose) && 'opacity: 0;'};
  ${props => (props.willOpen) && 'opacity: 1;'};

  @media screen and (min-width: 769px) {
    max-width: 300px;
  }

  :after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-right: 1px solid #e46363;
    border-bottom: 1px solid #e46363;
    background-color: white;

    ${({ position }) => position === 'left'
      && 'right: -9px; top: 50%; transform: rotate(-45deg) translateY(-50%);'}
    ${({ position }) => position === 'right'
      && 'left: -9px; top: calc(50% - 9px); transform: rotate(135deg) translateY(-50%);'}
    ${({ position }) => position === 'top'
      && 'bottom: -9px; left: 50%; transform: rotate(45deg) translateX(-50%);'}
    ${({ position }) => position === 'bottom'
      && 'top: -9px; left: calc(50% - 9px); transform: rotate(-135deg) translateX(-50%);'}
  }
`;
