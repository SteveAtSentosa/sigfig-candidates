import React from 'react';
import styled from 'styled-components';

const Container = styled.i`
  line-height: 0;
  font-style: normal;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SvgImage = ({ source, ...props }) => (
  <Container dangerouslySetInnerHTML={{ __html: source }} {...props} />
);
