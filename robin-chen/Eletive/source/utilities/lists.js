import _ from 'lodash';
import fuzzysearch from 'fuzzysearch';

const DefaultSortOptions = {
  direction: 'asc',
  sortingField: null,
  sortingFunction: null,
  shouldSkipElement: null,
};

export const sortList = (list, options = DefaultSortOptions) => {
  const { sortingField, sortingFunction } = options;

  if (_.isNil(sortingField) && _.isNil(sortingFunction)) {
    throw new Error('either "sortingField" or "sortingFunction" must be provided');
  }

  let sortedList = list;

  if (sortingField) {
    sortedList = _.sortBy(list, [sortingField]);
  }

  if (sortingFunction) {
    sortedList = list.slice().sort(sortingFunction);
  }

  const { direction = 'asc' } = options;
  if (direction === 'desc') {
    sortedList = sortedList.reverse();
  }

  const { shouldSkipElement } = options;
  if (shouldSkipElement && _.isFunction(shouldSkipElement)) {
    const skippedElements = sortedList.filter(element => shouldSkipElement(element));
    const sortableElements = sortedList.filter(element => shouldSkipElement(element) === false);

    sortedList = [...sortableElements, ...skippedElements];
  }

  return sortedList;
};

export const fuzzyFilterSortList = (list, searchingString, buildSearchString, noSort = false) => {
  const lowerCasedSearchingString = searchingString.toLowerCase();

  const filteredResult = list.map((item) => {
    const searchString = buildSearchString(item)?.toLowerCase();
    if (!searchString) {
      return null;
    }
    let index = searchString.indexOf(lowerCasedSearchingString);
    if (index === -1) {
      index = fuzzysearch(lowerCasedSearchingString, searchString);
      if (!index) {
        return null;
      }
    }
    return noSort ? item : [index, item];
  }).filter(item => item !== null);

  if (noSort) {
    return filteredResult;
  }

  return filteredResult.sort(([prevIndex], [nextIndex]) => {
    if (prevIndex === nextIndex) {
      return 0;
    }
    if (nextIndex === true || prevIndex < nextIndex) {
      return -1;
    }
    return 1;
  }).map(([, item]) => item);
};
