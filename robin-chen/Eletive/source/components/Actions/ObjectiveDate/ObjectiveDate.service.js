import moment from 'moment';

export const getQuarters = () => {
  let currentQuarterDate = moment().quarter(moment().quarter()).startOf('quarter');
  const quarters = new Array(4).fill(null);

  return quarters.map(() => {
    const numberQuarter = moment(currentQuarterDate).quarter();
    const quarter = {
      title: `Q${numberQuarter} ${currentQuarterDate.format('YYYY')}`,
      startDate: currentQuarterDate,
      endDate: moment(currentQuarterDate).endOf('quarter'),
      id: numberQuarter,
    };
    currentQuarterDate = moment(currentQuarterDate).add(1, 'quarter');
    return quarter;
  });
};

export const quarterRange = (startDate, endDate) => {
  const quarters = getQuarters();
  return quarters.find(quarter => (
    !quarter.startDate.diff(startDate, 'days') &&
    !quarter.endDate.diff(endDate, 'days')
  ));
};
