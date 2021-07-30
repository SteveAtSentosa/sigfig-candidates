import React from 'react';
import { shallow } from 'enzyme';

import { ObjectiveItemKeyResultList } from './ObjectiveItemKeyResultList';

describe('ObjectiveItemKeyResultList', () => {
  it('is defined', () => {
    const items = [
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
      {
        name: 'Number',
        type: 1,
        currency: '',
        value: 500,
        minValue: 100,
        maxValue: 700,
      },
      {
        name: 'Binary',
        type: 3,
        currency: '',
        value: 0,
        minValue: 0,
        maxValue: 1,
      },
    ];

    const component = shallow(
      <ObjectiveItemKeyResultList
        items={items}
      />,
    );
    expect(component).toBeDefined();
  });
});
