import React from 'react';
import styled from 'styled-components';
import { SvgImage } from 'Components/Common';
import { rightArrowIcon } from 'images/icons/common';

export const Container = styled.div`
  flex-grow: 1;
`;

export const SortableTableWrapper = styled.div`
  width: 100%;
`;

const ListLinkIcon = styled(SvgImage).attrs({
  source: rightArrowIcon })`
  margin-left: 16px;
  color: #98a6bc;
  svg{
    width: 10px;
    height: 10px;
  }
`;
const ListLinkContainer = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #707e93;
  cursor: pointer;
`;

export const ListLink = ({ count, onClick }) => (
  <ListLinkContainer onClick={onClick}>
    {count}
    <ListLinkIcon />
  </ListLinkContainer>
);
