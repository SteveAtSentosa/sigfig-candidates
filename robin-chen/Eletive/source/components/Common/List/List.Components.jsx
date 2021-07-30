import styled from 'styled-components';

import { SvgImage } from 'Components/Common';
import { searchIcon } from 'images/icons/common';

export const Container = styled.div`
  min-height: 0;
  max-height: 45vh;
  overflow-y: auto;
`;

export const SearchIcon = styled(SvgImage).attrs({
  source: searchIcon,
})`
  position: absolute;
  right: 15px;
  top: 50%;
  display: block;
  height: 15px;
  width: 15px;
  transform: translateY(-50%);
  color: #354a60;
  cursor: pointer;
`;

export const InputContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

export const NoResultsContainer = styled.div`
  padding: 10px;
  color: #98a6bc;
  font-weight: 600;
  cursor: default;
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 130px;
  margin-top: 2px;
  padding: 5px 10px;
  border-radius: 8px;
  color: #98a6bc;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  line-height: 25px;

  &:hover {
    background-color: #f4f6fa;
    color: #354a60;
  }

  ${props => props.isSelected && `
    background-color: #f4f6fa;
    color: #354a60;
  `}
`;

export const ItemIcon = styled(SvgImage)`
  margin-right: 9px;
  line-height: 0;
  svg{
    width: 13px;
    max-height: 13px;
  }
`;
