import { sortList } from './lists';

const unsortedList = [
  {
    numberField: 2,
    stringField: 'c',
  },
  {
    numberField: 1,
    stringField: 'a',
  },
  {
    numberField: 3,
    stringField: 'b',
  },
];

const sortedByNumberFieldList = [
  {
    numberField: 1,
    stringField: 'a',
  },
  {
    numberField: 2,
    stringField: 'c',
  },
  {
    numberField: 3,
    stringField: 'b',
  },
];

const sortedByStringFieldList = [
  {
    numberField: 1,
    stringField: 'a',
  },
  {
    numberField: 3,
    stringField: 'b',
  },
  {
    numberField: 2,
    stringField: 'c',
  },
];


const customSortingFunction = (firstEntry, secondEntry) => {
  if (firstEntry.stringField < secondEntry.stringField) {
    return -1;
  }

  if (firstEntry.stringField > secondEntry.stringField) {
    return 1;
  }

  return 0;
};

describe('sorting list utilities', () => {
  describe('sort list function', () => {
    it('throws error if both sorting field and sorting function are not provided', () => {
      expect(() => sortList(unsortedList)).toThrow();
    });

    it('sorts list ascending by provided field name', () => {
      const sortedList = sortList(unsortedList, {
        direction: 'asc',
        sortingField: 'numberField',
      });

      expect(sortedList).toEqual(sortedByNumberFieldList);
    });

    it('sorts list descending by provided field name', () => {
      const sortedList = sortList(unsortedList, {
        direction: 'desc',
        sortingField: 'numberField',
      });

      expect(sortedList).toEqual(sortedByNumberFieldList.slice().reverse());
    });

    it('uses default sorting direction (ascending) if it\'s not provided', () => {
      const sortedList = sortList(unsortedList, {
        sortingField: 'numberField',
      });

      expect(sortedList).toEqual(sortedByNumberFieldList);
    });

    it('always returns new list', () => {
      const sortedListAscending = sortList(unsortedList, { sortingField: 'numberField' });
      expect(sortedListAscending).not.toBe(unsortedList);

      const sortedListDescending = sortList(unsortedList, { direction: 'desc', sortingField: 'numberField' });
      expect(sortedListDescending).not.toBe(unsortedList);

      const sortedListWithCustomSortingFunction = sortList(unsortedList, {
        sortingFunction: customSortingFunction,
      });
      expect(sortedListWithCustomSortingFunction).not.toBe(unsortedList);
    });

    it('uses default sorting direction (ascending) if wrong value provided', () => {
      const sortedList = sortList(unsortedList, {
        direction: 'wrong sorting direction value',
        sortingField: 'numberField',
      });

      expect(sortedList).toEqual(sortedByNumberFieldList);
    });

    it('sorts list with custom sorting function', () => {
      const sortedList = sortList(unsortedList, {
        sortingFunction: customSortingFunction,
      });

      expect(sortedList).toEqual(sortedByStringFieldList);
    });

    it('moves skipped elements to the end of list', () => {
      const expectedSortedList = unsortedList.filter(({ numberField }) => numberField >= 2);
      const expectedSkippedList = unsortedList.filter(({ numberField }) => numberField < 2);

      const sortedListAscending = sortList(unsortedList, {
        sortingField: 'numberField',
        shouldSkipElement: element => element.numberField < 2,
      });

      expect(sortedListAscending).toEqual([...expectedSortedList, ...expectedSkippedList]);

      const sortedListDescending = sortList(unsortedList, {
        direction: 'desc',
        sortingField: 'numberField',
        shouldSkipElement: element => element.numberField < 2,
      });

      expect(sortedListDescending).toEqual([...expectedSortedList.slice().reverse(), ...expectedSkippedList]);
    });
  });
});
