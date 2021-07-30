import React from 'react';
import { shallow } from 'enzyme';

import { NewChatMessage } from './NewChatMessage';

describe('NewChatMessage', () => {
  it('is defined', () => {
    const component = shallow(
      <NewChatMessage />,
    );

    expect(component).toBeDefined();
  });
});
