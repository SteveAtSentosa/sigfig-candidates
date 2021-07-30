import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Segments from 'Constants/Segments';
import * as AttributeModels from 'Models/Attributes';
import { filterOnIcon } from 'images/icons/common';
import { getHashCode } from 'utilities/common';

import { SegmentIcon } from 'Components/Attributes';
import { SvgImage } from 'Components/Common';

const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 5px 30px 5px 10px;
  font-size: 10px;
  border-radius: 3px;
  color: #354a60;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #f4f6fa;
  }
`;

const SegmentName = styled.span`
  margin-left: 10px;
  text-overflow: ellipsis;
`;

const SelectedStatus = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #c9d0db;

  ${props => props.selected && `
    background: #66d587;
    border-color: #66d587;
  `}
`;

const CheckIcon = styled(SvgImage).attrs({ source: filterOnIcon })`
  width: 6px;
  height: 6px;
  color: transparent;
  margin: auto;

  svg {
    width: 6px;
    height: 6px;
  }

  ${props => props.selected && `
    color: #ffffff;
  `}

  ${props => !props.selected && `
    &:hover {
      color: #c9d0db;
    }
  `}
`;

const getAttributeTypeIcon = (attributeType) => {
  switch (attributeType) {
    case 1: return 'calendar';
    case 2: return 'calculator';
    default: return '';
  }
};

export class SegmentListItem extends React.PureComponent {
  static propTypes = {
    segment: AttributeModels.ExtendedSegment,
    selected: PropTypes.bool,
    singleSelectionMode: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    selected: false,
    singleSelectionMode: false,
  }

  handleClick = () => {
    const { onClick, segment } = this.props;
    onClick && onClick(segment);
  }

  render() {
    const { segment, selected, singleSelectionMode } = this.props;
    const colorIndex = getHashCode(segment.name) % Object.keys(Segments.SegmentColors).length;

    return (
      <Container onClick={this.handleClick}>
        {segment.attribute.type === 0
          ? <SegmentIcon
            name={segment.name}
            color={Segments.SegmentColors[colorIndex + 1]}
          />
          : <SegmentIcon
            icon={getAttributeTypeIcon(segment.attribute.type)}
            color={Segments.SegmentColors[colorIndex + 1]}
          />
        }

        <SegmentName>{`${segment.name} (${segment.attribute.name})`}</SegmentName>

        {(!singleSelectionMode || selected) &&
        <SelectedStatus selected={selected}>
          <CheckIcon selected={selected} />
        </SelectedStatus>}
      </Container>
    );
  }
}
