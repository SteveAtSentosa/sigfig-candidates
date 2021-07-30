import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as Models from 'Models';
import { rightChevronIcon } from 'images/icons/common';
import { SvgImage } from '../SvgImage/SvgImage';

const BreadcrumbList = styled.ul`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 14px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 1px 4px rgba(53, 74, 96, 0.19);
  list-style: none;
`;

const BreadcrumbListItem = styled.li`
  display: flex;
  align-items: center;
  color: #98a6bc;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`;

const RightChevron = styled(SvgImage)`
  width: 8px;
  height: 12px;
  margin: 0 13px;
`;

const BreadcrumbLink = styled(Link)`
  padding: 0 5px;
  border: 2px solid transparent;
  color: #98a6bc;

  &:hover, &:active {
    color: #354a60;
    text-decoration: none;
  }

  &:focus {
    border: 2px solid #66d587;
    border-radius: 5px;
    outline: 0 !important;
  }
`;

const Breadcrumbs = ({ items }) => (
  <BreadcrumbList>
    {
      items.map(({ name, route }, index) => (
        <BreadcrumbListItem key={index}>
          {
            route ?
              <BreadcrumbLink to={route}>{name}</BreadcrumbLink> :
              <span>{name}</span>
          }
          {
            index !== items.length - 1
              && <RightChevron source={rightChevronIcon} />
          }
        </BreadcrumbListItem>
      ))
    }
  </BreadcrumbList>
);

Breadcrumbs.propTypes = {
  items: Models.Common.BreadcrumbList.isRequired,
};

export { Breadcrumbs };
