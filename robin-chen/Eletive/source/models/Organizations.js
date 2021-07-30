import _ from 'lodash';
import moment from 'moment';
import { shape, string, number, bool, oneOf, arrayOf, instanceOf } from 'prop-types';
import { OrganizationSizes, OrganizationIndustries } from 'Constants';

const OrganizationConstants = {
  Sizes: _.values(OrganizationSizes),
  Industries: _.values(OrganizationIndustries),
};

export const Organization = shape({
  id: number.isRequired,
  name: string.isRequired,
  logo: string,
  isActive: bool,
  deactivationDate: number,
  size: oneOf(OrganizationConstants.Sizes).isRequired,
  industry: oneOf(OrganizationConstants.Industries).isRequired,
  maxUserCount: number,
  minSegmentSize: number,
  disabledFeatures: arrayOf(number),
  userCount: number,
});

export const OrganizationList = arrayOf(Organization);

export const OrganizationScheduleStatistic = shape({
  lastReminder: number,
  nextReminder: number,
  totalUserCount: number,
  activeUserCount: number,
  currentSendoutStart: number,
  currentSendoutEnd: number,
  currentSendoutNumber: number,
  nextSendoutStart: number,
});

export const OrganizationSchedule = shape({
  id: number.isRequired,
  isActive: bool.isRequired,
  organization: number.isRequired,
  name: string,
  startDate: number.isRequired,
  periodic: number.isRequired,
  duration: number.isRequired,
  roundSplit: number.isRequired,
  targetFilter: arrayOf(string),
  includeInOrgReport: bool,
  statistic: OrganizationScheduleStatistic.isRequired,
});

export const OrganizationScheduleList = arrayOf(OrganizationSchedule);

export const SurveyDuration = shape({
  title: string.isRequired,
  weekCount: number.isRequired,
  default: bool,
});

export const SurveyDurationList = arrayOf(SurveyDuration);

export const SurveyDateSettings = shape({
  startDate: instanceOf(moment),
  finalDate: instanceOf(moment),
  duration: SurveyDuration.isRequired,
});

export const SurveyFrequency = shape({
  id: number.isRequired,
  title: string.isRequired,
  isPulse: bool,
  performTime: number.isRequired,
  questionCountPerSurvey: number.isRequired,
  durations: SurveyDurationList.isRequired,
});

export const SurveyFrequencyList = arrayOf(SurveyFrequency);

export const SurveyGeneralSettings = shape({
  name: string.isRequired,
  targetFilter: arrayOf(string).isRequired,
  includeInOrgReport: bool.isRequired,
});
