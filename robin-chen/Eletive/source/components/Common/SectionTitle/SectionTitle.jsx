import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SectionTitle = ({ title, className }) => (
  <div className={className}>
    { title }
  </div>
);

SectionTitle.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

const SectionTitleStyled = styled(SectionTitle)`
  color: #244986;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

export { SectionTitleStyled as SectionTitle };
