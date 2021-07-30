import styled from 'styled-components';

export const HeaderWrapper = styled.div``;

export const Content = styled.div`
  padding: 20px 66px 20px 24px;

  @media screen and (max-width: 1024px) {
    padding: 16px 16px 20px;
  }
`;

export const CommentText = styled.div`
  margin-left: 42px;
  margin-top: 16px;
  padding-top: 16px;
  padding-left: 8px;
  border-top: 1px solid #c9d0db;
  color: #707e93;
  font-size: 14px;
  line-height: 23px;
  letter-spacing: .03em;

  @media screen and (max-width: 1024px) {
    margin-left: unset;
    padding-left: unset;
  }
`;
