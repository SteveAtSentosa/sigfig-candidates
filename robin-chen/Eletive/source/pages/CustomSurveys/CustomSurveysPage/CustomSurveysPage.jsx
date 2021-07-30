import _ from 'lodash';
import React from 'react';
import { Route, Switch, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ScreenSizes } from 'utilities/common';
import { withTranslation } from 'utilities/decorators';
import { buildRoute } from 'utilities/router';
import { getTargetByUrl, Targets } from 'utilities/reports';
import { Routes } from 'Constants';
import * as Models from 'Models';

import { CustomSurveyEditForm } from 'Components/Survey/Forms';
import {
  CustomSurveyCreateForm,
  CustomSurveyListContainer,
} from 'Components/Survey';
import { SegmentSelector } from 'Components/Attributes';
import { SectionHeader } from 'Components';
import { WidePageContainer, WidePageContent } from 'Components/Common';
import { OrganizationalCustomSurveyReportPage } from 'Pages/Reports';

import { SelectTargetAndLaunch } from './SelectTargetAndLaunch/SelectTargetAndLaunch';

@withTranslation('CustomSurveysPage')
class CustomSurveysPage extends React.PureComponent {
  static propTypes = {
    screenSize: PropTypes.number,
    customSurveyList: Models.Survey.CustomSurveyList,
  }

  get urlSegmentID() {
    const { match: { params: { segmentID } } } = this.props;
    return segmentID;
  }

  get urlSurveyStatus() {
    const { match: { params: { surveyStatus } } } = this.props;
    return surveyStatus;
  }

  get breadcrumbs() {
    const { i18n, location: { pathname }, customSurveyList } = this.props;
    let currentMatch = null;
    Object.keys(Routes.Organization.CustomSurveys).forEach((k) => {
      const m = matchPath(pathname, { path: Routes.Organization.CustomSurveys[k], exact: true });
      if (m) {
        currentMatch = m;
      }
    });
    if (!currentMatch) {
      Object.keys(Routes.Segments.CustomSurveys).forEach((k) => {
        const m = matchPath(pathname, { path: Routes.Segments.CustomSurveys[k], exact: true });
        if (m) {
          currentMatch = m;
        }
      });
    }

    const target = getTargetByUrl(currentMatch);
    const breadcrumbs = [];
    if (target === Targets.Organization) {
      breadcrumbs.push(
        {
          name: i18n('Breadcrumbs.Organization'),
          route: Routes.Organization.Base,
        },
        {
          name: i18n('Breadcrumbs.CustomSurvey'),
          route: Routes.Organization.CustomSurveys.Base,
        },
      );
    } else if (target === Targets.Segments) {
      breadcrumbs.push(
        {
          name: i18n('Breadcrumbs.Segments'),
          route: Routes.Segments.Base,
        },
        {
          name: i18n('Breadcrumbs.CustomSurvey'),
          route: buildRoute(Routes.Segments.CustomSurveys.Base, { segmentID: this.urlSegmentID || '_' }),
        },
      );
    }

    if (currentMatch.path === Routes.Organization.CustomSurveys.Create) {
      breadcrumbs.push({
        name: i18n('Breadcrumbs.AddNewSurvey'),
      });
    } else {
      if (customSurveyList && customSurveyList.length) {
        const { params: { surveyID } } = currentMatch;
        const survey = customSurveyList.find(({ id }) => id === Number(surveyID));
        if (survey) {
          breadcrumbs.push({
            name: survey.name,
          });
        } else if (surveyID) {
          const { history } = this.props;
          if (target === Targets.Organization) {
            history.push(Routes.Organization.CustomSurveys.Base);
          } else {
            history.push(Routes.Segments.CustomSurveys.Base);
          }
        }
      }

      if (currentMatch.path === Routes.Organization.CustomSurveys.Edit) {
        breadcrumbs.push({
          name: i18n('Breadcrumbs.EditSurvey'),
        });
      } else if (currentMatch.path === Routes.Organization.CustomSurveys.Target) {
        breadcrumbs.push({
          name: i18n('Breadcrumbs.Launch'),
        });
      }
    }

    return breadcrumbs;
  }

  get isMobile() {
    const { screenSize } = this.props;
    return screenSize < ScreenSizes.lg;
  }

  handleSegmentSelect = (selectedSegments) => {
    const segmentToSelect = _.first(selectedSegments);

    const { history } = this.props;
    history.push(buildRoute(Routes.Segments.CustomSurveys.List, {
      segmentID: segmentToSelect.id,
      surveyStatus: this.urlSurveyStatus,
    }));
  }

  renderSegmentSelector() {
    if (!this.urlSegmentID) {
      return null;
    }
    return (
      <SegmentSelector
        singleSelectionMode
        selectFirstSegmentByDefault
        popoverAlign="end"
        selectedSegmentIds={[this.urlSegmentID]}
        onChange={this.handleSegmentSelect}
      />
    );
  }

  render() {
    const { i18n } = this.props;
    const actionButton = this.renderSegmentSelector();

    return (
      <WidePageContainer>
        <SectionHeader
          breakMobileActions
          title={i18n('PageTitle')}
          breadcrumbItems={this.breadcrumbs}
          actions={this.isMobile ? null : actionButton}
          secondaryActions={this.isMobile ? actionButton : null}
        />

        <Switch>
          <WidePageContent>
            <Route
              path={Routes.Organization.CustomSurveys.List}
              component={CustomSurveyListContainer}
            />
            <Route
              path={Routes.Segments.CustomSurveys.List}
              component={CustomSurveyListContainer}
            />

            <Route
              exact
              path={Routes.Organization.CustomSurveys.Create}
              component={CustomSurveyCreateForm}
            />
            <Route
              exact
              path={Routes.Organization.CustomSurveys.Edit}
              component={CustomSurveyEditForm}
            />
            <Route
              path={Routes.Organization.CustomSurveys.Target}
              component={SelectTargetAndLaunch}
            />
            <Route
              exact
              path={Routes.Organization.CustomSurveys.Report}
              component={OrganizationalCustomSurveyReportPage}
            />
            <Route
              exact
              path={Routes.Segments.CustomSurveys.Report}
              component={OrganizationalCustomSurveyReportPage}
            />
            <Route
              exact
              path={Routes.Organization.CustomSurveys.TextAnswers}
              component={OrganizationalCustomSurveyReportPage}
            />
          </WidePageContent>
        </Switch>
      </WidePageContainer>
    );
  }
}

export { CustomSurveysPage };
