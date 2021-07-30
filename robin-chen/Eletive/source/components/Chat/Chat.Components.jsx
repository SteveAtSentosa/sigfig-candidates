import styled from 'styled-components';

export const Container = styled.div``;

export const ContentContainer = styled.div`
  padding: 0 36px 36px 36px;
`;

export const TitleContainer = styled.div`
  padding: 20px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #c9d0db;
`;

// NOTE: the same parts as in CommentHeader
export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 43px;
  padding: 0 24px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #e5eaf1;
`;

export const HeaderInnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const DesktopOnly = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const TotalCount = styled.div`
  display: flex;
  margin-right: 6px;
  color: #707e93;
  font-size: 12px;
  font-weight: 500;
  white-space: pre;

  @media screen and (max-width: 768px) {
    margin-right: 2px;
  }
`;

export const UnreadCount = styled.div`
  display: flex;
  color: #354a60;
  font-size: 12px;
  font-weight: 500;
  white-space: pre;
`;
