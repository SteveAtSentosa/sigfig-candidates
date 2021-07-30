import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { isMobileVersion } from 'utilities/common';

import { Container, Input } from './AuthTokenInput.Components';

const AllowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
const MaxTokenLength = 6;

class AuthTokenInput extends React.PureComponent {
  static propTypes = {
    onTokenInputComplete: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props);

    this.inputs = _.range(MaxTokenLength).map(() => React.createRef());
    this.currentInputIndex = 0;
  }

  get inputTokenNavigationTimeout() {
    return isMobileVersion ? 20 : 0;
  }

  getCurrentToken() {
    return this.inputs.map(input => input.current.value).join('');
  }

  handleKeyDown = async (event) => {
    const { key } = event;

    if (_.includes(AllowedKeys, key) === false) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      await this.selectPreviousTokenInput();
      this.inputs[this.currentInputIndex].current.value = '';
      return;
    }

    await this.selectNextTokenInput();

    setTimeout(() => {
      const token = this.getCurrentToken();

      if (token.length >= MaxTokenLength) {
        const { onTokenInputComplete } = this.props;
        onTokenInputComplete(Number(token));
      }
    }, this.inputTokenNavigationTimeout);
  }

  selectNextTokenInput = () => (
    new Promise((resolve) => {
      this.currentInputIndex += 1;

      if (this.currentInputIndex >= MaxTokenLength) {
        this.currentInputIndex = MaxTokenLength - 1;
        resolve();
        return;
      }

      setTimeout(() => {
        this.inputs[this.currentInputIndex].current.focus();
        resolve();
      }, this.inputTokenNavigationTimeout);
    })
  )

  selectPreviousTokenInput = () => (
    new Promise((resolve) => {
      this.currentInputIndex -= 1;

      if (this.currentInputIndex < 0) {
        this.currentInputIndex = 0;
        resolve();
        return;
      }

      setTimeout(() => {
        this.inputs[this.currentInputIndex].current.focus();
        resolve();
      }, 0);
    })
  )

  focus = () => {
    this.currentInputIndex = 0;
    this.inputs[this.currentInputIndex].current.focus();
  }

  blur = () => {
    this.currentInputIndex = MaxTokenLength - 1;
    this.inputs[this.currentInputIndex].current.blur();
  }

  clear = () => {
    this.inputs.forEach((input) => {
      const inputElement = input.current;
      inputElement.value = '';
    });
  }

  render() {
    const { className } = this.props;

    return (
      <Container className={className}>
        {
          _.range(MaxTokenLength).map(index => (
            <Input
              key={index}
              ref={this.inputs[index]}
              type={isMobileVersion ? 'number' : 'text'}
              pattern="\d*"
              onKeyDown={this.handleKeyDown}
            />
          ))
        }
      </Container>
    );
  }
}

export { AuthTokenInput };
