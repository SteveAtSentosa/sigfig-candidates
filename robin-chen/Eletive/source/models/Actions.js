import { shape, arrayOf, string, number, bool } from 'prop-types';

export const ObjectiveKeyResult = shape({
  name: string,
  type: number,
  currency: string,
  value: number,
  minValue: number,
  maxValue: number,
});

export const ObjectiveKeyResultList = arrayOf(ObjectiveKeyResult);

export const Objective = shape({
  id: number,
  name: string,
  description: string,
  organization: number,
  parent: number,
  driver: number,
  subject: string,
  subjectType: number,
  isPublic: bool,
  status: number,
  startAt: number,
  endAt: number,
  createdAt: number,
  isWriteAccess: bool,
  objectiveKeys: ObjectiveKeyResultList,
});

export const ObjectiveList = arrayOf(Objective);
