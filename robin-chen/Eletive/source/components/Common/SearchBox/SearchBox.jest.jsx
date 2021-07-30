import React from 'react';
import { shallow } from 'enzyme';

import { SearchBox } from './SearchBox';

describe('SearchBox', () => {
  it('is defined', () => {
    const component = shallow(
      <SearchBox />,
    );

    expect(component).toBeDefined();
  });
});
