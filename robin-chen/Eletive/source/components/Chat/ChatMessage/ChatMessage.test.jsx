import React from 'react';
import { shallow } from 'enzyme';

import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
  it('is defined', () => {
    const component = shallow(
      <ChatMessage message={{ user: null, messageText: '', createdAt: Date.now() / 1000 }} />,
    );

    expect(component).toBeDefined();
  });
});
