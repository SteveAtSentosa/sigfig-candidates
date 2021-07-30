import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SubSectionTitleStyled = styled.div`
  color: #244986;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
`;

const SubSectionTitle = ({ title }) => (
  <SubSectionTitleStyled>
    { title }
  </SubSectionTitleStyled>
);

SubSectionTitle.propTypes = {
  title: PropTypes.string,
};

export { SubSectionTitle };
