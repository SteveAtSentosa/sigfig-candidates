import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { buildRoute } from 'utilities/router';

import { actions } from 'store';
import { Routes } from 'Constants';
import * as Models from 'Models';

import { CustomSurveysPage } from './CustomSurveysPage';

class CustomSurveysPageContainer extends React.Component {
  static propTypes = {
    customSurveyList: Models.Survey.CustomSurveyList,
    fetchCustomSurveyList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.isBasicPage) {
      this.navigateToCustomSurveyListPage();
    }

    const { fetchCustomSurveyList } = this.props;
    fetchCustomSurveyList();
  }

  componentDidUpdate(prevProps) {
    const { match: { isExact: prevState } } = prevProps;

    if (prevState === false && this.isBasicPage) {
      this.navigateToCustomSurveyListPage();
    }
  }

  get isBasicPage() {
    const { match: { isExact, path } } = this.props;
    return isExact && [Routes.Organization.CustomSurveys.Base, Routes.Segments.CustomSurveys.Base].includes(path);
  }

  get urlSegmentID() {
    const { match } = this.props;
    const { params: { segmentID } } = match;
    return segmentID;
  }

  navigateToCustomSurveyListPage = () => {
    let route = buildRoute(Routes.Organization.CustomSurveys.List, {
      surveyStatus: 'active',
    });

    if (this.urlSegmentID) {
      route = buildRoute(Routes.Segments.CustomSurveys.List, {
        segmentID: this.urlSegmentID,
        surveyStatus: 'active',
      });
    }

    const { history } = this.props;
    history.replace(route);
  }

  render() {
    return (
      <CustomSurveysPage {...this.props} />
    );
  }
}

const mapStateToProps = ({ app, auth, survey }) => {
  const { screenSize, selectedOrganizationID } = app;
  const { currentUser } = auth;
  const { customSurveyList } = survey;

  return {
    currentUser,
    customSurveyList,
    screenSize,
    selectedOrganizationID,
  };
};

const ConnectedCustomSurveysPageContainer = connect(mapStateToProps, {
  ...actions.survey,
})(CustomSurveysPageContainer);

export { ConnectedCustomSurveysPageContainer as CustomSurveysPageContainer };
