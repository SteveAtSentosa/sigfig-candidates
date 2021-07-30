import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router';

import { buildRoute } from 'utilities/router';

import * as Models from 'Models';
import { Routes } from 'Constants';

import { MobileHeaderContainer, MainMenuContainer } from 'Components';
import { ErrorBoundary } from 'Components/Common';
import { GdprDialogContainer, PerformSurveyAlert } from 'Components/Application';
import { DemoModeHeaderContainer } from 'Components/DemoMode';

import * as Own from './Dashboard.Components';

import menu from './Dashboard.menu';
import routes from './Dashboard.routes';

class Dashboard extends React.PureComponent {
  static propTypes = {
    settings: Models.App.Settings,
    demoModeEnabled: PropTypes.bool,
    currentUser: PropTypes.oneOfType([Models.User.CurrentUser, Models.User.User]),
    fetchSurveyAnswerList: PropTypes.func,
    selectedOrganizationID: PropTypes.number,
    isCurrentSurveyCompleted: PropTypes.bool,
    isGdprConsented: PropTypes.bool,
    isCurrentUserOwner: PropTypes.bool,
    isCurrentUserAnalyst: PropTypes.bool,
    isCurrentUserAdministrator: PropTypes.bool,
    segmentsList: PropTypes.arrayOf(PropTypes.string),
    disabledFeatures: PropTypes.arrayOf(PropTypes.number),
    fetchAttributeList: PropTypes.func,
  }

  static defaultProps = {
    demoModeEnabled: false,
    isCurrentUserOwner: false,
  }

  state = {
    isPerformSurveyAlertShown: false,
  };

  constructor(props) {
    super(props);

    this.dashboardContent = React.createRef();
  }

  componentDidMount() {
    const {
      isGdprConsented,
    } = this.props;

    if (isGdprConsented === false) {
      return;
    }

    const { fetchSurveyAnswerList, fetchAttributeList } = this.props;

    fetchAttributeList();

    fetchSurveyAnswerList().then(() => {
      const { isCurrentSurveyCompleted } = this.props;
      if (isCurrentSurveyCompleted === false) {
        this.setState({
          isPerformSurveyAlertShown: true,
        });
      }
    });
  }

  componentDidUpdate(previousProps) {
    const { location: currentLocation } = this.props;
    const { location: previousLocation } = previousProps;

    if (currentLocation.pathname !== previousLocation.pathname) {
      this.dashboardContent.current.scrollTop = 0;
    }
  }

  get availableRoutes() {
    const { currentUser, disabledFeatures } = this.props;

    return routes
      .filter(({ availableRoles, feature }) => {
        if (availableRoles && !availableRoles.includes(currentUser.role)) {
          return false;
        }

        return !feature || !disabledFeatures.includes(feature);
      });
  }

  get mainMenu() {
    const { segmentsList, isCurrentUserOwner } = this.props;

    return this.prepareMenuLinks(menu)
      .filter(item => item.name !== 'SegmentReport' || isCurrentUserOwner || segmentsList.length);
  }

  getLogo(mobile) {
    const { currentUser } = this.props;
    const { organizationData: { logo, name } } = currentUser;

    if (logo) {
      return <Own.Logo src={logo} alt={name} />;
    }

    if (mobile) {
      return <Own.DefaultLogoMobile />;
    }
    return <Own.DefaultLogo />;
  }

  isAvailableForSegmentManager = (menuItem) => {
    if (menuItem.availableForSegmentManager) {
      const { isCurrentUserOwner, isCurrentUserAnalyst, isCurrentUserAdministrator, currentUser } = this.props;
      const { manageSegments } = currentUser;
      const isSegmentManager = manageSegments && manageSegments.length > 0;

      return isSegmentManager || isCurrentUserOwner || isCurrentUserAnalyst || isCurrentUserAdministrator;
    }

    return true;
  }

  prepareMenuLinks = (menuItems) => {
    const { settings, currentUser, demoModeEnabled, disabledFeatures } = this.props;

    return menuItems
      .map(item => ({
        ...item,
        link: item.getLink(settings, currentUser),
        subItems: this.prepareMenuLinks(item.subItems || []),
      }))
      .filter((item) => {
        if (demoModeEnabled && !item.availableForDemoMode) {
          return false;
        }
        return !item.feature || !disabledFeatures.includes(item.feature);
      })
      .filter(this.isAvailableForSegmentManager);
  }

  handleConfirmSurveyAlert = () => {
    const { history } = this.props;

    const route = buildRoute(Routes.Survey, { token: '' });
    history.push(route);

    this.setState({ isPerformSurveyAlertShown: false });
  }

  render() {
    const { isPerformSurveyAlertShown } = this.state;
    const { demoModeEnabled, selectedOrganizationID } = this.props;

    return (
      <React.Fragment>
        <GdprDialogContainer />
        <DemoModeHeaderContainer />

        <MobileHeaderContainer logo={this.getLogo(true)} />

        <Own.Container demoMode={demoModeEnabled}>
          <MainMenuContainer
            logo={this.getLogo(false)}
            items={this.mainMenu}
          />

          <PerformSurveyAlert isOpen={isPerformSurveyAlertShown} onConfirm={this.handleConfirmSurveyAlert} />

          <Own.Content demoModeEnabled={demoModeEnabled} ref={this.dashboardContent}>
            {
              this.availableRoutes.length &&
              <ErrorBoundary>
                <Switch key={selectedOrganizationID}>
                  {
                    this.availableRoutes.map(({ path, component, exact }, index) => (
                      <Route key={index} exact={exact} path={path} component={component} />
                    ))
                  }

                  <Route path="*" render={() => <Redirect to={Routes.Individual.Overview.Report} />} />
                  <Route exact path={Routes.Home} render={() => <Redirect to={Routes.Individual.Overview.Report} />} />
                </Switch>
              </ErrorBoundary>
            }
          </Own.Content>
        </Own.Container>
      </React.Fragment>
    );
  }
}

export { Dashboard };
