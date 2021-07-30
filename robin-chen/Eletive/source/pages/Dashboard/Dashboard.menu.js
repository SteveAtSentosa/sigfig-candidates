import { buildRoute } from 'utilities/router';
import { Routes, Features } from 'Constants';

import {
  overviewIcon,
  oneOnOnesIcon,
  actionsIcon,
  commentsIcon,
  customSurveysIcon,
  heatmapIcon,
  dashboardIcon,
  organizationIcon,
  settingsIcon,
  helpIcon,
} from 'images/icons/menu';

import {
  userIcon,
  scheduleIcon,
  featureIcon,
  starIcon,
  itemsIcon,
  segmentsIcon,
} from 'images/icons/common';

const getRoutes = object => Object.keys(object).map(k => object[k]);

const individualSubMenu = [
  {
    name: 'ReportOverview',
    getLink: () => Routes.Individual.Overview.Report,
    selectedOnRoutes: getRoutes(Routes.Individual.Overview),
    icon: overviewIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: true,
    subItems: [],
  },
  {
    name: 'OneOnOnes',
    getLink: () => Routes.Individual.OneOnOnes.Base,
    selectedOnRoutes: getRoutes(Routes.Individual.OneOnOnes),
    icon: oneOnOnesIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    feature: Features.OneOnOnes,
  },
  {
    name: 'Actions',
    getLink: () => Routes.Individual.Actions.Base,
    selectedOnRoutes: getRoutes(Routes.Individual.Actions),
    icon: actionsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    feature: Features.Actions,
  },
  {
    name: 'Comments',
    getLink: () => Routes.Individual.Comments.Base,
    selectedOnRoutes: getRoutes(Routes.Individual.Comments),
    icon: commentsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    feature: Features.Comments,
  },
];

const segmentReportSelectedSegmentId =
  settings => settings.segmentReportSelectedSegment && settings.segmentReportSelectedSegment.id;

const segmentSubMenu = [
  {
    name: 'ReportOverview',
    getLink: settings => (
      buildRoute(Routes.Segments.Overview.Report, { segmentID: segmentReportSelectedSegmentId(settings) || '' })
    ),
    selectedOnRoutes: getRoutes(Routes.Segments.Overview),
    icon: overviewIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: true,
  },
  {
    name: 'ReportCustomSurveyOverview',
    getLink: settings => (
      buildRoute(Routes.Segments.CustomSurveys.Base,
        { segmentID: segmentReportSelectedSegmentId(settings) || '_' })
    ),
    selectedOnRoutes: getRoutes(Routes.Segments.CustomSurveys),
    icon: customSurveysIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    feature: Features.CustomSurveys,
  },
  {
    name: 'Actions',
    getLink: settings => (
      buildRoute(Routes.Segments.Actions.Base, {
        segmentID: segmentReportSelectedSegmentId(settings) || '_',
      })
    ),
    selectedOnRoutes: getRoutes(Routes.Segments.Actions),
    icon: actionsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    availableForSegmentManager: true,
    feature: Features.Actions,
  },
  {
    name: 'Comments',
    getLink: settings => (
      buildRoute(Routes.Segments.Comments.Base, {
        segmentID: segmentReportSelectedSegmentId(settings) || '',
      })
    ),
    selectedOnRoutes: getRoutes(Routes.Segments.Comments),
    icon: commentsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: false,
    availableForSegmentManager: true,
    feature: Features.Comments,
  },
];

const organizationSubMenu = [
  {
    name: 'ReportOverview',
    getLink: () => (Routes.Organization.Overview.Report),
    selectedOnRoutes: getRoutes(Routes.Organization.Overview),
    icon: overviewIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: true,
  },
  {
    name: 'OrganizationReportHeatmap',
    getLink: () => (Routes.Organization.Heatmap.Base),
    selectedOnRoutes: getRoutes(Routes.Organization.Heatmap),
    icon: heatmapIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: true,
  },
  {
    name: 'ReportCustomSurveyOverview',
    getLink: () => (Routes.Organization.CustomSurveys.Base),
    selectedOnRoutes: getRoutes(Routes.Organization.CustomSurveys),
    icon: customSurveysIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: false,
    feature: Features.CustomSurveys,
  },
  {
    name: 'Actions',
    getLink: () => (Routes.Organization.Actions.Base),
    selectedOnRoutes: getRoutes(Routes.Organization.Actions),
    icon: actionsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: false,
    feature: Features.Actions,
  },
  {
    name: 'Comments',
    getLink: () => (Routes.Organization.Comments.Base),
    selectedOnRoutes: getRoutes(Routes.Organization.Comments),
    icon: commentsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: false,
    feature: Features.Comments,
  },
];

const settingSubMenu = [
  {
    name: 'Organizations',
    getLink: () => Routes.Settings.Organizations.List,
    icon: organizationIcon,
    availableRoles: ['Owners'],
    availableForDemoMode: true,
  },
  {
    name: 'Schedules',
    getLink: () => Routes.Settings.Schedules.List,
    icon: scheduleIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'Users',
    getLink: () => Routes.Settings.Users.List,
    selectedOnRoutes: getRoutes(Routes.Settings.Users),
    icon: userIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'Attributes',
    getLink: () => Routes.Settings.Attributes.Base,
    selectedOnRoutes: getRoutes(Routes.Settings.Attributes),
    icon: itemsIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'Questions',
    getLink: () => Routes.Settings.Questions,
    icon: helpIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'Features',
    getLink: () => Routes.Settings.Features,
    icon: featureIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'OneOnOnes',
    getLink: () => Routes.Settings.OneOnOnes.List,
    selectedOnRoutes: getRoutes(Routes.Settings.OneOnOnes),
    icon: oneOnOnesIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
  {
    name: 'General',
    getLink: () => Routes.Settings.General,
    icon: starIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: true,
  },
];

export default [
  {
    name: 'IndividualReport',
    getLink: () => Routes.Individual.Overview.Report,
    icon: dashboardIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: true,
    subItems: individualSubMenu,
  },
  {
    name: 'SegmentReport',
    getLink: settings => (
      buildRoute(Routes.Segments.Overview.Report, { segmentID: segmentReportSelectedSegmentId(settings) || '' })
    ),
    icon: segmentsIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts', 'Users'],
    availableForDemoMode: true,
    subItems: segmentSubMenu,
  },
  {
    name: 'OrganizationReport',
    getLink: () => (Routes.Organization.Overview.Report),
    icon: organizationIcon,
    availableRoles: ['Owners', 'Administrators', 'Analysts'],
    availableForDemoMode: true,
    subItems: organizationSubMenu,
  },
  {
    name: 'Settings',
    getLink: (settings, currentUser) => (
      currentUser.role === 'Owners' ? Routes.Settings.Organizations.List : Routes.Settings.Attributes.Base
    ),
    icon: settingsIcon,
    availableRoles: ['Owners', 'Administrators'],
    availableForDemoMode: false,
    subItems: settingSubMenu,
  },
];
