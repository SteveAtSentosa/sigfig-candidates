import React from 'react';
import PropTypes from 'prop-types';

import { ObjectiveKeyResultList } from 'Models/Actions';

import { InlinePieChart, HelpPopover } from 'Components/Common';
import { InlineRangeLabel } from '../InlineRangeLabel/InlineRangeLabel';

import * as OwnComponents from './ObjectiveItemKeyResultList.Components';

class ObjectiveItemKeyResultList extends React.PureComponent {
  static propTypes = {
    items: ObjectiveKeyResultList,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    items: [],
  }

  calculatePercentage = (value, minValue, maxValue) => (value - minValue) / (maxValue - minValue);

  onChange = (item, index) => (value) => {
    const updatedItem = { ...item, value };

    const { onChange } = this.props;
    onChange && onChange(updatedItem, index);
  }

  renderItem = (item, index) => {
    const { onChange } = this.props;
    const { name, value, minValue, maxValue } = item;
    const percentage = this.calculatePercentage(value, minValue, maxValue);

    return (
      <OwnComponents.ListItem key={index}>
        <OwnComponents.TitlePopOver>
          <HelpPopover content={name}>
            <OwnComponents.Title>{ name }</OwnComponents.Title>
          </HelpPopover>
        </OwnComponents.TitlePopOver>

        <OwnComponents.InlineRangeLabelWrapper>
          <InlineRangeLabel
            item={item}
            onChange={onChange && this.onChange(item, index)}
          />
        </OwnComponents.InlineRangeLabelWrapper>

        <OwnComponents.PercentageWrapper>
          <InlinePieChart percentage={percentage} />
          <OwnComponents.Percentage>{ (percentage * 100).toFixed(0) }%</OwnComponents.Percentage>
        </OwnComponents.PercentageWrapper>
      </OwnComponents.ListItem>
    );
  }

  render() {
    const { items } = this.props;

    return (
      <OwnComponents.Container>
        {
          items.map((item, index) => this.renderItem(item, index))
        }
      </OwnComponents.Container>
    );
  }
}

export { ObjectiveItemKeyResultList };
