import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Text = styled.span`
  border: 1px solid #707e93;
  border-radius: 3px;
  background-color: #fff;
  min-width: 20px;
  max-width: 100%;
  padding: 2px 10px;
  line-height: 12px;
  color: #707e93;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;

  ${props => props.small && `
    font-size: 9px;
    padding: 1px 10px;
  `}
`;

export const Tag = ({ small, label }) => (
  <Text small={small}>{label}</Text>
);

Tag.propTypes = {
  small: PropTypes.bool,
  label: PropTypes.string.isRequired,
};
