import { Routes, Features } from 'Constants';

import {
  OrganizationsPage,
  SchedulesPage,
  UsersPage,
  AttributesPage,
  QuestionsPage,
  FeaturesPage,
  OneOnOnesSettingsPage,
  GeneralPage,
} from 'Pages/Settings';
import { UserPage } from 'Pages/User';
import { CustomSurveysPage } from 'Pages/CustomSurveys';
import { ActionsPage } from 'Pages/Actions';
import { CommentsPage } from 'Pages/Comments';
import { OneOnOnesPage } from 'Pages/OneOnOnes';

import {
  IndividualReportPage,
  IndividualDriverReportPage,
  SegmentReportPage,
  SegmentDriverReportPage,
  OrganizationalReportPage,
  OrganizationalDriverReportPage,
  OrganizationalReportHeatmapPage,
} from 'Pages/Reports';


// TODO:
// write tests (based on Cypress) for routing to test
// routes availability for users with different roles
export default [
  {
    path: Routes.Individual.Overview.Report,
    component: IndividualReportPage,
    exact: true,
  },
  {
    path: Routes.Individual.Overview.DriverReport,
    component: IndividualDriverReportPage,
    exact: true,
  },
  {
    path: Routes.Individual.OneOnOnes.Base,
    component: OneOnOnesPage,
    exact: false,
    feature: Features.OneOnOnes,
  },
  {
    path: Routes.Individual.Actions.Base,
    component: ActionsPage,
    exact: false,
    feature: Features.Actions,
  },
  {
    path: Routes.Individual.Comments.Base,
    component: CommentsPage,
    exact: true,
    feature: Features.Comments,
  },
  {
    path: Routes.Segments.Overview.Report,
    component: SegmentReportPage,
    exact: true,
  },
  {
    path: Routes.Segments.Overview.ReportFilter,
    component: SegmentReportPage,
    exact: true,
  },
  {
    path: Routes.Segments.Overview.DriverReport,
    component: SegmentDriverReportPage,
    exact: true,
  },
  {
    path: Routes.Segments.Overview.DriverFilterReport,
    component: SegmentDriverReportPage,
    exact: true,
  },
  {
    path: Routes.Segments.CustomSurveys.List,
    component: CustomSurveysPage,
    exact: false,
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Segments.CustomSurveys.Base,
    component: CustomSurveysPage,
    exact: true,
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Segments.CustomSurveys.Report,
    component: CustomSurveysPage,
    exact: false,
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Segments.Actions.Base,
    component: ActionsPage,
    exact: false,
    feature: Features.Actions,
  },
  {
    path: Routes.Segments.Comments.Base,
    component: CommentsPage,
    exact: true,
    feature: Features.Comments,
  },

  {
    path: Routes.Organization.Overview.Report,
    component: OrganizationalReportPage,
    exact: true,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
  },
  {
    path: Routes.Organization.Heatmap.Base,
    component: OrganizationalReportHeatmapPage,
    exact: true,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
  },
  {
    path: Routes.Organization.Overview.DriverReport,
    component: OrganizationalDriverReportPage,
    exact: true,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
  },
  {
    path: Routes.User,
    component: UserPage,
    exact: false,
  },
  {
    path: Routes.Organization.CustomSurveys.Base,
    component: CustomSurveysPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Organization.CustomSurveys.Edit,
    component: CustomSurveysPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Organization.CustomSurveys.Target,
    component: CustomSurveysPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Organization.CustomSurveys.Report,
    component: CustomSurveysPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    feature: Features.CustomSurveys,
  },
  {
    path: Routes.Organization.Actions.Base,
    component: ActionsPage,
    exact: false,
    feature: Features.Actions,
  },
  {
    path: Routes.Organization.Comments.Base,
    component: CommentsPage,
    exact: true,
    feature: Features.Comments,
  },
  {
    path: Routes.Settings.Organizations.List,
    component: OrganizationsPage,
    exact: false,
    availableRoles: ['Owners'],
  },
  {
    path: Routes.Settings.Schedules.List,
    component: SchedulesPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.Users.List,
    component: UsersPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.Attributes.Base,
    component: AttributesPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.Questions,
    component: QuestionsPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.Features,
    component: FeaturesPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.OneOnOnes.List,
    component: OneOnOnesSettingsPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
  {
    path: Routes.Settings.General,
    component: GeneralPage,
    exact: false,
    availableRoles: ['Owners', 'Administrators'],
  },
];
