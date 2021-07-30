import React from 'react';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import Media from 'react-media';

import { ScreenSizes } from 'utilities/common';
import { withTranslation } from 'utilities/decorators';
import { getTargetByUrl, Targets } from 'utilities/reports';

import { Routes } from 'Constants';
import Constants from 'Constants/Actions';
import * as Models from 'Models';

import { SectionHeader } from 'Components';
import {
  IntroSplash,
  Tabs,
  FormGroup,
  SectionActionButton,
  SingleSelect as Select,
  PageContainer,
  PageContent,
} from 'Components/Common';
import { ObjectiveForm, ObjectiveList, ObjectiveDate, SublevelList } from 'Components/Actions';
import Statistics from 'Components/Actions/Statistics/Statistics';
import { SegmentSelector } from 'Components/Attributes';
import { actionsStart } from 'images/actions';
import { filledCircleIcon, addIcon } from 'images/icons/common';

import * as OwnComponents from './ActionsPage.Components';

@withTranslation('OrganizationActions')
class ActionsPage extends React.PureComponent {
  static propTypes = {
    isCurrentUserOwner: PropTypes.bool,
    isCurrentUserAdministrator: PropTypes.bool,
    screenSize: PropTypes.number,
    breadcrumbs: Models.Common.BreadcrumbList.isRequired,
    currentUser: PropTypes.oneOfType([Models.User.User, Models.User.CurrentUser]),
    objectives: PropTypes.arrayOf(Models.Actions.Objective),
    driverList: Models.Survey.DriverList,
    userList: Models.User.UserList,
    attributeList: Models.Attribute.AttributeList,
    language: PropTypes.string,
    selectedOrganizationID: PropTypes.number,
    createObjective: PropTypes.func,
    onObjectiveCreate: PropTypes.func.isRequired,
    onObjectiveEdit: PropTypes.func.isRequired,
    onObjectiveSave: PropTypes.func,
    onSegmentSelect: PropTypes.func.isRequired,
  }

  state = {
    selectedTabId: 1,
    filterObjectiveDateRange: [
      moment().quarter(moment().quarter()).startOf('quarter'),
      moment().quarter(moment().quarter()).endOf('quarter'),
    ],
    filterStatus: null,
  }

  get isMobile() {
    const { screenSize } = this.props;
    return screenSize < ScreenSizes.lg;
  }

  get urlSegmentID() {
    const { match } = this.props;
    const { params: { segmentID } } = match;
    return segmentID;
  }

  get isListView() {
    const { history } = this.props;
    const { location } = history;
    const parsedUrl = location.pathname.split('/');

    return parsedUrl[parsedUrl.length - 1] === 'list';
  }

  get headerBreadcrumbs() {
    const { breadcrumbs, i18n } = this.props;

    return breadcrumbs.map(({ name, route }) => ({ name: i18n(name), route }));
  }

  get filteredObjectives() {
    const { objectives } = this.props;

    return objectives.filter(objective => this.filterObjective(objective));
  }

  get filteredObjectivesMain() {
    const { objectives, currentUser, match } = this.props;
    const currentUserId = `${currentUser.id}`;
    const target = getTargetByUrl(match);
    const segmentID = this.urlSegmentID;
    return objectives.filter((e) => {
      if (target === Targets.Individual) {
        if (e.subjectType !== Constants.ObjectiveSubjectTypes.User || e.subject !== currentUserId) {
          return false;
        }
      }
      if (target === Targets.Segments) {
        if (e.subjectType !== Constants.ObjectiveSubjectTypes.Segment || e.subject !== segmentID) {
          return false;
        }
      } else if (target === Targets.Organization) {
        if (e.subjectType !== Constants.ObjectiveSubjectTypes.Organization) {
          return false;
        }
      }

      return this.filterObjective(e);
    });
  }

  get filteredObjectivesSub() {
    const { objectives } = this.props;
    const segmentID = this.urlSegmentID;

    return objectives.filter((e) => {
      if (segmentID) {
        if (e.subjectType !== Constants.ObjectiveSubjectTypes.User) {
          return false;
        }
      } else if (e.subjectType !== Constants.ObjectiveSubjectTypes.Segment) {
        return false;
      }

      return this.filterObjective(e);
    });
  }

  filterSegmentList = (segmentList) => {
    const {
      currentUser: { manageSegments },
      isCurrentUserOwner,
      isCurrentUserAdministrator,
    } = this.props;

    if (isCurrentUserOwner || isCurrentUserAdministrator) {
      return segmentList;
    }

    return segmentList
      .filter(({ id }) => manageSegments.some(({ segment }) => segment === id));
  }

  handleFilterDateChange = (filterObjectiveDateRange) => {
    this.setState({ filterObjectiveDateRange });
  }

  renderSegmentSelector = () => {
    const { onSegmentSelect } = this.props;
    return this.urlSegmentID && (
      <SegmentSelector
        singleSelectionMode
        selectFirstSegmentByDefault
        key="1"
        fillContainer={this.isMobile}
        popoverAlign={this.isMobile ? 'center' : 'end'}
        filterSegmentList={this.filterSegmentList}
        selectedSegmentIds={[this.urlSegmentID]}
        onChange={onSegmentSelect}
      />
    );
  }

  renderActionsList = () => {
    const { objectives, i18n, attributeList, userList, onObjectiveEdit, match } = this.props;
    const { selectedTabId, filterObjectiveDateRange, filterStatus } = this.state;

    const isStatisticsTab = selectedTabId === 3;
    if (objectives.length === 0) {
      return (
        <IntroSplash title={i18n('StartMessage')} icon={actionsStart} />
      );
    }

    const target = getTargetByUrl(match);

    const tabs = [
      { id: 1, title: i18n('Tabs.Objectives') },
      { id: 3, title: i18n('Tabs.Statistics') },
    ];

    if (target !== Targets.Individual) {
      tabs.splice(1, 0,
        { id: 2, title: this.urlSegmentID ? i18n('Tabs.Employees') : i18n('Tabs.Segments') });
    }

    const statusItems = [
      {
        id: -1,
        title: i18n('Filter.Statuses.all'),
      },
      {
        id: null,
        title: i18n('Filter.Statuses.NoStatus'),
        icon: <OwnComponents.GreyCircle source={filledCircleIcon} /> },
      {
        id: 0,
        title: i18n('Filter.Statuses.onTrack'),
        icon: <OwnComponents.GreenCircle source={filledCircleIcon} /> },
      {
        id: 1,
        title: i18n('Filter.Statuses.Behind'),
        icon: <OwnComponents.YellowCircle source={filledCircleIcon} /> },
      {
        id: 2,
        title: i18n('Filter.Statuses.AtRisk'),
        icon: <OwnComponents.RedCircle source={filledCircleIcon} /> },
    ];

    const selectedStatus = filterStatus || statusItems[0];

    return (
      <>
        <OwnComponents.TabsContainer>
          <Tabs
            tabs={tabs}
            selectedTabId={selectedTabId}
            onChange={this.handleTabChange}
          />
        </OwnComponents.TabsContainer>

        <OwnComponents.FilterContainer>
          <OwnComponents.ObjectiveDateWrap isFullWidth={isStatisticsTab}>
            <ObjectiveDate
              label={i18n('Filter.ObjectiveDate.Label')}
              value={filterObjectiveDateRange}
              isFullWidth={isStatisticsTab}
              onChange={this.handleFilterDateChange}
            />
          </OwnComponents.ObjectiveDateWrap>
          {
            !isStatisticsTab && (
              <OwnComponents.StatusFilterWrap>
                <FormGroup label={i18n('Filter.Status.Label')}>
                  <Select
                    items={statusItems}
                    activeItem={selectedStatus}
                    itemRenderer={item => (
                      <>
                        {item.icon}
                        {item.title}
                      </>
                    )}
                    onItemSelect={this.handleChangeStatusFilter}
                  />
                </FormGroup>
              </OwnComponents.StatusFilterWrap>
            )
          }
        </OwnComponents.FilterContainer>

        {selectedTabId === 1 &&
        <ObjectiveList
          objectives={objectives}
          showObjectives={this.filteredObjectivesMain}
          onObjectiveEdit={onObjectiveEdit}
        />
        }

        {selectedTabId === 2 &&
        <SublevelList
          isEmployees={!!this.urlSegmentID}
          objectives={objectives}
          attributeList={attributeList}
          userList={userList}
          showObjectives={this.filteredObjectivesSub}
        />
        }

        {isStatisticsTab &&
        <Statistics
          objectives={objectives}
          filteredObjectives={this.filteredObjectives}
          filteredObjectivesMain={this.filteredObjectivesMain}
          userList={userList}
          attributeList={attributeList}
          segmentList={this.segmentList}
          isOrganization={target === Targets.Organization}
          segmentID={this.urlSegmentID}
        />
        }
      </>
    );
  }

  renderActionForm = () => {
    const { objectives, currentUser, onObjectiveSave } = this.props;

    return (
      <ObjectiveForm
        {...this.props}
        currentUser={currentUser}
        objectiveList={objectives}
        onSubmit={onObjectiveSave}
      />
    );
  }

  renderMainActions = () => {
    const { i18n } = this.props;
    const actions = [];

    const hasSegmentSelector = this.urlSegmentID && !this.isMobile;
    if (hasSegmentSelector) {
      actions.push(this.renderSegmentSelector());
    }

    if (this.isListView) {
      const mediaQueryWithSegmentSelector = '(min-width: 1025px) and (max-width: 1279px)';
      const mediaQueryDefault = '(min-width: 768px) and (max-width: 900px)';
      const inline =
        hasSegmentSelector ?
          [mediaQueryWithSegmentSelector, mediaQueryDefault].join(',')
          :
          mediaQueryDefault;

      const actionButton = (
        <SectionActionButton
          key="2"
          title={i18n('ActionButtons.CreateObjective')}
          onClick={this.handleCreateObjectiveClick}
        />
      );

      const iconOnlyButton = (
        <OwnComponents.PlusCircle
          source={addIcon}
          onClick={this.handleCreateObjectiveClick}
        />
      );

      actions.push(
        <Media key="2" queries={{ inline }}>
          {
            matches => (matches.inline ? iconOnlyButton : actionButton)
          }
        </Media>,
      );
    }
    return actions;
  }

  renderSecondRowActions = () => {
    if (this.urlSegmentID && this.isMobile) {
      return this.renderSegmentSelector();
    }
    return null;
  }

  handleCreateObjectiveClick = () => {
    const { onObjectiveCreate } = this.props;
    onObjectiveCreate();
  }

  handleTabChange = (selectedTabId) => {
    this.setState({ selectedTabId });
  }

  handleChangeStatusFilter = (filterStatus) => {
    this.setState({ filterStatus });
  }

  filterObjective(e) {
    const { filterObjectiveDateRange: [filterStart, filterEnd], filterStatus, selectedTabId } = this.state;
    const isStatisticsTab = selectedTabId === 3;

    if (filterStart && filterEnd) {
      if (filterStart.isAfter(moment.unix(e.endAt), 'day') ||
        (filterEnd && filterEnd.isBefore(moment.unix(e.endAt), 'day')) ||
        (filterEnd && filterEnd.isBefore(moment.unix(e.startAt), 'day'))) {
        return false;
      }
    }
    if (!isStatisticsTab && filterStatus && filterStatus.id !== -1 && e.status !== filterStatus.id) {
      return false;
    }
    return true;
  }

  render() {
    const { i18n } = this.props;

    return (
      <PageContainer>
        <SectionHeader
          title={i18n('PageTitle')}
          breadcrumbItems={this.headerBreadcrumbs}
          actions={this.renderMainActions()}
          secondaryActions={this.renderSecondRowActions()}
        />

        <PageContent>
          <Switch>
            <Route
              exact
              path={Routes.Organization.Actions.List}
              render={this.renderActionsList}
            />

            <Route
              exact
              path={Routes.Organization.Actions.Create}
              render={this.renderActionForm}
            />

            <Route
              exact
              path={Routes.Organization.Actions.Edit}
              render={this.renderActionForm}
            />

            <Route
              exact
              path={Routes.Segments.Actions.List}
              render={this.renderActionsList}
            />

            <Route
              exact
              path={Routes.Segments.Actions.Create}
              render={this.renderActionForm}
            />

            <Route
              exact
              path={Routes.Segments.Actions.Edit}
              render={this.renderActionForm}
            />

            <Route
              exact
              path={Routes.Individual.Actions.List}
              render={this.renderActionsList}
            />

            <Route
              exact
              path={Routes.Individual.Actions.Create}
              render={this.renderActionForm}
            />

            <Route
              exact
              path={Routes.Individual.Actions.Edit}
              render={this.renderActionForm}
            />
          </Switch>
        </PageContent>
      </PageContainer>
    );
  }
}

export { ActionsPage };
