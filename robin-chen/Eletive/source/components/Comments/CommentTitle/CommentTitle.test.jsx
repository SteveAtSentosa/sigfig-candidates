import React from 'react';
import { shallow } from 'enzyme';

import { CommentTitle } from './CommentTitle';

describe('ActionMenu', () => {
  it('is defined', () => {
    const component = shallow(
      <CommentTitle
        title="Comment Title"
        timestamp={1575280062}
        managers={[]}
      />,
    );
    expect(component).toBeDefined();
  });
});
