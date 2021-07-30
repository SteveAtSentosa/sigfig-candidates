import styled from 'styled-components';
import { Markdown } from '../Markdown/Markdown';

export const ChildWrapper = styled.div`
  position: relative;
`;

export const HelpPopoverContent = styled.div`
  position: relative;
  padding: 12px 20px;
  border: 1px solid #c9d0db;
  border-radius: 4px;
  background-color: white;
  box-shadow: 3px 6px 12px rgba(218, 218, 218, .2);
  max-width: calc(100vw - 15px);
  transition: opacity 300ms ease-in-out;
  font-size: 12px;

  ${props => (!props.isOpen || props.willClose) && 'opacity: 0;'};
  ${props => (props.willOpen) && 'opacity: 1;'};

  ${props => props.noBorder && `
    border: unset;
    box-shadow: 0px 5px 25px rgba(36, 73, 134, 0.15);
  `};

  @media screen and (min-width: 769px) {
    max-width: 30vw;
  }

  :after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-right: 1px solid #c9d0db;
    border-bottom: 1px solid #c9d0db;
    background-color: white;

    ${props => props.noBorder && `
      border: unset`};

    ${({ position }) => position === 'left'
      && 'right: -9px; top: 50%; transform: rotate(-45deg) translateY(-50%);'}
    ${({ position }) => position === 'right'
      && 'left: -9px; top: calc(50% - 9px); transform: rotate(135deg) translateY(-50%);'}
    ${({ position }) => position === 'top'
      && 'bottom: -9px; left: 50%; transform: rotate(45deg) translateX(-50%);'}
    ${({ position }) => position === 'bottom'
      && 'top: -9px; left: calc(50% - 9px); transform: rotate(-135deg) translateX(-50%);'}
  }

  ${Markdown} {
    h3, p {
      color: #707e93;
    }

    h3 {
      font-weight: 600;
      font-size: 12px;
      margin-top: 18px;
      margin-bottom: 10px;

      &:first-child {
        margin-top: 0;
      }
    }

    p {
      font-weight: 500;
      font-size: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;
