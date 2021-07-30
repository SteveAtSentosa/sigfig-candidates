import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const InputStyled = styled.input`
  width: 100%;
  padding: 0 15px;
  border: 1px solid #98A6BC;
  border-radius: 5px;
  background-color: #fff;
  color: #707e93;
  font-size: 12px;
  font-weight: 500;
  text-align: inherit;
  box-sizing: border-box;
  outline: 0;
  height: 36px;

  ${props => props.disabled && `
    background-color: #f4f6fa;
    border-color: #c9d0db;
    cursor: not-allowed;
  `}

  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: #98a6bc;
  }

  &:focus {
    border: 1px solid #66d587;
  }
`;

class InputGroup extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    readOnly: PropTypes.bool,
    selectAllOnFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    inputRef: PropTypes.object,
    type: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  }

  handleFocus = ({ target }) => {
    const { value, selectAllOnFocus } = this.props;

    selectAllOnFocus && target.setSelectionRange(0, `${value}`.length);
  }

  render() {
    const { name, onChange, value, inputRef, type,
      placeholder, style, className, readOnly, onKeyDown, disabled } = this.props;

    return (
      <InputStyled
        name={name}
        style={style}
        className={className}
        type={type}
        placeholder={placeholder}
        ref={inputRef}
        readOnly={readOnly}
        value={value}
        onKeyDown={onKeyDown}
        onChange={event => !disabled && onChange(event.target.value, event)}
        onFocus={this.handleFocus}
        onMouseUp={this.handleFocus}
        disabled={disabled}
      />
    );
  }
}

export { InputGroup };
