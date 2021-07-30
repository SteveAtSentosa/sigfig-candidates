import React from 'react';
import PropTypes from 'prop-types';

import { Popover } from 'Components/Common';

import * as Own from './ErrorPopover.Components';

class ErrorPopover extends React.PureComponent {
  static propTypes = {
    content: PropTypes.node,
    children: PropTypes.node.isRequired,
    position: PropTypes.string,
    padding: PropTypes.number,
  }

  static defaultProps = {
    content: null,
    position: 'right',
    padding: -300,
  }

  get popoverContainerStyle() {
    return {
      color: '#e46363',
      zIndex: 1000,
    };
  }

  render() {
    const { content, children, padding, position } = this.props;

    return (
      <Popover
        isOpen={!!content}
        content={props => (
          <Own.ErrorPopoverContent {...props}>
            { content }
          </Own.ErrorPopoverContent>
        )}
        containerStyle={this.popoverContainerStyle}
        padding={padding}
        position={[position]}
      >
        <Own.ChildWrapper>
          { children }
        </Own.ChildWrapper>
      </Popover>
    );
  }
}

export { ErrorPopover };
