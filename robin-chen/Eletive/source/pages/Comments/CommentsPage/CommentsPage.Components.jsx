import styled from 'styled-components';

import { SvgImage } from 'Components/Common';
import { noComment } from 'images/comments';

export const NoCommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const NoCommentIcon = styled(SvgImage).attrs({
  source: noComment,
})`
  width: 100px;
  height: 100px;
`;

export const NoCommentText = styled.p`
  margin-bottom: 0;
  color: #354a60;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  white-space: nowrap;
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 1024px) {
    margin-bottom: 16px;
  }
`;

export const MatchingCommentText = styled.p`
  margin-bottom: 0;
  color: #707e93;
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  margin-right: 30px;
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchBoxContainer = styled.div`
  width: 140px;
  margin-left: 16px;
`;

export const SortByContainer = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  margin-right: 16px;
  font-size: 12px;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    width: 100%;

    & > * {
      margin-bottom: 10px;
    }
  }
`;

export const DesktopOnly = styled.div`
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  @media screen and (min-width: 1025px) {
    display: none;
  }
`;
