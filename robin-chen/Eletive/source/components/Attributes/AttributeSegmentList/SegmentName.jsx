import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { dateAttributeIcon, numberAttributeIcon } from 'images/settings';
import { AttributeTypes } from 'Constants/Attributes';
import { SegmentIcon } from 'Components/Attributes';
import * as AttributeModels from 'Models/Attributes';

const SegmentNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SegmentNameText = styled.span`
  margin-left: 10px;
`;

export class SegmentName extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    attribute: AttributeModels.Attribute,
  }

  get attributeTypeIcon() {
    const { attribute } = this.props;

    switch (attribute.type) {
      case AttributeTypes.Dates: return dateAttributeIcon;
      case AttributeTypes.Numbers: return numberAttributeIcon;
      default: return '';
    }
  }

  render() {
    const { name, attribute } = this.props;

    return (
      <SegmentNameContainer>
        {
          attribute.type === AttributeTypes.Choices ?
            <SegmentIcon name={name} /> :
            <SegmentIcon icon={this.attributeTypeIcon} />
        }
        <SegmentNameText>{name}</SegmentNameText>
      </SegmentNameContainer>
    );
  }
}
