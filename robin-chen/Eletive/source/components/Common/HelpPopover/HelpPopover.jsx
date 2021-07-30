import React from 'react';
import PropTypes from 'prop-types';

import { Popover } from 'Components/Common';

import * as OwnComponents from './HelpPopover.Components';

class HelpPopover extends React.PureComponent {
  static propTypes = {
    content: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    noBorder: PropTypes.bool,
    position: PropTypes.string,
  }

  static defaultProps = {
    noBorder: false,
    position: 'top',
  }

  state = {
    isOpen: false,
  }

  get popoverContainerStyle() {
    return {
      color: '#707e93',
      zIndex: 1000,
    };
  }

  handleMouseEnter = () => {
    this.setState({
      isOpen: true,
    });
  }

  handleMouseLeave = () => {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const { content, children, position, noBorder } = this.props;
    const { isOpen } = this.state;

    return (
      <Popover
        isOpen={isOpen}
        content={props => (
          <OwnComponents.HelpPopoverContent {...props} noBorder={noBorder}>
            { content }
          </OwnComponents.HelpPopoverContent>
        )}
        containerStyle={this.popoverContainerStyle}
        position={[position]}
      >
        <OwnComponents.ChildWrapper onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          { children }
        </OwnComponents.ChildWrapper>
      </Popover>
    );
  }
}

export { HelpPopover };
