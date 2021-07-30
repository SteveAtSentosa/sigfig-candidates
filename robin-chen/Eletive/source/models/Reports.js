import { shape, string, number, arrayOf, oneOf, objectOf } from 'prop-types';

import * as SurveyModels from './Survey';

const TrendPoint = shape({
  date: number.isRequired,
  value: number,
});

export const ParticipationRatePoint = shape({
  count: number.isRequired,
  totalCount: number.isRequired,
});

export const Trend = arrayOf(TrendPoint);

export const Distribution = shape({
  a: number.isRequired,
  b: number.isRequired,
  c: number.isRequired,
  e: number.isRequired,
  d: number.isRequired,
});

export const ENPSDistribution = shape({
  promoters: number.isRequired,
  passives: number.isRequired,
  detractors: number.isRequired,
});

export const IndividualReport = arrayOf(shape({
  date: number.isRequired,
  workWellbeingAndEngagement: number.isRequired,
  workWellbeingAndEngagementBenchmark: number.isRequired,
  drivers: objectOf(number).isRequired,
  questions: objectOf(number).isRequired,
}));

export const SegmentReport = arrayOf(shape({
  date: number.isRequired,
  workWellbeingAndEngagement: number,
  workWellbeingAndEngagementBenchmark: number,
  drivers: objectOf(number),
  questions: objectOf(number),
  enps: number,
  participationRate: ParticipationRatePoint.isRequired,
  distributions: shape({
    workWellbeingAndEngagement: Distribution,
    drivers: objectOf(Distribution),
    questions: objectOf(Distribution),
  }),
}));

export const OrganizationReport = shape({
  trends: SegmentReport.isRequired,
  segments: objectOf(SegmentReport).isRequired,
});

export const HeatmapPageColumn = shape({
  name: string.isRequired,
  type: oneOf(['common', 'driver']).isRequired,
  value: SurveyModels.Driver,
});

export const HeatmapPageColumnList = arrayOf(HeatmapPageColumn);

export const CustomSurveyOverview = shape({
  numberOfQuestions: number.isRequired,
  numberOfRecipients: number.isRequired,
  date: number.isRequired,
  status: string.isRequired,
});

export const CustomSurveyMultiChoiceScore = arrayOf(shape({
  title: string.isRequired,
  value: number.isRequired,
}));

export const CustomSurveyMultiChoiceTrend = arrayOf(shape({
  date: number.isRequired,
  values: arrayOf(number).isRequired,
}));

export const CustomSurveyParticipationScore = shape({
  count: number.isRequired,
  totalCount: number.isRequired,
});
