import React from 'react';
import { shallow } from 'enzyme';

import { publicIcon, privateIcon } from 'images/icons/common';
import { SwitchChoice } from './SwitchChoice';

describe('SwitchChoice', () => {
  it('is defined', () => {
    const value = 0;
    const choices = [
      {
        value: 0,
        title: 'Public',
        description: 'Use this if segments and employees should be able to align with this objective.',
        icon: publicIcon,
      },
      {
        value: 1,
        title: 'Private',
        // eslint-disable-next-line max-len
        description: 'If the objective should be private and only accessible to people with access to the organization, use this.',
        icon: privateIcon,
      },
    ];
    const handleChange = () => {};

    const component = shallow(
      <SwitchChoice value={value} choices={choices} onChange={handleChange} />,
    );
    expect(component).toBeDefined();
  });
});
