import styled from 'styled-components';

export const CommentFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: -8px;

  @media only screen and (max-width: 768px) {
    width: 268px;
  }
`;

export const CommentFilterContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 24px 16px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    padding: 5px;
  }
`;

export const CommentDateRangeWrapper = styled.div`
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    margin-bottom: 0;
  }
`;

export const CommentDesktopFilterItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px 10px;
  border-left: 1px solid #c9d0db;
  color: #707e93;
  letter-spacing: 0.05em;

  &:first-child {
    padding-left: 0;
    border-left: 0;
  }
`;

export const CommentDesktopFilterTitle = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

export const CommentFilterFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background: #f4f6fa;
`;
