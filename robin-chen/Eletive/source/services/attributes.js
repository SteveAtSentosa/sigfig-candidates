import _ from 'lodash';

import { getSegmentUrlID } from 'utilities/reports';

export const generateSegmentID = (segment, attribute) => (
  `${attribute.id}_${segment.value}_${segment.valueUpTo}`
);

export const createSegmentInExtendedFormat = (segment, attribute) => ({
  ...segment,
  attribute,
  id: generateSegmentID(segment, attribute),
});

export const getSegmentList = (attributeList, extendedFormat = false) => {
  const segmentList = attributeList.reduce((result, attribute) => {
    let { segments } = attribute;

    if (extendedFormat) {
      segments = segments.map(segment => (
        createSegmentInExtendedFormat(segment, attribute)
      ));
    }

    return [...result, ...segments];
  }, []);

  return segmentList;
};

export const getSelectedSegment = (match, segmentList) => {
  const segmentUrlID = getSegmentUrlID(match);

  if (segmentUrlID) {
    const foundSegment = _.find(segmentList, segment => segment.id === segmentUrlID);
    return foundSegment || _.first(segmentList);
  }

  return _.first(segmentList);
};

export const areSegmentsEqual = (firstSegment, secondSegment) => (
  firstSegment.name === secondSegment.name &&
  firstSegment.value === secondSegment.value &&
  firstSegment.valueUpTo === secondSegment.valueUpTo
);

export const parseSegmentID = (segmentID) => {
  const formatRegex = /^\d+_(-?\d+\.?\d*|null)_(-?\d+\.?\d*|null)$/;

  if (formatRegex.test(segmentID) === false) {
    return null;
  }

  const [attributeID, segmentValue, segmentValueUpTo] = segmentID
    .split('_')
    .map(item => (item !== 'null' ? Number(item) : null));

  return { attributeID, segmentValue, segmentValueUpTo };
};

export const sortAttributes = attributes => (_.sortBy(attributes, [attribute => attribute.name.toLowerCase()]));

export const sortAttributeSegments = (attribute) => {
  if (attribute.type === 0) {
    return {
      ...attribute,
      segments: _.sortBy(attribute.segments, [segment => segment.name.toLowerCase()]),
    };
  }

  const sortedSegments = attribute.segments.sort((a, b) => {
    if (a.value === b.value) {
      return 0;
    }
    return b.value === null || a.value > b.value ? 1 : -1;
  });

  return { ...attribute, segments: sortedSegments };
};
