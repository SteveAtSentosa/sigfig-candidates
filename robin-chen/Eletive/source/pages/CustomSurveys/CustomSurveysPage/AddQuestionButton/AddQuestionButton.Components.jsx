import styled from 'styled-components';
import { SvgImage, Button } from 'Components/Common';


export const QuestionTypeIcon = styled(SvgImage)`
  svg {
    width: 48px;
    height: 48px;
  }
`;

export const QuestionTypeTitle = styled.span`
  color: #707e93;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`;

export const QuestionTypeDescription = styled.span`
  display: block;
  max-width: 158px;
  margin-top: 8px;
  font-size: 14px;
  color: #98a6bc;
`;

export const QuestionTypeButtonContent = styled.div`
  margin-top: -3px;
`;

export const QuestionTypeButton = styled(Button).attrs({ 'data-cy': 'QuestionTypeButton' })`
  display: flex;
  width: 100%;
  min-height: 60px;
  align-self: flex-start;
  padding: 15px;
  border: 0;
  background-color: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f4f6fa;

    ${QuestionTypeTitle} {
      color: #354a60;
    }
  }

  ${QuestionTypeButtonContent} {
    margin-left: 15px;
  }
`;

export const ContentRow = styled.div`
  display: flex;

  ${QuestionTypeButton}:last-child {
    border-left: 1px solid #eaecf0;

    @media screen and (max-width: 768px) {
      border-left: 1px solid transparent;
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  min-width: 480px;
  padding: 20px;

  ${ContentRow}:last-child {
    border-top: 1px solid #eaecf0;

    @media screen and (max-width: 768px) {
      border-top: 1px solid transparent;
    }
  }
`;
