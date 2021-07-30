import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.button.attrs({ type: 'button' })`
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
  outline: 0;

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

export const Button = ({ forwardedRef, children, ...restProps }) => (
  <Container ref={forwardedRef} {...restProps}>
    { children }
  </Container>
);

Button.propTypes = {
  forwardedRef: PropTypes.object,
  children: PropTypes.node,
};
