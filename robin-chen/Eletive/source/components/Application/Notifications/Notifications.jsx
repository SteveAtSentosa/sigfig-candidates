import React from 'react';
import PropTypes from 'prop-types';
import { Toast, Toaster, Position, Intent } from '@blueprintjs/core';

import * as CommonModels from 'Models/Common';

export class Notifications extends React.PureComponent {
  static propTypes = {
    notifications: CommonModels.NotificationList,
    dismissNotification: PropTypes.func,
  }

  handleNotificationDismiss = notification => () => {
    const { dismissNotification } = this.props;
    dismissNotification(notification);
  }

  renderNotification(notification) {
    const { id, icon, intent, timeout, message } = notification;

    return (
      <Toast
        key={id}
        icon={icon}
        intent={Intent[intent.toUpperCase()]}
        timeout={timeout}
        message={message}
        onDismiss={this.handleNotificationDismiss(notification)}
      />
    );
  }

  render() {
    const { notifications } = this.props;

    return (
      <Toaster position={Position.TOP}>
        {
          notifications.map(notification => (
            this.renderNotification(notification)
          ))
        }
      </Toaster>
    );
  }
}
