import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';
import { InlineButton, PopoverPortal, Backdrop, Overlay } from 'Components/Common';
import { closeDaggerIcon } from 'images/icons/common';
import * as Own from './SidePanel.Components';


// NOTE: scrollable for previous implementation compatibility (Select)
export class SidePanel extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    scrollable: PropTypes.bool,
    noCloseOnOutsideClick: PropTypes.bool,
    children: Models.Common.RenderableElement,
    header: Models.Common.RenderableElement,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    scrollable: false,
    noCloseOnOutsideClick: false,
  }

  constructor(props) {
    super(props);
    this.popoverDiv = document.createElement('div');
    this.popoverDiv.style.position = 'absolute';
    this.popoverDiv.style.top = 0;
    this.popoverDiv.style.right = 0;
    this.popoverDiv.style.left = 0;
  }

  handleClickOutside = () => {
    const { onClose, noCloseOnOutsideClick } = this.props;
    if (noCloseOnOutsideClick || !onClose) {
      return null;
    }
    return onClose && onClose();
  }

  renderContent = () => {
    const { children } = this.props;
    if (typeof children === 'function') {
      return children();
    }
    return children;
  }


  render() {
    const { isOpen, scrollable, header, onClose } = this.props;
    return (
      <PopoverPortal
        isOpen={isOpen}
        element={this.popoverDiv}
        disableReposition
      >
        {props => (
          <Overlay {...props}>
            <Backdrop onClick={this.handleClickOutside} />
            <Own.Container {...props} scrollable={scrollable}>
              {header &&
              <Own.HeaderContainer>
                {header}
                <InlineButton icon={closeDaggerIcon} onClick={onClose} />
              </Own.HeaderContainer>
              }
              {this.renderContent()}
            </Own.Container>
          </Overlay>
        )}
      </PopoverPortal>
    );
  }
}
