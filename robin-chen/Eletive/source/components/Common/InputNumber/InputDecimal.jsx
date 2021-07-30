import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { downChevronIcon, upArrow } from 'images/icons/common';

import * as Own from './InputNumber.Components';

export class InputDecimal extends React.PureComponent {
  static propTypes = {
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    value: '',
  };

  componentDidMount() {
    const { value } = this.props;
    if (Number(value) === value) {
      this.setState({ value });
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    const { value: prevValue } = prevProps;
    if (prevValue !== value) {
      this.change(value);
    }
  }

  get value() {
    const { value } = this.state;
    return String(value);
  }

  change = (value) => {
    const { onChange } = this.props;

    this.setState({ value });
    onChange(value);
  };

  handleChange = (event) => {
    const { target: { value } } = event;

    if (value.length === 0) {
      this.setState({ value });
      return;
    }

    if (value[0] === '-' && value.length === 1) {
      this.setState({ value });
      return;
    }

    if (value[value.length - 1] === '.') {
      if (value.indexOf('.') === value.length - 1) {
        this.setState({ value });
      }
      return;
    }

    const numberValue = Number(value);
    if (_.isNaN(numberValue)) {
      return;
    }

    this.change(numberValue);
  };

  handleClickUp = () => {
    const { value } = this.state;

    const floatValue = parseFloat(value) || 0;
    this.change((floatValue + 0.1).toFixed(1));
  };

  handleClickDown = () => {
    const { value } = this.props;
    let val = value;
    if (value === '' || !value) {
      val = 0;
    }

    this.change((parseFloat(val) - 0.1).toFixed(1));
  };

  render() {
    const { onChange, ...restProps } = this.props;

    return (
      <Own.Container>
        <Own.Input {...restProps} value={this.value} onChange={this.handleChange} />
        <Own.ButtonsContainer>
          <Own.ChevronButton onClick={this.handleClickUp}>
            <Own.Icon source={upArrow} />
          </Own.ChevronButton>
          <Own.ChevronButton onClick={this.handleClickDown}>
            <Own.Icon source={downChevronIcon} />
          </Own.ChevronButton>
        </Own.ButtonsContainer>
      </Own.Container>
    );
  }
}
