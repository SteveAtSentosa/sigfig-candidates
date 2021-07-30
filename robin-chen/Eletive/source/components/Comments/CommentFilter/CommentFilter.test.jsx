import React from 'react';
import { shallow } from 'enzyme';

import { CommentFilter } from './CommentFilter';

describe('CommentFilter', () => {
  it('is defined', () => {
    const component = shallow(
      <CommentFilter />,
    );

    expect(component).toBeDefined();
  });
});
