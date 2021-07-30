const KeyResultTypes = {
  Percent: 0,
  Number: 1,
  Currency: 2,
  Binary: 3,
};

const ObjectiveSubjectTypes = {
  Organization: 0,
  Segment: 1,
  User: 2,
};

const ObjectiveStatusColors = ['#66d587', '#f4bd3b', '#f68e7e'];

const StatisticsPieChartColors = {
  ObjectiveStatus: ['#66d587', '#f68e7e', '#ffae4f', '#c9d0db'],
  Employees: ['#8594f5', '#f68e7e'],
  ObjectAlignment: ['#ffae4f', '#f68e7e'],
  Segments: ['#13c7e5', '#f68e7e'],
};

const ObjectiveStatus = {
  OnTrack: 0,
  Behind: 1,
  AtRisk: 2,
};

export default {
  KeyResultTypes,
  ObjectiveSubjectTypes,
  ObjectiveStatusColors,
  StatisticsPieChartColors,
  ObjectiveStatus,
};
