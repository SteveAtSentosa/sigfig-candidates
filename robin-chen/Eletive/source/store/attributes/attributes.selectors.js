import _ from 'lodash';
import { createSelector } from 'reselect';

export const segmentsForReportList = createSelector(
  state => state.auth.currentUser,
  state => state.attributes.attributeList,
  (currentUser, attributes) => {
    const result = attributes
      .map(attribute => attribute.segments
        .filter((segment) => {
          if (['Owners', 'Analysts', 'Administrators'].indexOf(currentUser.role) !== -1) {
            return true;
          }
          if (segment.managers && segment.managers.indexOf(currentUser.id) !== -1) {
            return true;
          }
          if (!attribute.reportToMembers || !currentUser.attributes) {
            return false;
          }
          const userAttribute = currentUser.attributes.find(attr => attribute.id === attr.id);
          if (!userAttribute) {
            return false;
          }
          if (attribute.type === 0
            && userAttribute.value === segment.value) {
            return true;
          }
          if (attribute.type === 2
            && userAttribute.value >= segment.value && userAttribute.value < segment.valueUpTo) {
            return true;
          }
          if (attribute.type === 1) {
            const value = Date.now() / 1000 - userAttribute.value;
            return value >= segment.value && value < segment.valueUpTo;
          }
          return false;
        })
        .map(segment => `${attribute.id}_${segment.value}_${segment.valueUpTo}`));

    return _.flatten(result);
  },
);
