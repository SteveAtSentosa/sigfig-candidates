import React from 'react';
import { shallow } from 'enzyme';

import { RoundedButton } from 'Components/Common';


describe('InlineButton', () => {
  it('is defined', () => {
    const component = shallow(
      <RoundedButton text="RoundedButton" />,
    );
    expect(component).toBeDefined();
  });
});
