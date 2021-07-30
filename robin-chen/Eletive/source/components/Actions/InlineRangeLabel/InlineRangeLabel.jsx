import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { ObjectiveKeyResult } from 'Models/Actions';
import { withTranslation } from 'utilities/decorators';
import { Actions, Currencies } from 'Constants';

import { SingleSelect, HelpPopover } from 'Components/Common';
import * as OwnComponents from './InlineRangeLabel.Components';

const LabelStatus = {
  View: 0,
  PreEdit: 1,
  Editing: 2,
};

@withTranslation('InlineRangeLabel')
class InlineRangeLabel extends React.PureComponent {
  static propTypes = {
    item: ObjectiveKeyResult,
    onChange: PropTypes.func,
  }

  binaryValues = [];

  constructor(props) {
    super(props);

    const { item: { value }, i18n } = props;

    this.state = {
      currentValue: value,
      currentStatus: LabelStatus.View,
    };

    this.binaryValues = [i18n('NotComplete.Text'), i18n('Complete.Text')];
  }

  get currencyUnit() {
    const { item: { currency } } = this.props;
    const currencyItem = Currencies.find(item => item.currency === currency);

    return currencyItem ? currencyItem.unit : '';
  }

  get rangeText() {
    const { item: { type, maxValue } } = this.props;
    const { currentValue } = this.state;

    if (type === Actions.KeyResultTypes.Percent) {
      return `${currentValue}% - ${maxValue}%`;
    }

    if (type === Actions.KeyResultTypes.Currency) {
      return `${currentValue}${this.currencyUnit} - ${maxValue}${this.currencyUnit}`;
    }

    if (type === Actions.KeyResultTypes.Binary) {
      return this.binaryValues[currentValue];
    }

    return `${currentValue} - ${maxValue}`;
  }

  handleEditClick = () => {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    this.setState({
      currentStatus: LabelStatus.Editing,
    });
  }

  handleSaveClick = () => {
    const { onChange } = this.props;
    const { currentValue } = this.state;

    onChange && onChange(currentValue);

    this.setState({
      currentStatus: LabelStatus.View,
    });
  }

  handleChangeCurrentValue = ({ target }) => {
    const { value } = target;

    if (value[0] === '-') {
      this.setState({ currentValue: value });
    }

    if (value[value.length - 1] === '.' || value.length === 0) {
      this.setState({ currentValue: value });
      return;
    }

    const currentValue = Number(value);
    if (_.isNaN(currentValue)) {
      return;
    }

    this.setState({ currentValue });
  }

  handleChangeCurrentSelection = (selection) => {
    this.setState({
      currentValue: selection === this.binaryValues[0] ? 0 : 1,
    });
  }

  handleMouseEnter = () => {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    this.setState({
      currentStatus: LabelStatus.PreEdit,
    });
  }

  handleMouseLeave = () => {
    this.setState({
      currentStatus: LabelStatus.View,
    });
  }

  handleEscapeCancel = ({ key }) => {
    if (key === 'Escape') {
      const { item: { value } } = this.props;

      this.setState({
        currentValue: value,
        currentStatus: LabelStatus.View,
      });
    }
  }

  handleEnterSubmit = ({ key }) => {
    if (key === 'Enter') {
      this.handleSaveClick();
    }
  }

  renderHelpPopoverContent = () => {
    const { item: { type, maxValue, minValue } } = this.props;
    const { currentValue: current } = this.state;

    if (type === Actions.KeyResultTypes.Binary) {
      return <OwnComponents.PopoverLabel>{ this.binaryValues[current] }</OwnComponents.PopoverLabel>;
    }

    let startValue = '';
    let currentValue = '';
    let targetValue = '';

    if (type === Actions.KeyResultTypes.Currency) {
      startValue = `${minValue}${this.currencyUnit}`;
      currentValue = `${current}${this.currencyUnit}`;
      targetValue = `${maxValue}${this.currencyUnit}`;
    } else if (type === Actions.KeyResultTypes.Percent) {
      startValue = `${minValue}%`;
      currentValue = `${current}%`;
      targetValue = `${maxValue}%`;
    } else if (type === Actions.KeyResultTypes.Number) {
      startValue = minValue;
      currentValue = current;
      targetValue = maxValue;
    }

    return (
      <OwnComponents.PopoverContent>
        <OwnComponents.PopoverSideContainer>
          <OwnComponents.PopoverLabel>Start: </OwnComponents.PopoverLabel>
          <OwnComponents.PopoverLabel>Current: </OwnComponents.PopoverLabel>
          <OwnComponents.PopoverLabel>Target: </OwnComponents.PopoverLabel>
        </OwnComponents.PopoverSideContainer>
        <OwnComponents.PopoverSideContainer>
          <OwnComponents.PopoverLabel>{ startValue }</OwnComponents.PopoverLabel>
          <OwnComponents.PopoverLabel>{ currentValue }</OwnComponents.PopoverLabel>
          <OwnComponents.PopoverLabel>{ targetValue }</OwnComponents.PopoverLabel>
        </OwnComponents.PopoverSideContainer>
      </OwnComponents.PopoverContent>
    );
  }

  renderViewInlineRangeLabel = () => {
    const { currentStatus } = this.state;

    return (
      <OwnComponents.Container onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <HelpPopover content={this.renderHelpPopoverContent()}>
          <OwnComponents.Label onClick={this.handleEditClick}>{ this.rangeText }</OwnComponents.Label>
        </HelpPopover>
        {
          currentStatus === LabelStatus.PreEdit &&
          <OwnComponents.EditButton onClick={this.handleEditClick}>Edit</OwnComponents.EditButton>
        }
      </OwnComponents.Container>
    );
  }

  renderEditingInlineRangeLabel = () => {
    const { item: { type } } = this.props;
    const { currentValue } = this.state;
    let unit = '';

    if (type === Actions.KeyResultTypes.Percent) {
      unit = '%';
    } else if (type === Actions.KeyResultTypes.Currency) {
      unit = this.currencyUnit;
    }

    return (
      <OwnComponents.Container>
        {
          type === Actions.KeyResultTypes.Binary ?
            <SingleSelect
              items={this.binaryValues}
              activeItem={this.binaryValues[currentValue]}
              itemRenderer={item => item}
              onItemSelect={this.handleChangeCurrentSelection}
              small
            />
            :
            <OwnComponents.EditField
              value={currentValue}
              unit={unit}
              onChange={this.handleChangeCurrentValue}
              onKeyPress={this.handleEnterSubmit}
              onKeyUp={this.handleEscapeCancel}
            />
        }
        <OwnComponents.SaveButton onClick={this.handleSaveClick}>Save</OwnComponents.SaveButton>
      </OwnComponents.Container>
    );
  }

  render() {
    const { currentStatus } = this.state;

    return (
      currentStatus === LabelStatus.Editing ?
        this.renderEditingInlineRangeLabel()
        :
        this.renderViewInlineRangeLabel()
    );
  }
}

export { InlineRangeLabel };
