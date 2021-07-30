import React from 'react';
import { connect } from 'react-redux';

import { actions } from 'store';

import { Notifications } from './Notifications';

const NotificationsContainer = props => (
  <Notifications {...props} />
);

const mapStateToProps = ({ app }) => {
  const { notifications } = app;

  return {
    notifications,
  };
};

const ConnectedNotificationsContainer = connect(mapStateToProps, { ...actions.app })(NotificationsContainer);

export { ConnectedNotificationsContainer as NotificationsContainer };
