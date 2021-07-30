import React from 'react';
import { shallow } from 'enzyme';

import { ObjectiveListItem } from './ObjectiveListItem';

describe('ObjectiveListItem', () => {
  it('is defined', () => {
    const objectiveList = [
      {
        id: 1,
        name: 'Objective 1',
        status: 0,
        endAt: 1577664000,
        objectiveKeys: [
          {
            name: 'Currency',
            type: 2,
            currency: 'EUR',
            value: 50,
            minValue: 10,
            maxValue: 100,
          },
          {
            name: 'Percent',
            type: 0,
            currency: '',
            value: 60,
            minValue: 0,
            maxValue: 100,
          },
        ],
      },
      {
        id: 2,
        name: 'Objective 2',
        parent: 1,
        endAt: 1577664000,
        objectiveKeys: [
          {
            name: 'Currency',
            type: 2,
            currency: 'EUR',
            value: 50,
            minValue: 10,
            maxValue: 100,
          },
          {
            name: 'Percent',
            type: 0,
            currency: '',
            value: 60,
            minValue: 0,
            maxValue: 100,
          },
        ],
      },
      {
        id: 3,
        name: 'Objective 3',
        parent: 1,
        endAt: 1577664000,
        objectiveKeys: [
          {
            name: 'Currency',
            type: 2,
            currency: 'EUR',
            value: 50,
            minValue: 10,
            maxValue: 100,
          },
          {
            name: 'Percent',
            type: 0,
            currency: '',
            value: 60,
            minValue: 0,
            maxValue: 100,
          },
        ],
      },
      {
        id: 4,
        name: 'Objective 4',
        parent: 2,
        endAt: 1577664000,
        objectiveKeys: [
          {
            name: 'Currency',
            type: 2,
            currency: 'EUR',
            value: 50,
            minValue: 10,
            maxValue: 100,
          },
          {
            name: 'Percent',
            type: 0,
            currency: '',
            value: 60,
            minValue: 0,
            maxValue: 100,
          },
        ],
      },
    ];

    const component = shallow(
      <ObjectiveListItem
        objective={objectiveList[0]}
        objectiveList={objectiveList}
      />,
    );
    expect(component).toBeDefined();
  });
});
