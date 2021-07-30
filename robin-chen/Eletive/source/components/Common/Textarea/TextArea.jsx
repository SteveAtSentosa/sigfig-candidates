import React from 'react';
import styled from 'styled-components';

const TextAreaWrapper = styled.textarea`
  min-height: 50px;
  max-width: 100%;
  width: 100%;
  padding: 10px 15px;
  background: #ffffff;
  color: #244986;
  font-size: 12px;
  line-height: 14px;
  border: 1px solid #98a6bc;
  border-radius: 5px;
  box-sizing: border-box;
  outline: 0;

  &::placeholder {
    color: #98a6bc;
  }

  &:disabled {
    opacity: .5;
  }

  &:hover {
    border: 1px solid #707e93;
  }

  &:focus {
    border: 1px solid #66d587;
  }
`;

export class TextArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      height: 50,
    };
  }

  componentDidMount() {
    this.setRows();
  }

  componentDidUpdate(prevProps) {
    const { value, rows } = this.props;
    if (!rows && prevProps.value !== value) {
      this.setRows();
    }
  }

  setRows = () => {
    const { height: currentHeight } = this.state;

    if (this.inputRef.current.scrollHeight - currentHeight > 5) {
      let height = this.inputRef.current.scrollHeight + 5;
      height = height > 120 ? 120 : height;
      this.setState({ height });
    }
  }

  render() {
    const { onChange, rows, ...restProps } = this.props;
    const { height } = this.state;
    return (
      <TextAreaWrapper
        {...restProps}
        ref={this.inputRef}
        rows={rows}
        style={rows ? null : { height: `${height}px` }}
        onChange={event => onChange(event.target.value, event)}
      />
    );
  }
}
