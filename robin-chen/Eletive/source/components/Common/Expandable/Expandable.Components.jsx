import styled from 'styled-components';

export const Container = styled.div.attrs({
  'data-cy': 'expandable-list-item',
})`
  position: relative;
  margin-bottom: 16px;
  border: 1px solid transparent;

  ${props => props.expanded && `
    border: 1px solid #c9d0db;
    border-radius: 5px;
    background-color: #f9fafc;
  `}
`;

export const ChildrenContainer = styled.div.attrs({
  'data-cy': 'expandable-list-item-content',
})`
  position: relative;
  margin: 0 20px;
  padding-left: 40px;

  @media screen and (max-width: 768px) {
    margin: 0 18px;
    padding-left: 0;
  }
`;

export const Line = styled.div`
  position: absolute;
  top: 25px;
  left: 10px;
  bottom: 25px;
  width: 1px;
  background-color: #98a6bc80;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
