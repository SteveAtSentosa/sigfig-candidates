import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { choiceAttributeIcon, numberAttributeIcon, dateAttributeIcon } from 'images/settings';

import { AttributeTypes } from 'Constants/Attributes';
import { SvgImage, Button } from 'Components/Common';

const AttributeListItemContainer = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 13px 20px;
  border: 0;
  border-bottom: 1px solid #c9d0db;
  border-left: 3px solid ${props => (props.selected ? '#66d587' : 'transparent')};
  background-color: ${props => (props.selected ? '#fafbff' : 'white')};
  cursor: pointer;

  &:last-child{
    border-bottom: unset;
  }

  &:hover {
    background-color: #fafbff;
  }
`;

const AttributeListItemName = styled.span`
  margin-left: 20px;
  color: #707e93;
  font-weight: 500;
  font-size: 14px;
  text-align: left;
  word-break: break-word;

  ${props => props.selected && `
  color: #354a60;
  font-weight: 600;
  `};
`;

const Icon = styled(SvgImage)`
  svg{
    width: 25px;
    height: 25px;

    ${props => !props.selected && `
      stroke: #98a6bc;`};
    }
`;

export const AttributeListItem = ({ name, type, selected, onClick }) => {
  const icon = {
    [AttributeTypes.Choices]: choiceAttributeIcon,
    [AttributeTypes.Dates]: dateAttributeIcon,
    [AttributeTypes.Numbers]: numberAttributeIcon,
  }[type];

  return (
    <AttributeListItemContainer
      selected={selected}
      onClick={onClick}
    >
      <Icon source={icon} selected={selected} />

      <AttributeListItemName selected={selected}>
        {name}
      </AttributeListItemName>
    </AttributeListItemContainer>
  );
};

const AttributeTypesKeys = Object.keys(AttributeTypes).map(key => AttributeTypes[key]);

AttributeListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(AttributeTypesKeys).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

AttributeListItem.defaultProps = {
  selected: false,
};
