import React from 'react';
import styled from 'styled-components';
import { SvgImage, Card, InlineButton } from 'Components/Common';

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  padding: 0 24px;
  border-radius: 5px;
  background: linear-gradient(90deg, #97a7ff 0%, #6774e3 100%);
`;

export const HeaderCell = styled.div`
  display: flex;
  flex-shrink: 0;
`;

export const HeaderCellContent = ({ sortable, children, onClick }) => (
  sortable ?
    <InlineButton onClick={onClick}>{ children }</InlineButton>
    :
    <>{ children }</>
);

export const ColumnTitle = styled.div`
  color: white;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .05em;
`;

export const SortIcons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
  margin-top: -14px;
`;

export const SortIcon = styled(SvgImage)`
  width: 6.8px;
  height: 4px;
  line-height: 1;

  &:nth-child(2) {
    margin-top: 4px;
  }

  ${props => props.active && `
    opacity: 0.5;
  `}

  &:hover {
    opacity: 0.5;
  }

  &:focus {
    width: 8px;
    height: 4.5px;
  }
`;

export const RowWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 10px 24px;
`;

const RowCell = styled.div`
  display: flex;
  flex-shrink: 0;
  padding-left: 12px;
  color: #707e93;
  font-size: 14px;
  font-weight: 500;

  &:first-child {
    padding-left: 0;
  }
`;

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px 0;

  ${MobileRow}:last-child {
    margin-bottom: 0;
  }
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const MobileCellContainer = styled.div`
  flex-grow: 1;
  text-align: left;
`;

const MobileTitle = styled.div`
  margin-bottom: 10px;
  color: #98a6bc;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .05em;
`;

const MobileCellData = styled.div`
  display: flex;
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
`;

const MobileCell = ({ title, value }) => (
  <MobileCellContainer>
    <MobileTitle>{title}</MobileTitle>
    <MobileCellData>{value}</MobileCellData>
  </MobileCellContainer>
);

export const Commons = {
  RowCell,
  MobileContainer,
  MobileHeader,
  MobileRow,
  MobileCell,
  RowWrapper,
};
