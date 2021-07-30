import _ from 'lodash';

export const convertSegmentsToPoints = segments => (
  segments
    .filter(segment => segment.valueUpTo)
    .map(segment => segment.valueUpTo.toString())
);

export const convertPointsToSegments = (points) => {
  const result = points.map((pointAsString, index) => {
    const pointAsNumber = parseFloat(pointAsString);

    if (index === 0) {
      return {
        value: null,
        valueUpTo: pointAsNumber,
        name: `Under - ${pointAsString}`,
      };
    }

    const previousPointAsString = points[index - 1];
    const previousPointAsNumber = parseFloat(previousPointAsString);

    return {
      value: previousPointAsNumber,
      valueUpTo: pointAsNumber,
      name: `${points[index - 1]} - ${pointAsString}`,
    };
  });

  const lastPointAsString = _.last(points);
  const lastPointAsNumber = parseFloat(lastPointAsString);

  result.push({
    name: `${points[points.length - 1]} - Over`,
    value: lastPointAsNumber,
    valueUpTo: null,
  });

  return result.map(segment => ({
    ...segment,
    managers: [],
  }));
};
