import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'store';
import { Demo } from 'Constants';

import { DemoModeHeader } from './DemoModeHeader';

const DemoModeHeaderContainer = ({ demoModeEnabled, switchDemoMode, ...props }) => (
  demoModeEnabled && <DemoModeHeader {...props} onSwitchDemoMode={switchDemoMode} />
);

DemoModeHeaderContainer.propTypes = {
  demoModeEnabled: PropTypes.bool,
  switchDemoMode: PropTypes.func.isRequired,
};

DemoModeHeaderContainer.defaultProps = {
  demoModeEnabled: false,
};

function mapStateToProps({ app }) {
  const { language, selectedOrganizationID } = app;

  return {
    language,
    demoModeEnabled: selectedOrganizationID === Demo.demoOrganization.id,
  };
}

const DemoModeHeaderContainerConnected = connect(mapStateToProps, { ...actions.app })(DemoModeHeaderContainer);

export { DemoModeHeaderContainerConnected as DemoModeHeaderContainer };
