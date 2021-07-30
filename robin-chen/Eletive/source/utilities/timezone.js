import * as moment from 'moment-timezone';

export const convertTimezone = (timezone, timestamp = Date.now()) => {
  const zone = moment.tz.zone(timezone);
  const zonedDate = moment.tz(timestamp, timezone);
  const offset = zonedDate.utcOffset();
  const offsetAsString = zonedDate.format('Z');

  const abbr = zone.abbr(timestamp);
  const notStartWithSign = /^[^-+]/;
  const abbreviation = notStartWithSign.test(abbr) ? abbr : undefined;

  return {
    abbreviation,
    offset,
    offsetAsString,
    timezone,
    key: timezone,
    text: timezone + (abbreviation ? ` (${abbreviation})` : ''),
  };
};

export const getLocalTimezoneItem = () => {
  const timezone = moment.tz.guess();
  if (timezone !== undefined) {
    return {
      ...convertTimezone(timezone),
      iconName: 'locate',
      key: `${timezone}-local`,
      text: 'Current timezone',
    };
  }
  return undefined;
};
