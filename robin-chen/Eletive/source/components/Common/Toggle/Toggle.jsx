import React from 'react';
import PropTypes from 'prop-types';

import { filterOnIcon, filterOffIcon } from 'images/icons/common';
import {
  ToggleRoot,
  ToggleBackground,
  ToggleHandle,
  ToggleInput,
  ToggleIconChecked,
  ToggleIconUnchecked,
} from './Toggle.Components';

class Toggle extends React.PureComponent {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    className: '',
  };

  constructor(props) {
    super(props);

    const { checked } = props;

    const width = 42;
    const height = 24;
    const handleDiameter = 18;
    this.checkedPos = Math.max(width - height, width - (height + handleDiameter) / 2);
    this.uncheckedPos = Math.max(0, (height - handleDiameter) / 2);
    this.state = {
      currentPos: checked ? this.checkedPos : this.uncheckedPos,
    };
    this.lastDragAt = 0;
    this.lastKeyUpAt = 0;
  }

  componentDidUpdate(prevProps) {
    const { checked } = this.props;

    if (prevProps.checked === checked) {
      return;
    }

    const currentPos = checked ? this.checkedPos : this.uncheckedPos;
    this.setState({ currentPos });
  }

  onDragStart = (clientX) => {
    this.inputRef.focus();
    this.setState({
      startX: clientX,
      dragStartingTime: Date.now(),
    });
  }

  onDrag = (clientX) => {
    const { startX, isDragging, currentPos } = this.state;
    const { checked } = this.props;
    const startPos = checked ? this.checkedPos : this.uncheckedPos;
    const mousePos = startPos + clientX - startX;

    if (!isDragging && clientX !== startX) {
      this.setState({ isDragging: true });
    }

    const newPos = Math.min(this.checkedPos, Math.max(this.uncheckedPos, mousePos));
    if (newPos !== currentPos) {
      this.setState({ currentPos: newPos });
    }
  };

  onDragStop = (event) => {
    const { currentPos, isDragging, dragStartingTime } = this.state;
    const { checked } = this.props;
    const halfwayCheckpoint = (this.checkedPos + this.uncheckedPos) / 2;

    this.setState({ isDragging: false });
    this.lastDragAt = Date.now();

    const timeSinceStart = Date.now() - dragStartingTime;
    const isMouseClicked = !isDragging || timeSinceStart < 250;
    if (isMouseClicked) {
      this.onChange(event);
      return;
    }

    const switchToChecked = checked && currentPos > halfwayCheckpoint;
    const switchToUnchecked = !checked && currentPos < halfwayCheckpoint;
    if (!switchToChecked && !switchToUnchecked) {
      this.onChange(event);
      return;
    }

    const newPos = checked ? this.checkedPos : this.uncheckedPos;
    this.setState({ currentPos: newPos });
  }

  onMouseDown = (event) => {
    event.preventDefault();
    if (typeof event.button === 'number' && event.button !== 0) {
      return;
    }

    this.onDragStart(event.clientX);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event) => {
    event.preventDefault();
    this.onDrag(event.clientX);
  }

  onMouseUp = (event) => {
    this.onDragStop(event);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onTouchStart = (event) => {
    this.checkedStateFromDragging = null;
    this.onDragStart(event.touches[0].clientX);
  };

  onTouchMove = (event) => {
    this.onDrag(event.touches[0].clientX);
  };

  onTouchEnd = (event) => {
    event.preventDefault();
    this.onDragStop(event);
  };

  onInputChange = (event) => {
    if (Date.now() - this.lastDragAt > 50) {
      this.onChange(event);
    }
  };

  onKeyUp = () => {
    this.lastKeyUpAt = Date.now();
  }

  getInputRef = (el) => {
    this.inputRef = el;
  }

  onClick = (event) => {
    event.preventDefault();
    this.inputRef.focus();
    this.onChange(event);
  }

  onChange = () => {
    const { checked, onChange } = this.props;
    onChange(!checked);
  }

  preventEvent = (event) => {
    event.preventDefault();
  };

  isCheckedPosition(currentPos) {
    const relativePos = (currentPos - this.uncheckedPos) / (this.checkedPos - this.uncheckedPos);
    if (relativePos < 0.5) {
      return false;
    }
    return true;
  }

  render() {
    const { disabled, className } = this.props;
    const { currentPos, isDragging } = this.state;

    return (
      <ToggleRoot disabled={disabled} checked={this.isCheckedPosition(currentPos)} className={className}>
        <ToggleInput
          type="checkbox"
          role="switch"
          disabled={disabled}
          ref={this.getInputRef}

          onKeyUp={this.onKeyUp}
          onChange={this.onInputChange}
        />
        <ToggleBackground
          disabled={disabled}
          isDragging={isDragging}

          onClick={disabled ? null : this.onClick}
          onMouseDown={event => event.preventDefault()}
        >
          <ToggleIconChecked
            isDragging={isDragging}
            opacity={(currentPos - this.uncheckedPos) / (this.checkedPos - this.uncheckedPos)}
            source={filterOnIcon}
          />
          <ToggleIconUnchecked
            isDragging={isDragging}
            opacity={1 - (currentPos - this.uncheckedPos) / (this.checkedPos - this.uncheckedPos)}
            source={filterOffIcon}
          />
        </ToggleBackground>
        <ToggleHandle
          disabled={disabled}
          position={currentPos}
          isDragging={isDragging}

          onClick={event => event.preventDefault()}
          onMouseDown={disabled ? null : this.onMouseDown}
          onTouchStart={disabled ? null : this.onTouchStart}
          onTouchMove={disabled ? null : this.onTouchMove}
          onTouchEnd={disabled ? null : this.onTouchEnd}
        />
      </ToggleRoot>
    );
  }
}

export { Toggle };
