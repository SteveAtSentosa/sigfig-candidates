import React from 'react';
import { shallow } from 'enzyme';

import { Tag } from 'Components/Common';

describe('Tag', () => {
  it('is defined', () => {
    const label = 'Normal';

    const component = shallow(
      <Tag label={label} />,
    );
    expect(component).toBeDefined();
  });
});
