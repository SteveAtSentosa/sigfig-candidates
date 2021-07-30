import { shape, string, number, bool, arrayOf, objectOf } from 'prop-types';

export const Segment = shape({
  name: string.isRequired,
  value: number,
  valueUpTo: number,
  userCount: number,
  managers: arrayOf(number),
  managersCount: number,
  childSegments: arrayOf(string),
});

export const SegmentList = arrayOf(Segment);

export const Attribute = shape({
  id: number.isRequired,
  name: string.isRequired,
  organization: number.isRequired,
  type: number.isRequired,
  reportToMembers: bool,
  segments: arrayOf(Segment),
  allowAsFilterInReport: bool.isRequired,
});

export const AttributeList = arrayOf(Attribute);

export const ExtendedSegment = shape({
  id: string,
  name: string.isRequired,
  value: number,
  valueUpTo: number,
  managers: arrayOf(number),
  attribute: Attribute,
});

export const ExtendedSegmentList = arrayOf(ExtendedSegment);
export const ExtendedSegmentObject = objectOf(ExtendedSegment);
