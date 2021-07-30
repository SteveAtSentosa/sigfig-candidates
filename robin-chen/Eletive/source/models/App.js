import { string, shape, number } from 'prop-types';
import { ExtendedSegment } from './Attributes';

export const Settings = shape({
  selectedTabID: string,
  selectedOrganizationID: number,
  segmentReportSelectedSegment: ExtendedSegment,
});
