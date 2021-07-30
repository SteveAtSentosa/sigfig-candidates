import React from 'react';
import { shallow } from 'enzyme';

import { UserAvatar } from 'Components/Common';

describe('HelpPopover', () => {
  it('is defined', () => {
    const component = shallow(
      <UserAvatar
        user={{
          firstName: 'John',
          lastName: 'Doe',
        }}
      />,
    );
    expect(component)
      .toBeDefined();
  });
});
