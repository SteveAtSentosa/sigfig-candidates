import produce from 'immer';
import React from 'react';
import PropTypes from 'prop-types';

import { greenPlusIcon, minusIcon } from 'images/icons/common';
import { InlineButton, ListBlock } from 'Components/Common';
import * as AttributeModels from 'Models/Attributes';

import * as Own from './DatesSubform.Components';

const OneMonth = 2629800;

class DatesSubform extends React.PureComponent {
  static propTypes = {
    attribute: AttributeModels.Attribute,
    onSegmentChange: PropTypes.func,
  };

  state = {
    segments: [],
    attributeId: null,
  };

  componentDidMount() {
    const { attribute } = this.props;

    this.setState({
      attributeId: attribute.id,
      segments: attribute.segments,
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { attributeId: currentAttributeId } = state;
    const { attribute: nextAttribute } = props;

    if (currentAttributeId !== nextAttribute.id) {
      return {
        attributeId: nextAttribute.id,
        segments: [...nextAttribute.segments],
      };
    }
    return null;
  }

  handleChange = (rawValues) => {
    const { segments } = this.state;

    const segmentIndex = segments.findIndex((segment, index) => {
      if (!segment.valueUpTo || segment.valueUpTo === rawValues[index]) {
        return false;
      }
      const isNewCurrentSegmentLongerMonth = rawValues[index] - segment.value < OneMonth;
      const isNewNextSegmentLongerMonth = segments[index + 1].valueUpTo - rawValues[index] < OneMonth;
      return !(isNewCurrentSegmentLongerMonth
        || (segments[index + 1].valueUpTo !== null && isNewNextSegmentLongerMonth));
    });

    if (segmentIndex !== -1) {
      this.setState({
        segments: produce(segments, (draft) => {
          const segment = draft[segmentIndex];
          const nextSegment = draft[segmentIndex + 1];
          segment.valueUpTo = rawValues[segmentIndex];
          segment.name = this.nameSegment(segment);

          nextSegment.value = rawValues[segmentIndex];
          nextSegment.name = this.nameSegment(nextSegment);
        }),
      }, this.updateSegmentList);
    }
  };

  handleAdd = (segmentIndex) => {
    const { segments } = this.state;

    const segment = {};
    segment.value = segments[segmentIndex].valueUpTo;
    if (segments[segmentIndex + 1].valueUpTo) {
      segment.valueUpTo = segment.value + Math.round(
        (segments[segmentIndex + 1].valueUpTo - segments[segmentIndex + 1].value) / 2 / OneMonth,
      ) * OneMonth;
    } else {
      segment.valueUpTo = segment.value + Math.round(
        (segments[segmentIndex].valueUpTo - segments[segmentIndex].value) / 2 / OneMonth,
      ) * OneMonth;
    }

    const nextSegment = {
      ...segments[segmentIndex + 1],
      value: segment.valueUpTo,
    };

    segment.name = this.nameSegment(segment);
    nextSegment.name = this.nameSegment(nextSegment);

    this.setState({
      segments: produce(segments, (draft) => {
        draft.splice(segmentIndex + 1, 1, nextSegment);
        draft.splice(segmentIndex + 1, 0, segment);
      }),
    }, this.updateSegmentList);
  };

  handleRemove = (segmentIndex) => {
    const { segments } = this.state;
    this.setState({
      segments: produce(segments, (draft) => {
        const prevSegment = draft[segmentIndex - 1];
        const nextSegment = draft[segmentIndex + 1];
        prevSegment.valueUpTo = nextSegment.value;
        prevSegment.name = this.nameSegment(prevSegment);
        nextSegment.name = this.nameSegment(nextSegment);
        draft.splice(segmentIndex, 1);
      }),
    }, this.updateSegmentList);
  };

  handleMove = (segmentIndex, value) => {
    const { segments } = this.state;

    this.setState({
      segments: produce(segments, (draft) => {
        const segment = draft[segmentIndex];
        const nextSegment = draft[segmentIndex + 1];
        segment.valueUpTo += value;
        nextSegment.value = segment.valueUpTo;
        segment.name = this.nameSegment(segment);
        nextSegment.name = this.nameSegment(nextSegment);
      }),
    }, this.updateSegmentList);
  };

  nameSegment = segment => `${this.getName(segment.value) || 'Below'} - ${this.getName(segment.valueUpTo) || 'Above'}`;

  getName = (value) => {
    if (value === null) {
      return null;
    }

    const years = Math.floor(value / (12 * OneMonth));
    const months = Math.round((value - years * 12 * OneMonth) / OneMonth);

    return `Year: ${years} Month: ${months}`;
  };

  isDisabledAddSegment = (segmentIndex) => {
    const { segments } = this.state;
    const nextSegment = segments[segmentIndex + 1];
    if (!nextSegment) {
      return true;
    }
    if (!nextSegment.valueUpTo) {
      return false;
    }
    const isNextSegmentCanBeSplit = nextSegment.valueUpTo - nextSegment.value >= OneMonth * 2;
    return !isNextSegmentCanBeSplit;
  };

  isDisabledLeftMove = (segmentIndex) => {
    const { segments } = this.state;
    const segment = segments[segmentIndex];
    const isSegmentOneMonthLong = segment.valueUpTo - segment.value <= OneMonth;
    return segmentIndex === segments.length - 1 || isSegmentOneMonthLong;
  };

  isDisabledRightMove = (segmentIndex) => {
    const { segments } = this.state;
    const nextSegment = segments[segmentIndex + 1];
    if (!nextSegment) {
      return true;
    }
    if (!nextSegment.valueUpTo) {
      return false;
    }
    const isNextSegmentLongerOneMonth = nextSegment.valueUpTo - nextSegment.value > OneMonth;
    return !isNextSegmentLongerOneMonth;
  };

  updateSegmentList() {
    const { onSegmentChange } = this.props;
    const { segments } = this.state;
    onSegmentChange(segments);
  }

  render() {
    const { segments } = this.state;

    return (
      <Own.Container>
        <ListBlock>
          {
            segments && segments.map((segment, index) => (
              <Own.SegmentRowContainer key={segment.name}>
                <Own.DateSegment
                  name={segment.name}
                  noButtons={index === segments.length - 1}
                  disabledUp={this.isDisabledLeftMove(index)}
                  disabledDown={this.isDisabledRightMove(index)}
                  onClickUp={() => this.handleMove(index, -OneMonth)}
                  onClickDown={() => this.handleMove(index, OneMonth)}
                />
                <Own.ButtonGroup>
                  {index !== segments.length - 1 &&
                  <>
                    <InlineButton
                      icon={greenPlusIcon}
                      disabled={this.isDisabledAddSegment(index)}
                      onClick={() => this.handleAdd(index)}
                    />

                    {index !== 0 &&
                    <InlineButton
                      icon={minusIcon}
                      disabled={!index || index === segments.length - 1}
                      onClick={() => this.handleRemove(index)}
                    />
                    }
                  </>
                  }
                </Own.ButtonGroup>
              </Own.SegmentRowContainer>
            ))
          }
        </ListBlock>
      </Own.Container>
    );
  }
}

export { DatesSubform };
