import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { closeDaggerIcon } from 'images/icons/common';
import { InlineButton, PopoverPortal } from 'Components/Common';

export const Backdrop = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 1;
    background-color: rgba(0,0,0,0.2);
    overflow: auto;
    user-select: none;
`;

export const Overlay = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  transition: opacity 300ms ease-in-out;

  ${props => (!props.isOpen || props.willClose) && 'opacity: 0;'}
  ${props => (props.willOpen) && 'opacity: 1;'}
`;

const Container = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    pointer-events: none;
    user-select: none;
    z-index: 10;
`;

const Content = styled.div`
  position: relative;
  border-radius: 7.5px;
  background-color: white;
  box-shadow: 0 4px 18px rgba(36, 73, 134, 0.15);
  pointer-events: all;

  ${props => !props.noPadding && `
    padding: ${props.isScrollable ? '20px 0 20px 20px' : '20px'};
  `}
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  z-index: 999;
`;

class Modal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isScrollable: PropTypes.bool,
    noPadding: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    onClickOutside: PropTypes.func,
  }

  static defaultProps = {
    isOpen: false,
    isScrollable: false,
    noPadding: false,
  }

  constructor(props) {
    super(props);
    this.popoverDiv = document.createElement('div');
    this.popoverDiv.style.position = 'absolute';
    this.popoverDiv.style.top = 0;
    this.popoverDiv.style.right = 0;
    this.popoverDiv.style.left = 0;
  }

  render() {
    const { noPadding, isOpen, onClose, children, onClickOutside, isScrollable } = this.props;

    return (
      <PopoverPortal
        isOpen={isOpen}
        element={this.popoverDiv}
      >
        {props => (
          <Overlay {...props}>
            <Backdrop onClick={onClickOutside} />
            <Container onClick={e => e.stopPropagation()}>
              <Content noPadding={noPadding} isScrollable={isScrollable}>
                {!!onClose &&
                  <CloseButtonContainer>
                    <InlineButton icon={closeDaggerIcon} onClick={onClose} />
                  </CloseButtonContainer>
                  }
                {children}
              </Content>
            </Container>
          </Overlay>
        )}
      </PopoverPortal>
    );
  }
}

export { Modal };
