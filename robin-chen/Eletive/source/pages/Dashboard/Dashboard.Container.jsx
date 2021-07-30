import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { actions, selectors } from 'store';
import * as Models from 'Models';
import { Routes, Demo } from 'Constants';

import { Dashboard } from './Dashboard';

const DashboardContainer = ({ currentUser, language, ...restProps }) => {
  if (_.isNil(currentUser)) {
    return <Redirect to={Routes.Signin} />;
  }

  return (
    <Dashboard
      key={language}
      currentUser={currentUser}
      {...restProps}
    />
  );
};

DashboardContainer.propTypes = {
  currentUser: Models.User.CurrentUser,
  language: Models.Common.Language,
  isGdprConsented: PropTypes.bool,
  selectedOrganizationID: PropTypes.number,
  isCurrentUserAnalyst: PropTypes.bool,
  isCurrentUserAdministrator: PropTypes.bool,
  fetchOrganizationReport: PropTypes.func,
};

DashboardContainer.defaultProps = {
  isGdprConsented: false,
  isCurrentUserAnalyst: false,
  isCurrentUserAdministrator: false,
};

const mapStateToProps = ({ app, auth, survey, attributes }) => {
  const { language, settings, selectedOrganizationID } = app;
  const { currentUser } = auth;

  // NOTE:
  // currentUser can be null when the user session expires
  // but the route is redirected after checking in render() function
  const disabledFeatures = currentUser?.organizationData?.disabledFeatures || [];

  const {
    isGdprConsented,
    isCurrentUserOwner,
    isCurrentUserAnalyst,
    isCurrentUserAdministrator,
  } = selectors.auth;

  const { isCurrentSurveyCompleted } = selectors.survey;
  const { segmentsForReportList } = selectors.attributes;

  const segmentsList = segmentsForReportList({ auth, attributes });

  return {
    language,
    settings,
    currentUser,
    segmentsList,
    selectedOrganizationID,
    disabledFeatures,
    demoModeEnabled: selectedOrganizationID === Demo.demoOrganization.id,
    isCurrentUserOwner: isCurrentUserOwner(auth),
    isCurrentUserAnalyst: isCurrentUserAnalyst(auth),
    isCurrentUserAdministrator: isCurrentUserAdministrator(auth),
    isGdprConsented: isGdprConsented(auth),
    isCurrentSurveyCompleted: isCurrentSurveyCompleted(survey),
  };
};

const ConnectedDashboardContainer = connect(mapStateToProps, {
  ...actions.survey,
  ...actions.attributes,
})(DashboardContainer);

export { ConnectedDashboardContainer as DashboardContainer };
