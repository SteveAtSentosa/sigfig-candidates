import React from 'react';
import { connect } from 'react-redux';

import { actions, selectors } from 'store';
import { buildRoute } from 'utilities/router';
import { getTargetByUrl, Targets } from 'utilities/reports';
import { Routes } from 'Constants';

import { ActionsPage } from './ActionsPage';

class ActionsPageContainer extends React.PureComponent {
  async componentDidMount() {
    const { fetchDriverList, fetchObjectiveList, fetchAttributeList, fetchUserList,
      isCurrentUserOwner, isCurrentUserAdministrator, currentUser, match } = this.props;

    const segmentID = this.urlSegmentID;
    const target = getTargetByUrl(match);
    const hasUserAdminRights = isCurrentUserAdministrator || isCurrentUserOwner;
    const hasAccessToSegment = target !== Targets.Individual && (hasUserAdminRights
      || currentUser.manageSegments.some(({ segment }) => segment === segmentID));

    await Promise.all([
      fetchDriverList(),
      fetchObjectiveList(),
      fetchAttributeList(),
      hasAccessToSegment && fetchUserList(),
    ]);

    if (this.isBasicPage) {
      this.navigateToActionsListPage();
    }
  }

  componentDidUpdate(prevProps) {
    const { match: { isExact: prevState } } = prevProps;

    if (prevState === false && this.isBasicPage) {
      this.navigateToActionsListPage();
    }
  }

  get isBasicPage() {
    const { match: { isExact } } = this.props;
    return isExact;
  }

  get urlSegmentID() {
    const { match } = this.props;
    const { params: { segmentID } } = match;
    return segmentID;
  }

  get breadcrumbs() {
    const { baseRoute, backRoute, parameters, breadcrumbRoot } = this.getBaseRoute();

    return [
      {
        name: breadcrumbRoot,
        route: buildRoute(backRoute, parameters),
      },
      {
        name: 'Breadcrumbs.Actions',
        route: buildRoute(baseRoute.List, parameters),
      },
    ];
  }

  getBaseRoute() {
    const { match } = this.props;
    let parameters = {};
    let baseRoute;
    let backRoute = Routes.Individual.Overview.Report;
    let breadcrumbRoot = 'Breadcrumbs.';

    const segmentID = this.urlSegmentID;
    const target = getTargetByUrl(match);
    if (target === Targets.Segments) {
      breadcrumbRoot += 'Segments';
      baseRoute = Routes.Segments.Actions;
      backRoute = Routes.Segments.Overview.Report;
      parameters = {
        ...parameters,
        segmentID,
        surveyStatus: 'active',
      };
    } else if (target === Targets.Organization) {
      breadcrumbRoot += 'Organization';
      baseRoute = Routes.Organization.Actions;
      backRoute = Routes.Organization.Overview.Report;
      parameters = { };
    } else if (target === Targets.Individual) {
      breadcrumbRoot += 'Individual';
      baseRoute = Routes.Individual.Actions;
    }

    return { baseRoute, backRoute, parameters, breadcrumbRoot };
  }

  navigateToCreateActionPage = () => {
    const { baseRoute, parameters } = this.getBaseRoute();
    const route = buildRoute(baseRoute.Create, parameters);

    const { history } = this.props;
    history.push(route);
  }

  navigateToEditObjectivePage = (objectiveID) => {
    const { baseRoute, parameters } = this.getBaseRoute();
    const route = buildRoute(baseRoute.Edit, { ...parameters, objectiveID });

    const { history } = this.props;
    history.push(route);
  }

  navigateToActionsListPage = () => {
    const { baseRoute, parameters } = this.getBaseRoute();
    const route = buildRoute(baseRoute.List, parameters);

    const { history } = this.props;
    history.replace(route);
  }

  handleSegmentSelect = ([segmentToSelect]) => {
    const { baseRoute, parameters } = this.getBaseRoute();
    const segmentID = segmentToSelect.id;
    const route = buildRoute(baseRoute.List, { ...parameters, segmentID });

    const { history } = this.props;
    history.push(route);
  }

  render() {
    return (
      <ActionsPage
        {...this.props}
        breadcrumbs={this.breadcrumbs}
        onObjectiveSave={this.navigateToActionsListPage}
        onObjectiveCreate={this.navigateToCreateActionPage}
        onObjectiveEdit={this.navigateToEditObjectivePage}
        onSegmentSelect={this.handleSegmentSelect}
      />
    );
  }
}

const mapStateToProps = ({ auth, app, survey, actions: actionsObjective, attributes, organizations, users }) => {
  const { screenSize, language, selectedOrganizationID } = app;
  const { currentUser: authUser } = auth;
  const { organizationList } = organizations;
  const { attributeList } = attributes;
  const { userList } = users;
  const { driverList } = survey;
  const { objectives } = actionsObjective;
  const { isCurrentUserOwner, isCurrentUserAdministrator } = selectors.auth;

  const currentUser = userList.find(({ id }) => id === authUser.id) || authUser;

  return {
    currentUser,
    screenSize,
    objectives,
    language,
    attributeList,
    userList,
    organizationList,
    driverList,
    selectedOrganizationID,
    isCurrentUserAdministrator: isCurrentUserAdministrator(auth),
    isCurrentUserOwner: isCurrentUserOwner(auth),
  };
};

const ConnectedActionsPageContainer = connect(mapStateToProps, {
  ...actions.app,
  ...actions.survey,
  ...actions.actions,
  ...actions.attributes,
  ...actions.users,
})(ActionsPageContainer);

export { ConnectedActionsPageContainer as ActionsPageContainer };
