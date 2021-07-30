import React from 'react';
import { shallow } from 'enzyme';

import Constants from 'Constants/Comments';
import { CommentHeader } from './CommentHeader';

describe('CommentHeader', () => {
  it('is defined', () => {
    const component = shallow(
      <CommentHeader
        messageCount={20}
        unreadCount={6}
        label={Constants.Labels.Important}
        acknowledge
      />,
    );

    expect(component).toBeDefined();
  });
});
