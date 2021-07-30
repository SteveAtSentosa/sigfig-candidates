import moment from 'moment';
import { shape, bool, string, number, arrayOf, instanceOf } from 'prop-types';

export const UserAttribute = shape({
  id: number.isRequired,
  value: number.isRequired,
});

export const UserAttributeList = arrayOf(UserAttribute);

const ManageSegment = shape({
  attribute: number.isRequired,
  segment: string.isRequired,
});

export const User = shape({
  id: number.isRequired,
  bounced: bool,
  name: string,
  firstName: string.isRequired,
  lastName: string.isRequired,
  email: string.isRequired,
  role: string,
  organization: number,
  lastSigninDate: instanceOf(moment),
  lastSurveyFinishedDate: instanceOf(moment),
  attributes: UserAttributeList,
  manageSegments: arrayOf(ManageSegment),
});

export const UserList = arrayOf(User);

export const CurrentUser = shape({
  id: number.isRequired,
  role: string.isRequired,
  email: string.isRequired,
  organization: number.isRequired,
  isMFAEnabled: bool,
});

export const MinimalUser = shape({
  isCurrentUser: bool.isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
});
