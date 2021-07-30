import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #c9d0db80;
  color: #707e93;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: .1em;

  &:last-of-type {
    border-bottom: unset;
  }

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: 22px;
    padding: 8px 0;
    border-bottom: unset;
  }
`;

export const TitlePopOver = styled.div`
  flex-grow: 1;
  padding-right: 50px;
  font-weight: 500;
  letter-spacing: .05em;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    flex-grow: unset;
    width: unset;
    padding-right: 0;
  }
`;

export const Title = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const InlineRangeLabelWrapper = styled.div`
  flex-shrink: 0;
  width: 185px;
  margin-right: 6px;

  @media screen and (max-width: 768px) {
    display: block;
    width: auto;
    margin: 0 auto;
  }
`;

export const PercentageWrapper = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    width: auto;
    margin-left: auto;
  }
`;

export const Percentage = styled.div`
  margin-left: 12px;
`;
