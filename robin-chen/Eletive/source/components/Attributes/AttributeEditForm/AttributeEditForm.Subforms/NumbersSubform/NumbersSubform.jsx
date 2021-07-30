import produce from 'immer';
import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import * as AttributeModels from 'Models/Attributes';
import { greenPlusIcon, minusIcon } from 'images/icons/common';
import { InlineButton, InputNumber, ListBlock } from 'Components/Common';

import * as Own from './NumbersSubform.Components';

import { convertSegmentsToPoints, convertPointsToSegments } from './NumbersSubform.Utils';

@withTranslation('Attributes/NumbersSubform')
class NumbersSubform extends React.PureComponent {
  static propTypes = {
    attribute: AttributeModels.Attribute,
    onSegmentListUpdate: PropTypes.func,
  }

  state = {
    points: [],
    invalidPoints: [],
    attribute: {},
  }

  componentDidMount() {
    const { attribute } = this.props;

    this.setState({
      attribute,
      points: convertSegmentsToPoints(attribute.segments),
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { attribute: currentAttribute } = state;
    const { attribute: nextAttribute } = props;

    if (currentAttribute.id !== nextAttribute.id) {
      return {
        attribute: nextAttribute,
        points: convertSegmentsToPoints(nextAttribute.segments),
      };
    }

    return null;
  }

  handlePointValueChange = (point, index) => (value) => {
    const { points } = this.state;

    this.setState({
      points: produce(points, (draft) => {
        draft.splice(index, 1, value);
      }),
    }, () => {
      const isPointsValid = this.validatePoints();
      this.updateSegmentList(isPointsValid);
    });
  }

  handleAddButtonClick = (pointAsString, index) => () => {
    const { points } = this.state;

    const pointAsNumber = parseFloat(pointAsString);

    const nextPointAsString = points[index + 1];
    const nextPointAsNumber = parseFloat(nextPointAsString);

    let value = pointAsNumber + (nextPointAsNumber - pointAsNumber) / 2;
    value = value || (pointAsNumber + 100);

    let updatedPoints = produce(points, (draft) => {
      draft.splice(index + 1, 0, value.toString());
    });

    if (index === points.length - 1) {
      updatedPoints = [...points, value];
    }

    this.setState({
      points: updatedPoints,
    }, () => {
      const isPointsValid = this.validatePoints();
      this.updateSegmentList(isPointsValid);
    });
  }

  handleRemoveButtonClick = (point, index) => () => {
    const { points } = this.state;

    this.setState({
      points: produce(points, (draft) => {
        draft.splice(index, 1);
      }),
    }, () => {
      const isPointsValid = this.validatePoints();
      this.updateSegmentList(isPointsValid);
    });
  }

  validatePoints() {
    const { points } = this.state;

    const invalidPoints = [];

    points.forEach((point, index) => {
      const pointAsNumber = parseFloat(point);

      const previousPointAsString = points[index - 1];
      const previousPointAsNumber = parseFloat(previousPointAsString);

      if (previousPointAsNumber && pointAsNumber <= previousPointAsNumber) {
        invalidPoints.push(index);
      }
    });

    this.setState({ invalidPoints });
    return invalidPoints.length === 0;
  }

  updateSegmentList(isPointsValid) {
    const { points } = this.state;
    const { onSegmentListUpdate } = this.props;

    const segments = convertPointsToSegments(points);
    onSegmentListUpdate && onSegmentListUpdate(segments, isPointsValid);
  }

  isPointValid(index) {
    const { invalidPoints } = this.state;
    return invalidPoints.includes(index) === false;
  }

  shouldRenderRemoveButton(segment, index) {
    return index !== 0;
  }

  render() {
    const { i18n } = this.props;
    const { points } = this.state;

    return (
      <Own.Container>
        <ListBlock>
          {
            points.map((point, index) => (
              <Own.NumberRow key={index}>
                <Own.NumberValue>
                  {
                    index === 0 ?
                      i18n('Labels.Under') :
                      points[index - 1]
                  }
                </Own.NumberValue>

                <Own.RangeIcon />

                <Own.InputNumberWrapper>
                  {/* TODO: add validation - this.isPointValid(index) */}
                  <InputNumber
                    value={Number(point)}
                    onChange={this.handlePointValueChange(point, index)}
                  />
                </Own.InputNumberWrapper>

                <Own.ControlButtonContainer>
                  <InlineButton
                    icon={greenPlusIcon}
                    onClick={this.handleAddButtonClick(point, index)}
                  />

                  {
                    this.shouldRenderRemoveButton(point, index) &&
                    <InlineButton
                      icon={minusIcon}
                      onClick={this.handleRemoveButtonClick(point, index)}
                    />
                  }
                </Own.ControlButtonContainer>

              </Own.NumberRow>
            ))
          }

          <Own.NumberRow>
            <Own.NumberValue>
              {points[points.length - 1]}
            </Own.NumberValue>

            <Own.RangeIcon />

            <Own.InputNumberWrapper>
              <Own.NumberValue>{i18n('Labels.Over')}</Own.NumberValue>
            </Own.InputNumberWrapper>

          </Own.NumberRow>
        </ListBlock>
      </Own.Container>
    );
  }
}

export { NumbersSubform };
