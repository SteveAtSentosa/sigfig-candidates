import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { actions } from 'store';

import { withTranslation } from 'utilities/decorators';
import { buildRoute } from 'utilities/router';
import { Routes } from 'Constants/index';
import {
  DefaultCustomSurveyFrequency,
  DefaultCustomSurveyFrequencyDuration,
} from 'Constants/Schedules';
import { immediateLaunch, scheduledLaunch, surveyScheduled } from 'images/custom-survey';

import { CustomSurveyTargetSelection } from 'Components/Survey';
import { FormActions, Loader, Modal, RoundedButtonIntent } from 'Components/Common';

import { ScheduleLaunchDate } from './ScheduleLaunchDate/ScheduleLaunchDate';
import * as Own from './SelectTargetAndLaunch.Components';

@withTranslation('CustomSurvey/SelectTargetAndLaunch')
class SelectTargetAndLaunch extends React.Component {
  state = {
    isScheduledOpen: false,
    isScheduleFormOpen: false,
    selectedSegmentIds: [],
    dateSettings: {
      startDate: moment(),
    },
    isLaunchSelectionOpen: false,
  }

  componentDidMount() {
    const { fetchCustomSurveyList } = this.props;

    fetchCustomSurveyList();
  }

  componentDidUpdate() {
    if (!this.survey) {
      return;
    }
    const { schedule } = this.survey;

    if (schedule) {
      const { targetFilter } = schedule;
      const { selectedSegmentIds: currentSelectedSegmentIds } = this.state;

      if (currentSelectedSegmentIds.length === 0 && targetFilter.length > 0) {
        this.setState({ selectedSegmentIds: targetFilter });
      }
    }
  }

  get survey() {
    const { customSurveyList, match } = this.props;
    const { params: { surveyID } } = match;

    return customSurveyList.find(({ id }) => id === Number(surveyID));
  }

  get formActions() {
    const { i18n, history } = this.props;
    return [
      {
        onClick: history.goBack,
        children: i18n.global('CustomSurveysPage.ActionButtons.CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleLaunchOpen,
        children: i18n.global('CustomSurveysPage.ActionButtons.LaunchButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];
  }

  getSchedule(dateSettings) {
    const { schedule } = this.survey;

    const { startDate: updatedStartDate, finalDate } = dateSettings;
    const startDate = Math.round(updatedStartDate.toDate() / 1000);
    const duration = moment(finalDate).diff(updatedStartDate, 'days');

    const { selectedSegmentIds: targetFilter } = this.state;

    if (schedule) {
      return {
        ...schedule,
        startDate,
        duration,
        targetFilter,
      };
    }

    const { name: surveyName } = this.survey;
    const { periodic, roundSplit } = DefaultCustomSurveyFrequency;
    const name = `Schedule for ${surveyName}`;

    return {
      name,
      periodic,
      roundSplit,
      targetFilter,
      startDate,
      duration,
      isActive: true,
      includeInOrgReport: false,
    };
  }

  navigateToCustomSurveyListPage = () => {
    const { history } = this.props;

    const route = buildRoute(Routes.Organization.CustomSurveys.List, {
      surveyStatus: 'active',
    });

    history.push(route);
  }

  handleLaunchOpen = () => this.setState({ isLaunchSelectionOpen: true });

  handleLaunch = async ({ schedule }) => {
    const { createOrganizationSchedule, updateOrganizationSchedule, activateCustomSurvey } = this.props;
    const { schedules, name, id, organization } = this.survey;

    const hasExistingSchedule = schedules.length > 0;
    let newSchedule;
    if (hasExistingSchedule) {
      const activatedSchedule = { ...schedule, isActive: true };

      newSchedule = await updateOrganizationSchedule(activatedSchedule);
    } else {
      const surveys = [id];
      newSchedule = await createOrganizationSchedule({
        ...schedule, name, organization, surveys, includeInOrgReport: true });
    }
    activateCustomSurvey({ surveyId: id, schedule: newSchedule });
  }

  handleLaunchImmediate = () => {
    const dateSettings = {
      startDate: moment(),
      finalDate: moment().add(DefaultCustomSurveyFrequencyDuration.weekCount * 7, 'days'),
    };
    this.setState({ isScheduledOpen: true, isLaunchSelectionOpen: false, dateSettings });

    const schedule = this.getSchedule(dateSettings);
    this.handleLaunch({ schedule });
  }

  handleLaunchScheduled = () => this.setState({
    isScheduleFormOpen: true,
    isLaunchSelectionOpen: false,
  });

  handleScheduledFormClose = () => this.setState({ isScheduleFormOpen: false });

  handleSegmentsSelected = selectedSegmentIds => this.setState({ selectedSegmentIds });

  handleAccessChange = (accessToSegmentsReport) => {
    const { updateCustomSurvey } = this.props;

    updateCustomSurvey({ ...this.survey, accessToSegmentsReport });
  }

  handleStartDateChange = (newStartDate) => {
    const { dateSettings } = this.state;
    const { duration } = dateSettings;

    this.setState({
      dateSettings: {
        ...dateSettings,
        startDate: newStartDate,
        finalDate: moment(newStartDate).add(duration.weekCount, 'weeks'),
      },
    });
  }

  handleLaunchSchedule = (dateSettings) => {
    const schedule = this.getSchedule(dateSettings);

    this.handleLaunch({ schedule }).then(() => {
      this.setState({ dateSettings, isScheduledOpen: true });
    });
  }

  handleLaunchClose = () => this.setState({ isLaunchSelectionOpen: false });

  render() {
    const { i18n } = this.props;
    const {
      dateSettings,
      isScheduledOpen,
      isScheduleFormOpen,
      selectedSegmentIds,
      isLaunchSelectionOpen,
    } = this.state;
    const { startDate } = dateSettings;

    if (!this.survey) {
      return <Loader />;
    }

    return (
      <>
        <CustomSurveyTargetSelection
          selectedSegmentIds={selectedSegmentIds}
          accessToSegmentsReport={this.survey.accessToSegmentsReport}
          onSegmentSelected={this.handleSegmentsSelected}
          onAccessChanged={this.handleAccessChange}
        />
        <FormActions actions={this.formActions} />
        <Modal
          isOpen={isLaunchSelectionOpen}
          onClose={this.handleLaunchClose}
          onClickOutside={this.handleLaunchClose}
        >
          <Own.LaunchSelectionTitle>{i18n('Launch.Title')}</Own.LaunchSelectionTitle>
          <Own.LaunchSelection>
            <Own.Launch
              icon={immediateLaunch}
              title={i18n('Launch.Immediate')}
              onClick={this.handleLaunchImmediate}
            />
            <Own.Separator text={i18n('Launch.Separator')} />
            <Own.Launch
              selected
              icon={scheduledLaunch}
              title={i18n('Launch.Scheduled')}
              onClick={this.handleLaunchScheduled}
            />
          </Own.LaunchSelection>
        </Modal>

        {startDate &&
          <Modal
            isOpen={isScheduledOpen}
            onClose={this.navigateToCustomSurveyListPage}
            onClickOutside={this.navigateToCustomSurveyListPage}
          >
            <Own.LaunchWrapper>
              <Own.LaunchImage source={surveyScheduled} />
              <Own.LaunchTitle>{i18n('Launched.Title')}</Own.LaunchTitle>
              <Own.LaunchText>{i18n('Launched.Description')}</Own.LaunchText>
              <Own.LaunchDateTime>{moment(startDate).format('YYYY-MM-DD H:mm')}</Own.LaunchDateTime>
            </Own.LaunchWrapper>
          </Modal>
        }

        <Modal
          isOpen={isScheduleFormOpen}
          onClose={this.handleScheduledFormClose}
          onClickOutside={this.handleScheduledFormClose}
        >
          <ScheduleLaunchDate
            startDate={this.survey.schedule && moment.unix(this.survey.schedule.startDate)}
            finalDate={this.survey.schedule &&
            moment.unix(this.survey.schedule.startDate).add(this.survey.schedule.duration, 'days')}
            onSubmit={this.handleLaunchSchedule}
            onCancel={this.handleScheduledFormClose}
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ organizations, survey }) => {
  const { customSurveyList } = survey;
  const {
    organizationScheduleToEdit: schedule,
  } = organizations;

  return {
    schedule,
    customSurveyList,
  };
};

const ConnectedSelectTargetAndLaunch =
  connect(mapStateToProps, {
    ...actions.users,
    ...actions.survey,
    ...actions.organizations,
  })(SelectTargetAndLaunch);

export { ConnectedSelectTargetAndLaunch as SelectTargetAndLaunch };
