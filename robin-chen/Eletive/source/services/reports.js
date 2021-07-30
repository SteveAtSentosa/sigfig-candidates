import _ from 'lodash';

const DistributionFields = ['a', 'b', 'c', 'd', 'e'];

export const convertDistributionMapToArray = (distributionMap, distributionFields) => {
  const distributionArray = [];

  _.forEach(distributionMap, (value, key) => {
    const index = distributionFields.indexOf(key);
    distributionArray[index] = value;
  });

  return distributionArray;
};

export const getDistributionValues = (distributionArray, distributionFields) => {
  const distributionMap = {};

  _.forEach(distributionFields, (value) => {
    const key = distributionArray[value];
    if (!key) {
      distributionMap[value] = 0;
    } else {
      distributionMap[value] = distributionArray[value];
    }
  });

  return convertDistributionMapToArray(distributionMap, distributionFields);
};

export const convertDistributionArrayToMap = (distributionArray, distributionFields) => {
  const distributionMap = {};

  _.forEach(distributionArray, (value, index) => {
    const key = distributionFields[index];
    distributionMap[key] = value;
  });

  _.forEach(distributionFields, (value) => {
    if (_.isNil(distributionMap[value])) {
      distributionMap[value] = 0;
    }
  });

  return distributionMap;
};

export const getAdjustedPercents = (counts, sum = null) => {
  const totalCount = sum !== null ? sum : counts.reduce((a, c) => a + c, 0);

  const percents = counts.map(count => Math.round(count / totalCount * 100));
  const totalPercent = percents.reduce((a, c) => a + c, 0);

  if (totalPercent !== 100) {
    const maxPercentValue = Math.max(...percents);
    const maxPercentValueIndex = percents.indexOf(maxPercentValue);
    percents[maxPercentValueIndex] = 100 - (totalPercent - maxPercentValue);
  }
  return percents;
};

export const getPercentDistribution = (countDistribution, distributionFields = DistributionFields) => {
  const counts = convertDistributionMapToArray(countDistribution, distributionFields);

  const percents = getAdjustedPercents(counts);
  return convertDistributionArrayToMap(percents, distributionFields);
};

export const getEnpsPercentDistribution = countDistribution => (
  getPercentDistribution(countDistribution, ['promoters', 'passives', 'detractors'])
);

export const getMultiChoicePercentDistribution = (total, countDistribution, distributionFields) => {
  const counts = convertDistributionMapToArray(countDistribution, distributionFields);

  const percents = counts.map(count => Math.round(count / total * 100));

  return convertDistributionArrayToMap(percents, distributionFields);
};

export const getNPSCounts = (choices) => {
  const npsValues = { promoters: 0, passives: 0, detractors: 0 };

  Object.keys(choices).forEach((mark) => {
    if (mark >= 9) {
      npsValues.promoters += choices[mark];
    } else if (mark >= 7 && mark <= 8) {
      npsValues.passives += choices[mark];
    } else {
      npsValues.detractors += choices[mark];
    }
  });
  return npsValues;
};
