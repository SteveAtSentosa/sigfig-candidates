import React from 'react';
import styled from 'styled-components';
import { Button } from 'Components/Common';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Label = styled.div`
  padding: 6px;
  color: #707e93;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: .1em;
  cursor: pointer;

  &:hover {
    border-radius: 5px;
    color: #354a60;
    background-color: #e5eaf1;
  }

  @media screen and (max-width: 768px) {
    text-align: center;
  }
`;

const CommonButton = styled(Button)`
  width: 47px;
  height: 30px;
  margin-left: 8px;
  border: unset;
  border-radius: 5px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .02em;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-left: unset;
    margin-top: 6px;
  }
`;

export const EditButton = styled(CommonButton)`
  background-color: #98a6bc;
  box-shadow: 0px 5px 19px rgba(53, 74, 96, .15);
`;

export const SaveButton = styled(CommonButton)`
  background: linear-gradient(304.82deg, #74f4a1 -2.49%, #62d382 45.01%);
  box-shadow: 0px 5px 19px rgba(102, 213, 135, 0.2);
`;

const EditFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UnitLabel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f68e7e;
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
`;

const Input = styled.input`
  width: 89px;
  height: 30px;
  padding: ${({ half }) => (half ? '0 5px 0 45px' : '0 14px')};
  border: 1px solid #98a6bC;
  border-radius: 5px;
  color: #707e93;
  background-color: white;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

export const EditField = ({ value, unit, onChange, onKeyPress, onKeyUp }) => (
  <EditFieldWrapper>
    {
      unit &&
      <UnitLabel>{ unit }</UnitLabel>
    }
    <Input
      value={value}
      half={unit}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
    />
  </EditFieldWrapper>
);

export const PopoverContent = styled.div`
  display: flex;
  position: relative;
`;

export const PopoverSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8px;

  span {
    text-align: right;
  }

  &:last-child {
    margin-right: 0;

    span {
      font-weight: 600;
      text-align: left;
    }
  }
`;

export const PopoverLabel = styled.span`
  color: #707e93;
  font-size: 10px;
  line-height: 15px;
`;
