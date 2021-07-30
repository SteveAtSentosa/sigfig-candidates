import styled from 'styled-components';
import { Button, SvgImage } from 'Components/Common';
import React from 'react';
import PropTypes from 'prop-types';
import { downChevronIcon, upArrow } from 'images/icons/common';

export const Container = styled.div`
  flex-grow: 1;
`;

export const SegmentRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  font-size: 14px;
`;

export const ButtonGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  width: 76px;
`;

const DateSegmentContainer = styled.div`
  flex-grow: 1;
  margin-right: 15px;
  display: flex;
  justify-content: space-between;
  background: #f9fafc;
  border: 1px solid #c9d0db;
  box-sizing: border-box;
  border-radius: 5px;
`;

const DateSegmentName = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  font-weight: 600;
  font-size: 12px;
  color: #707E93;
`;

const DateSegmentButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40px;
  height: 100%;
`;

const ChevronButton = styled(Button)`
  height: 50%;
  color: #98a6bc;
   &:hover {
    color: #354a60;
  }

  &:focus {
    color: #66d587;
  }

  &:disabled {
    cursor: unset;
  }
`;

const Icon = styled(SvgImage)`
  svg {
    width: 11px;
  }
`;

export const DateSegment = ({ name, disabledUp, disabledDown, noButtons, onClickUp, onClickDown }) => (
  <DateSegmentContainer>
    <DateSegmentName>{name}</DateSegmentName>
    {!noButtons &&
    <DateSegmentButtonsContainer>
      <ChevronButton disabled={disabledUp} onClick={onClickUp}>
        {!disabledUp && <Icon source={upArrow} />}
      </ChevronButton>
      <ChevronButton disabled={disabledDown} onClick={onClickDown}>
        {!disabledDown && <Icon source={downChevronIcon} />}
      </ChevronButton>
    </DateSegmentButtonsContainer>
    }
  </DateSegmentContainer>
);

DateSegment.propTypes = {
  name: PropTypes.string.isRequired,
  disabledUp: PropTypes.bool,
  disabledDown: PropTypes.bool,
  noButtons: PropTypes.bool,
  onClickUp: PropTypes.func.isRequired,
  onClickDown: PropTypes.func.isRequired,
};
