import React from 'react';
import { shallow } from 'enzyme';
import Constants from 'Constants/Comments';

import { CommentList } from './CommentList';

describe('CommentList', () => {
  it('is defined', () => {
    const component = shallow(
      <CommentList comments={Constants.MockComments} />,
    );

    expect(component).toBeDefined();
  });
});
