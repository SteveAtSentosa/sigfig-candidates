import { shape, bool, string, number, arrayOf } from 'prop-types';
import { I18Content } from 'Models/Common';


export const Point = shape({
  pointText: string.isRequired,
  updatedAt: number.isRequired,
  byInitiator: bool.isRequired,
  isEnded: bool.isRequired,
});

export const PointList = arrayOf(Point);

export const MinimalUser = shape({
  id: number,
  firstName: string.isRequired,
  lastName: string.isRequired,
  isCurrentUser: bool.isRequired,
});

export const OneOnOne = shape({
  id: number.isRequired,
  userInitiator: MinimalUser,
  userParticipant: MinimalUser,
  scheduledTS: number.isRequired,
  talkingPoints: PointList,
  todoPoints: PointList,
  notes: string,
  privateNotes: string,
  isEnded: bool.isRequired,
  updatedAt: number,
  updatedByInitiator: bool,
});

export const OneOnOneList = arrayOf(OneOnOne);

export const OneOnOneTemplate = shape({
  id: number.isRequired,
  name: I18Content.isRequired,
  talkingPoints: arrayOf(I18Content.isRequired),
  user: MinimalUser,
  createdAt: number,
  isCommon: bool,
});

export const OneOnOneTemplateList = arrayOf(OneOnOneTemplate);
