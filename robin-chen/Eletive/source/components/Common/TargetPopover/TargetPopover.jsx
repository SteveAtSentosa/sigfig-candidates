import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popover, PopoverPosition, PopoverAlign } from 'Components/Common';


const PopoverContentContainer = styled.div`
  padding: 8px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 5px 25px rgba(36, 73, 134, 0.15);
  transition: opacity 300ms ease-in-out;

  ${props => (!props.isOpen || props.willClose) && 'opacity: 0;'}
  ${props => (props.willOpen) && 'opacity: 1;'}

  ${props => props.minWidth && `
    min-width: ${props.minWidth}px;
  `}

  ${props => props.withArrow && `
    :after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      transform: rotate(-45deg);
      background-color: white;
    }
  `}

  ${props => props.withArrow && props.position === 'top' && `
    &:after {
      right: 28px;
      bottom: -7px;
    }
  `}

  ${props => props.withArrow && props.position === 'bottom' && `
    &:after {
      right: 28px;
      top: -7px;
    }
  `}

  ${props => props.withArrow && props.position === 'right' && `
    &:after {
      top: 28px;
      left: -7px;
    }
  `}

  ${props => props.withArrow && props.position === 'left' && `
    &:after {
      top: 28px;
      right: -7px;
    }
  `}
`;

export class TargetPopover extends React.PureComponent {
  static propTypes = {
    withArrow: PropTypes.bool,
    minWidthByTarget: PropTypes.bool,
    disableReposition: PropTypes.bool,
    position: PropTypes.string,
    align: PropTypes.string,
    contentRenderer: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    popoverProps: PropTypes.object,
  }

  static defaultProps = {
    withArrow: false,
    minWidthByTarget: false,
    position: PopoverPosition.BOTTOM,
    align: PopoverAlign.CENTER,
    disableReposition: false,
  }

  constructor(props) {
    super(props);

    this.target = React.createRef();
    this.state = {
      isPopoverOpen: false,
    };
  }

  get targetWidth() {
    return this.target.current ? this.target.current.offsetWidth : 0;
  }

  handlePopoverToggle = (e) => {
    e && e.stopPropagation && e.stopPropagation();
    this.setState(({ isPopoverOpen }) => ({ isPopoverOpen: !isPopoverOpen }));
  }

  handleKeyDown = (e) => {
    if (e.which === 27) {
      this.setState({ isPopoverOpen: false });
    }
  }

  renderContent = (props) => {
    const { contentRenderer, position, minWidthByTarget, withArrow } = this.props;

    return (
      <PopoverContentContainer
        {...props}
        position={position}
        withArrow={withArrow}
        minWidth={minWidthByTarget && this.targetWidth}
      >
        {contentRenderer({
          closePopup: this.handlePopoverToggle,
        })}
      </PopoverContentContainer>
    );
  }

  render() {
    const { popoverProps, children, position, align, disableReposition, withArrow } = this.props;
    const { isPopoverOpen } = this.state;

    const cloneChildren = React.cloneElement(children, {
      isPopoverOpen,
      onClick: this.handlePopoverToggle,
      onKeyDown: this.handleKeyDown,
      forwardedRef: this.target,
    });

    return (
      <Popover
        {...popoverProps}
        isOpen={isPopoverOpen}
        padding={withArrow ? 19 : 6}
        content={this.renderContent}
        position={position}
        align={align}
        disableReposition={disableReposition}
        containerStyle={{ overflow: 'visible' }}
        onClickTarget={this.handlePopoverToggle}
        onClickOutside={this.handlePopoverToggle}
      >
        {cloneChildren}
      </Popover>
    );
  }
}
