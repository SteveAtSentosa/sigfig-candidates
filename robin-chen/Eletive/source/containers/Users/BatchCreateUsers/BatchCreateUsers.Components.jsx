import React from 'react';
import styled from 'styled-components';

import { downloadIcon, uploadIcon } from 'images/icons/common';
import { massEditUserIcon } from 'images/settings';
import {
  SvgImage,
  MarkdownContent,
  SectionTitle,
  SubSectionTitle,
  InlineButton,
  ProgressBar,
} from 'Components/Common';

export const IntroductionContainer = styled.div`
  display: flex;

  @media screen and (max-width: 768px) {
    flex-direction: column;

    > :last-child {
      margin: 0 0 0 auto;
    }
  }
`;

export const MassEditIcon = styled(SvgImage).attrs({ source: massEditUserIcon })`
  width: 124px;
  height: 124px;
  margin: 24px;

  svg {
    width: 124px;
    height: 124px;
  }
`;

export const Container = styled.div`
  display: flex;
  margin-top: 24px;

  @media screen and (max-width: 1024px) {
    flex-direction: column;

    > *:not(:first-child) {
      margin-top: 24px;
    }
  }
`;

export const AllStepContainer = styled.div`

  ${SectionTitle} {
     margin-top: 40px;
  }
`;
export const StepContainer = styled.div`
  flex: 1;
  &:first-child {
    margin-right: 24px;
  }
`;

export const DownloadButton = styled(InlineButton).attrs({ icon: downloadIcon })`
  padding: 0;

  i {
    width: 24px;
    height: 24px;
  }
`;

const Icon = styled(SvgImage)`
 align-self: flex-start;

 width: 25px;
 svg {
   width: 25px;
 }
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 22px 22px 16px 22px;
  border: 1px solid #C9D0DB;
  border-radius: 5px;

  &:first-child {
    margin-right: 24px;
  }

  p {
    margin: 5px 0 0 0;
    font-size: 12px;
    line-height: 20px;
  }

  @media screen and (max-width: 1024px) {
    &:first-child {
      margin-right: 0;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 17px;
`;

export const FieldDescription = ({ icon, title, children }) => (
  <DescriptionContainer>
    <Icon source={icon} />
    <Content>
      <SubSectionTitle title={title} />
      <MarkdownContent source={children} />
    </Content>
  </DescriptionContainer>
);

export const UploadIcon = styled(SvgImage).attrs({ source: uploadIcon })`
  width: 40px;
  height: 40px;
`;

export const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  padding: 30px;
  background: #ffffff;
  border: 1px dashed #98a6bc;
  box-sizing: border-box;
  border-radius: 5px;


  ${UploadIcon} {
    display: inline-block;
  }
`;

export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  ${ProgressBar} {
    margin-top: 26px;
  }
`;

const ResultIcon = styled(SvgImage)`
  svg {
    width: 80px;
    height: 80px;
  }
`;
const ResultSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-width: 110px;
  font-style: normal;
  font-weight: 600;

  span {
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.03em;
    color: #244986;
  }

  span {
    font-size: 14px;
    line-height: 21px;
    color: #707e93;
  }
`;

export const ResultDialogCard = ({ rows, label, icon }) => (
  <ResultSummaryContainer>
    <ResultIcon source={icon} />
    <strong>{label}</strong>
    <span>{rows} rows</span>
  </ResultSummaryContainer>
);

export const UploadResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 706px;
`;

export const ModalTitle = styled.h6`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.03em;
  color: #244986;
`;

export const UploadResultSummary = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

export const UploadResult = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 38px;
  border-top: 1px solid #c9d0dbf0;
  padding: 38px 20px 20px 20px;

  span {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #354a60;
  }
`;
