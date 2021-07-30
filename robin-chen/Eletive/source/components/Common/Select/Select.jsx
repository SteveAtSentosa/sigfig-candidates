import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withClasses } from 'bem-class-builder';
import { Select as BlueprintSelect } from '@blueprintjs/select';

import { isMobileVersion } from 'utilities/common';

import { SidePanel } from 'Components/Common';
import { MobileContainer } from './Select.Components';

import classes from './Select.scss';

@withClasses(classes, 'select')
class Select extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.any),
    activeItem: PropTypes.any,
    onItemSelect: PropTypes.func,
    mobileVersion: PropTypes.shape({
      drawerSize: PropTypes.string,
      itemRenderer: PropTypes.func.isRequired,
    }),
    popoverProps: PropTypes.object,
    className: PropTypes.string,
    targetElementQuery: PropTypes.string,
  }

  state = {
    isMobileSelectListOpened: false,
  }

  get popoverProps() {
    const { cls, popoverProps: { minimal } = {} } = this.props;

    const popoverClasses = classnames(cls('popover'), {
      [cls('popover', ['minimal'])]: minimal,
    });

    return {
      wrapperTagName: 'div',
      popoverClassName: popoverClasses,
      portalClassName: cls('portal-container'),
      onOpening: (popoverContainer) => {
        const { targetElementQuery } = this.props;
        const targetElement = document.querySelector(targetElementQuery);

        if (targetElement) {
          const element = popoverContainer;
          element.style.width = `${targetElement.offsetWidth}px`;
        }
      },
    };
  }

  handleClick = () => {
    this.setState({
      isMobileSelectListOpened: true,
    });
  }

  handleMobileSelectListClose = () => {
    this.setState({
      isMobileSelectListOpened: false,
    });
  }

  handleMobileListItemClick = item => (event) => {
    event.stopPropagation();

    const { onItemSelect } = this.props;
    onItemSelect && onItemSelect(item);

    this.setState({
      isMobileSelectListOpened: false,
    });
  }

  renderMobileList = () => {
    const { items, activeItem, mobileVersion: { itemRenderer } } = this.props;

    return items.map(item => itemRenderer(item, {
      active: item === activeItem,
      handleClick: this.handleMobileListItemClick(item),
    }));
  }

  render() {
    const { cls, children, mobileVersion, className, popoverProps, ...props } = this.props;
    const { isMobileSelectListOpened } = this.state;

    if (isMobileVersion) {
      return (
        <MobileContainer onClick={this.handleClick} className={className}>
          {children}

          <SidePanel
            scrollable
            size={mobileVersion.drawerSize}
            isOpen={isMobileSelectListOpened}
            onClose={this.handleMobileSelectListClose}
          >
            {this.renderMobileList()}
          </SidePanel>
        </MobileContainer>
      );
    }

    const localPopoverProps = {
      ...this.popoverProps,
      ...popoverProps,
    };

    return (
      <BlueprintSelect {...props} popoverProps={localPopoverProps} className={className}>
        {children}
      </BlueprintSelect>
    );
  }
}

export { Select };
