import styled from 'styled-components';

import { rightChevronIcon } from 'images/icons/common';
import { SvgImage } from 'Components/Common';

export const Container = styled.div`
  margin: 4px 5px;
  border: 1px solid #c9d0db;
  border-radius: 3px;
  overflow: hidden;
`;

export const TargetContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 27px;
  font-size: 10px;
  color: #707e93;
  background-color: #ffffff;
  border-bottom: 1px solid transparent;
  user-select: none;
  cursor: pointer;

  ${props => props.expanded && `
    border-bottom: 1px solid #c9d0db;
    border-radius: 3px 3px 0 0;
  `}

  &:hover {
    background-color: #e5eaf1;
  }
`;

export const SegmentName = styled.span`
  flex: 1 1;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SegmentStats = styled.div`
  margin-right: 8px;
  white-space: nowrap;
`;

export const SegmentCount = styled.span`
  margin-left: 7px;
`;

export const SelectedSegmentCount = styled.span`
  margin-left: 7px;
  font-weight: 600;
`;

export const SelectAllSegmentsButton = styled.button`
  background: #66d587;
  color: #ffffff;
  margin-left: auto;
  border-radius: 2px;
  padding: 5px;
  min-width: 70px;
  font-weight: 500;
  font-size: 9px;
  line-height: 10px;
  cursor: pointer;
  border: none;

  ${props => props.selected && `
    background: #f68e7e;
  `}

  &:hover {
    opacity: .7;
  }
`;

export const CollapseIcon = styled(SvgImage).attrs({
  source: rightChevronIcon,
})`
  color: #5c7080;
  margin-left: 10px;
  width: 10px;
  height: 10px;

  ${props => props.revealed && `
    transform: rotateZ(90deg);
  `}
`;

export const CollapseContainer = styled.div`
  padding: 6px 3px;
  border-radius: 0 0 3px 3px;
  ${props => !props.open && `
    display: none;
  `}
`;
