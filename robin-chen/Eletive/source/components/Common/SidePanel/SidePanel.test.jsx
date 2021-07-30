import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { SidePanel } from 'Components/Common';

describe('SidePanel', () => {
  it('is defined', () => {
    const component = shallow(
      <SidePanel isOpen><div>content</div></SidePanel>,
    );
    expect(component).toBeDefined();
  });
});
