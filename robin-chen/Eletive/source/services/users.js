import _ from 'lodash';
import moment from 'moment';

import { getSegmentList, areSegmentsEqual } from 'services/attributes';

export const getManagerListBySegment = (userList, segment) => {
  if (!segment || !userList.length) {
    return [];
  }

  return segment.managers
    .map(managerID => (userList.find(user => user.id === managerID)))
    .filter(e => !!e);
};

export const isUserTargetedWithSegment = (attribute, segment) => (user) => {
  const userAttribute = _.find(user.attributes, ({ id }) => id === attribute.id);

  if (!userAttribute) {
    return false;
  }

  if (attribute.type === 0) {
    return userAttribute.value === segment.value;
  }

  let value;

  if (attribute.type === 1) {
    value = Date.now() / 1000 - userAttribute.value;
  } else {
    ({ value } = userAttribute);
  }

  if (segment.value === null && value < segment.valueUpTo) {
    return true;
  }
  if (segment.valueUpTo === null && value >= segment.value) {
    return true;
  }
  return value >= segment.value && value < segment.valueUpTo;
};

export const getUserListBySegment = (userList, attribute, segment) => {
  if (!segment) {
    return [];
  }

  return userList.filter(isUserTargetedWithSegment(attribute, segment));
};

export const getUserListBySegmentList = (userList, attributeList, segmentList) => {
  const allAttributeListSegmentList = getSegmentList(attributeList, true);

  const filteredSegmentList = _.intersectionWith(
    segmentList,
    allAttributeListSegmentList,
    (firstSegment, secondSegment) => areSegmentsEqual(firstSegment, secondSegment),
  );

  return filteredSegmentList.reduce((users, segment) => (
    _.union(users, getUserListBySegment(userList, segment.attribute, segment))
  ), []);
};

export const isCurrentSendoutActive = (user, scheduleList, attributeList) => {
  const isActiveSchedule = (schedule) => {
    const { statistic } = schedule;
    const { currentSendoutStart, currentSendoutEnd } = statistic;

    if (currentSendoutStart === null || currentSendoutEnd === null) {
      return false;
    }

    const currentSendoutStartDate = moment.unix(currentSendoutStart);
    const currentSendoutEndDate = moment.unix(currentSendoutEnd);

    if (moment().isBetween(currentSendoutStartDate, currentSendoutEndDate)) {
      return true;
    }

    return false;
  };

  const isUserTargetedWithSchedule = (schedule) => {
    if (schedule.targetFilter.length === 0) {
      return true;
    }

    const segmentList = getSegmentList(attributeList, true);
    const scheduleSegmentList = segmentList.filter(segment => _.includes(schedule.targetFilter, segment.id));

    return scheduleSegmentList.some(segment => isUserTargetedWithSegment(segment.attribute, segment)(user));
  };

  return scheduleList
    .filter(isActiveSchedule)
    .filter(isUserTargetedWithSchedule)
    .length > 0;
};

export const getTargetFilterUserCountFromSegments = (selectedSegments, userList) => {
  if (selectedSegments.length === 0) {
    return userList.length;
  }
  const targetFilterUserList = selectedSegments.reduce((users, segment) => (
    _.union(users, getUserListBySegment(userList, segment.attribute, segment))
  ), []);
  return targetFilterUserList.length;
};

export const getTargetFilterUserCount = (targetFilter, userList, attributeList) => {
  if (targetFilter.length === 0) {
    return userList.length;
  }

  const segmentList = getSegmentList(attributeList, true);
  const filterSegmentList = segmentList.filter(segment => _.includes(targetFilter, segment.id));

  const targetFilterUserList = filterSegmentList.reduce((users, segment) => (
    _.union(users, getUserListBySegment(userList, segment.attribute, segment))
  ), []);
  return targetFilterUserList.length;
};
