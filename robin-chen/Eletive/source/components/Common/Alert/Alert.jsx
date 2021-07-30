import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';
import { Modal, RoundedButton } from 'Components/Common';

import * as Own from './Alert.Components';

const { AlertIntent } = Own;

class Alert extends React.PureComponent {
  static propTypes = {
    children: Models.Common.RenderableElement,
    isOpen: PropTypes.bool,
    title: PropTypes.node,
    description: PropTypes.string,
    intent: PropTypes.string,
    icon: PropTypes.string.isRequired,
    actions: Models.Common.AlertActions,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    actions: [],
    intent: AlertIntent.SUCCESS,
  };

  renderActions() {
    const { actions } = this.props;

    return (
      <Own.ActionContainer>
        {actions.map(({ text, intent, onClick, disabled }, index) => (
          <Own.ButtonWrapper key={index}>
            <RoundedButton
              disabled={disabled}
              intent={intent}
              text={text}
              onClick={onClick}
            />
          </Own.ButtonWrapper>
        ))}
      </Own.ActionContainer>
    );
  }

  render() {
    const { isOpen, children, icon, title, intent, description, onClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Own.Container>
          <Own.IconContainer intent={intent}>
            <Own.Icon source={icon}></Own.Icon>
          </Own.IconContainer>
          <Own.Title>{title}</Own.Title>
          <Own.Description>{description}</Own.Description>
          {children && (
            <Own.ChildrenWrapper>{children}</Own.ChildrenWrapper>
          )}
          {this.renderActions()}
        </Own.Container>
      </Modal>
    );
  }
}

export { Alert, AlertIntent };
