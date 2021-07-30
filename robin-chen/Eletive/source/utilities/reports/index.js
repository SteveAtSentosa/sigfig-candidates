import _ from 'lodash';
import { Routes } from 'Constants/index';

export const Targets = {
  Individual: 1,
  Segments: 2,
  Organization: 3,
};

// TODO use window.location.pathname instead of match.path
export const getTargetByUrl = (match) => {
  if (match.path.includes(Routes.Individual.Base)) {
    return Targets.Individual;
  }
  if (match.path.includes(Routes.Segments.Base)) {
    return Targets.Segments;
  }
  if (match.path.includes(Routes.Organization.Base)) {
    return Targets.Organization;
  }
  throw new Error('Wrong route');
};

export const getSegmentUrlID = (match) => {
  const { segmentID } = match.params;

  if (_.isNil(segmentID)) {
    return null;
  }

  return segmentID;
};

export const getSegmentFilterUrl = (match) => {
  const { filterSegment } = match.params;

  if (_.isNil(filterSegment)) {
    return [];
  }
  return filterSegment.split(',').filter(e => e);
};

export const getSurveyUrlID = (match) => {
  const { surveyID } = match.params;
  const surveyIDAsNumber = Number(surveyID);

  if (_.isNil(surveyIDAsNumber) || _.isNaN(surveyIDAsNumber)) {
    return null;
  }

  return surveyIDAsNumber;
};

export * from './charts';
