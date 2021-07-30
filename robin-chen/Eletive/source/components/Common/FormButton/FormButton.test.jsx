import React from 'react';
import { shallow } from 'enzyme';

import { FormButton } from 'Components/Common';

describe('FormButton', () => {
  it('is defined', () => {
    const component = shallow(
      <FormButton text="FormButton" />,
    );
    expect(component).toBeDefined();
  });
});
