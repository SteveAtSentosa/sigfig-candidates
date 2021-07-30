import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

import { searchIcon } from 'images/icons/common';

export const Container = styled.div`
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 7px 20px 7px 0;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 1px;
  border-color: #c9d0db;
  color: #707e93;
  background-color: transparent;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.05em;
  outline: 0;

  &::placeholder {
    color: #98a6bc;
  }

  &:focus {
    border-bottom-color: #66d587;
  }
`;

export const SearchIcon = styled(SvgImage).attrs({
  source: searchIcon,
})`
  position: absolute;
  top: 8px;
  right: 0;
  width: 16px;
  height: 16px;
  color: #98a6bc;
`;
