import React from 'react';
import PropTypes from 'prop-types';

import { TargetPopover, List, InlineButton } from 'Components/Common';
import { contextMenuIcon } from 'images/icons/common';

export class ActionMenu extends React.PureComponent {
  static propTypes = {
    popoverProps: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.node,
      onClick: PropTypes.func,
    })).isRequired,
  }

  render() {
    const { items, popoverProps } = this.props;
    const menu = ({ closePopup }) => (<List
      items={items}
      onItemSelect={closePopup}
    />);
    return (
      <TargetPopover
        {...popoverProps}
        contentRenderer={menu}
      >
        <InlineButton icon={contextMenuIcon} />
      </TargetPopover>
    );
  }
}
