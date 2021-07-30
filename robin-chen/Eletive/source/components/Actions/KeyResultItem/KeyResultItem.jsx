import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

import { ObjectiveKeyResult } from 'Models/Actions';
import { withTranslation } from 'utilities/decorators';
import { InputGroup, CurrencySelect, ErrorPopover } from 'Components/Common';
import { Currencies, Actions } from 'Constants';

import { KeyResultTypesToggler } from './KeyResultTypesToggler/KeyResultTypesToggler';
import { InputPrefix } from './InputPrefix/InputPrefix';
import * as OwnComponents from './KeyResultItem.Components';

@withTranslation('KeyResultItem')
class KeyResultItem extends React.PureComponent {
  static propTypes = {
    keyResult: ObjectiveKeyResult,
    index: PropTypes.number,
    onChange: PropTypes.func,
  }

  state = {
    name: '',
    type: null,
    maxValue: 100,
    currency: null,
    errorMessages: {
      name: '',
    },
  }

  componentDidMount() {
    const { keyResult } = this.props;
    this.setState({ ...keyResult });
  }

  componentDidUpdate(prevProps) {
    const { keyResult } = this.props;
    const { keyResult: prevKeyResult } = prevProps;

    const { id, ...updateKeyResult } = keyResult;
    if (prevKeyResult.name !== updateKeyResult.name) {
      this.setState({ ...updateKeyResult });
    }
  }

  handleChangeKeyResultName = (value) => {
    const { keyResult } = this.props;
    const editedKeyResult = { ...keyResult, name: value };
    this.resetErrorMessages();
    this.handleChange(editedKeyResult);
  }

  handleSelectType = (type) => {
    const { keyResult } = this.props;
    const { KeyResultTypes } = Actions;

    let editedKeyResult = { ...keyResult, type, currency: null, minValue: 0, maxValue: 100 };

    if (type === KeyResultTypes.Currency) {
      const { currency } = Currencies[0];
      editedKeyResult = { ...editedKeyResult, currency };
    }

    if (type === KeyResultTypes.Binary) {
      editedKeyResult = { ...editedKeyResult, minValue: 0, maxValue: 1 };
    }

    this.handleChange(editedKeyResult);
  }

  handleChangeStartValue = (value) => {
    if (value.length === 0) {
      this.setState({ minValue: value });
      return;
    }

    if (value[0] === '-') {
      this.setState({ minValue: value });
    }

    if (value[value.length - 1] === '.') {
      this.setState({ minValue: value });
      return;
    }

    const minValue = Number(value);
    if (_.isNaN(minValue)) {
      return;
    }

    const { keyResult } = this.props;
    const editedKeyResult = { ...keyResult, minValue };
    this.handleChange(editedKeyResult);
  }

  handleChangeTargetValue = (value) => {
    if (value.length === 0) {
      this.setState({ maxValue: value });
      return;
    }

    if (value[0] === '-') {
      this.setState({ maxValue: value });
    }

    if (value[value.length - 1] === '.') {
      this.setState({ maxValue: value });
      return;
    }

    const maxValue = Number(value);
    if (_.isNaN(maxValue)) {
      return;
    }

    const { keyResult } = this.props;
    const editedKeyResult = { ...keyResult, maxValue };
    this.handleChange(editedKeyResult);
  }

  handleChangeCurrency = (currency) => {
    const { keyResult } = this.props;
    const editedKeyResult = { ...keyResult, currency };

    this.handleChange(editedKeyResult);
  }

  handleChange(editedKeyResult) {
    const { onChange, index } = this.props;

    const { id, ...objectiveKey } = editedKeyResult;

    this.setState({ ...objectiveKey });
    onChange(objectiveKey, index);
  }

  resetErrorMessages() {
    this.setState({
      errorMessages: { name: '' },
    });
  }

  validateForm() {
    const { i18n } = this.props;
    const { name } = this.state;
    const errorMessages = {
      name: '',
    };

    const trimmedName = name.trim();
    if (validator.isEmpty(trimmedName)) {
      errorMessages.name = i18n('ErrorMessages.EmptyKeyName');
    }

    this.setState({ errorMessages });
    return _.every(errorMessages, field => !field);
  }

  renderStartTargetValue() {
    const { i18n } = this.props;
    const { KeyResultTypes } = Actions;
    const { type, minValue, maxValue } = this.state;
    const isCurrency = type === KeyResultTypes.Currency;
    const width = isCurrency ? 31 : 48;

    return (
      <React.Fragment>
        <OwnComponents.InputWrapper width={width}>
          <InputPrefix label={i18n('StartValue')}>
            <InputGroup
              selectAllOnFocus
              name="start"
              type="text"
              value={minValue}
              onChange={this.handleChangeStartValue}
            />
          </InputPrefix>
        </OwnComponents.InputWrapper>

        <OwnComponents.InputWrapper width={width}>
          <InputPrefix label={i18n('TargetValue')}>
            <InputGroup
              selectAllOnFocus
              name="target"
              type="text"
              value={maxValue}
              onChange={this.handleChangeTargetValue}
            />
          </InputPrefix>
        </OwnComponents.InputWrapper>
      </React.Fragment>
    );
  }

  renderBottomInputsGroup() {
    const { KeyResultTypes } = Actions;
    const { type, currency } = this.state;

    if (type === KeyResultTypes.Percent || type === KeyResultTypes.Number) {
      return (
        <OwnComponents.FormGroupContainer>
          {this.renderStartTargetValue()}
        </OwnComponents.FormGroupContainer>
      );
    }

    if (type === KeyResultTypes.Currency) {
      return (
        <OwnComponents.FormGroupContainer>
          <OwnComponents.InputWrapper width={31}>
            <CurrencySelect activeItem={currency} onSelect={this.handleChangeCurrency} />
          </OwnComponents.InputWrapper>

          {this.renderStartTargetValue()}
        </OwnComponents.FormGroupContainer>
      );
    }

    return null;
  }

  render() {
    const { i18n } = this.props;
    const { errorMessages, name, type } = this.state;

    return (
      <OwnComponents.KeyResultItemContainer>
        <ErrorPopover
          content={errorMessages.name}
        >
          <InputGroup
            name="key-name"
            type="text"
            placeholder={i18n('KeyResultNameInput.Placeholder')}
            value={name}
            onChange={this.handleChangeKeyResultName}
          />
        </ErrorPopover>

        <KeyResultTypesToggler
          selectedType={type}
          onSelectType={this.handleSelectType}
        />

        {
          this.renderBottomInputsGroup()
        }
      </OwnComponents.KeyResultItemContainer>
    );
  }
}

export { KeyResultItem };
