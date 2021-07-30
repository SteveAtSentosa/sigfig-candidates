import React from 'react';
import { shallow } from 'enzyme';

import { CardButton } from 'Components/Common';


describe('CardButton', () => {
  it('is defined', () => {
    const handleChange = () => {};
    const component = shallow(
      <CardButton
        text="Card button"
        onClick={handleChange}
      />,
    );
    expect(component).toBeDefined();
  });
});
