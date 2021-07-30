import React from 'react';
import { shallow } from 'enzyme';

import { InlineButton } from 'Components/Common';


describe('InlineButton', () => {
  it('is defined', () => {
    const component = shallow(
      <InlineButton text="InlineButon" />,
    );
    expect(component).toBeDefined();
  });
});
