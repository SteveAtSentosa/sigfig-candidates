import moment from 'moment';

export const answerScore = {
  chartData: ({ score, benchmark }) => ([score, benchmark]),
};

export const answerDistribution = {
  chartData: ({ distribution }) => (
    distribution ? Object.keys(distribution).map(key => distribution[key]).reverse() : null),
};

export const MAX_BENCHMARK_VALUE = 5;
export const scorePieChart = {
  chartData: ({ value }) => ({
    value,
    maxValue: MAX_BENCHMARK_VALUE,
    colorStart: '#6779e3',
    colorEnd: '#97a7ff',
  }),
};

export const trendChart = {
  chartData: ({ values }) => values.filter(({ value }) => value)
    .map(({ date, value }) => ([
      moment.unix(date).format('YYYY-MM-DD'),
      value,
    ])),
};

export const largeDistributionChart = {
  chartData: ({ type, values }) => values
    .filter(({ distribution }) => distribution).map(({ date, distribution }) => ([
      moment.unix(date).format('YYYY-MM-DD'),
      type === 'engagement' ? Object.keys(distribution).map(key => distribution[key]).reverse() : distribution,
    ])),
};

export const getScore = (distribution) => {
  if (distribution) {
    const total = distribution.promoters + distribution.detractors + distribution.passives;
    return Math.round((distribution.promoters - distribution.detractors) / total * 100);
  }
  return null;
};

export const enpsPieChart = {
  chartData: ({ i18n, distribution, benchmark }) => {
    const score = getScore(distribution);

    return {
      score,
      benchmark,
      ...distribution,
      strings: [
        i18n.global('Reports/Charts/ENPSPieChart.Benchmark'),
        i18n.global('Reports/Charts/ENPSPieChart.Distributions.Labels.Detractors'),
        i18n.global('Reports/Charts/ENPSPieChart.Distributions.Labels.Passives'),
        i18n.global('Reports/Charts/ENPSPieChart.Distributions.Labels.Promoters'),
      ],
    };
  },
};

export const enpsTrendChart = {
  chartData: ({ values }) => (
    values.filter(({ value }) => value != null).map(({ date, value }) => ([
      moment.unix(date).format('YYYY-MM-DD'),
      Math.round(value),
    ]))
  ),
};

export const participationRatePieChart = {
  chartData: ({ count, totalCount }) => ({
    value: Math.round(count / totalCount * 100),
    isPercent: true,
    colorStart: '#19deff',
    colorEnd: '#13c7e5',
  }),
};

export const participationRateTrendChart = {
  chartData: ({ values }) => values.filter(({ value }) => value).map(({ date, value }) => ([
    moment.unix(date).format('YYYY-MM-DD'),
    value,
  ])),
};

export const segmentDriverChart = {
  chartData: ({ score, benchmark, trend, distributions }) => ({
    answers: [score, benchmark],
    trend: trend.filter(({ value }) => value).map(({ date, value }) => ([
      moment.unix(date).format('YYYY-MM-DD'),
      value,
    ])),
    distribution: ['e', 'd', 'c', 'b', 'a'].map(key => distributions[key] || 0),
  }),
};

export const statisticPieChart = {
  chartData: ({ data, colors }) => data.map(({ value, name }, index) => [value, colors[index], name]),
};
