import moment from 'moment';

import { Currencies, Actions as Constants } from 'Constants/index';
import { getSegmentUrlID, getTargetByUrl, Targets } from 'utilities/reports';

const getSubjectAndType = (match) => {
  const segmentId = getSegmentUrlID(match);
  const target = getTargetByUrl(match);
  if (target === Targets.Segments) {
    return { subject: segmentId, subjectType: Constants.ObjectiveSubjectTypes.Segment };
  }

  if (target === Targets.Organization) {
    return { subject: null, subjectType: Constants.ObjectiveSubjectTypes.Organization };
  }

  return { subjectType: Constants.ObjectiveSubjectTypes.User };
};

export const getEmptyObjective = (match, selectedOrganizationID) => {
  const { subject, subjectType } = getSubjectAndType(match);
  const { currency } = Currencies[0];

  return {
    name: '',
    description: '',
    organization: selectedOrganizationID,
    subject,
    subjectType,
    driver: null,
    isPublic: true,
    status: null,
    parent: null,
    objectiveKeys: [{
      id: 1,
      name: '',
      type: 0,
      currency,
      value: 0,
      minValue: 0,
      maxValue: 100,
    }],
    startAt: moment().quarter(moment().quarter()).startOf('quarter').unix(),
    endAt: moment().quarter(moment().quarter()).endOf('quarter').unix(),
  };
};
