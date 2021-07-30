import styled from 'styled-components';

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ExpandButtonContainer = styled.div`
  margin-right: 10px;
`;

export const SegmentRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
`;

export const SegmentName = styled.span`
  margin-left: 20px;
`;

export const SegmentTree = styled.div`
  margin-top: 20px;
`;

export const ChildSegmentsCountLabel = styled.span`
  margin-left: 10px;
  color: #98a6bc;
`;

export const AddHierarchyDialogTitle = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #244986;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);

  ${props => props.expanded && `
    border-bottom: 1px solid #cccccc;
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
  `}
`;

export const ActionContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  `;
