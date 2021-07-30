import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  border: none;
  border-radius: 7px;
  box-shadow: 0 5px 24px rgba(36, 73, 134, 0.1);
  background-color: white;
  overflow: hidden;

  ${({ showHeader }) => (showHeader && `
    padding: 0 0 14px 0;
  `)}

  ${props => props.onClick && `
    cursor: pointer;
  `}
`;

const Header = styled.div`
  padding: 18px 0;
  border-bottom: 1px solid #c9d0db;
  color: #707e93;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;


export const Card = ({ showHeader, headerText, children, className, onClick, ...rest }) => (
  <Container {...rest} showHeader={showHeader} className={className} onClick={onClick}>
    {showHeader && <Header>{headerText}</Header>}
    {children}
  </Container>
);

Card.propTypes = {
  children: PropTypes.node,
  showHeader: PropTypes.bool,
  headerText: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
