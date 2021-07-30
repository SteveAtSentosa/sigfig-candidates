import React from 'react';
import { shallow } from 'enzyme';

import { Tabs } from 'Components/Common';

describe('Tabs', () => {
  it('is defined', () => {
    const tabs = [
      {
        id: '1',
        title: 'Objectives',
      },
      {
        id: '2',
        title: 'Segments',
      },
      {
        id: '3',
        title: 'Statistics',
      },
    ];

    const component = shallow(
      <Tabs tabs={tabs} onChange={() => {}} selectedTabId="2" />,
    );
    expect(component).toBeDefined();
  });
});
