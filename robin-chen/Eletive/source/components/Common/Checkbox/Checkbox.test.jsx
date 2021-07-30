import React from 'react';
import { shallow } from 'enzyme';

import { Checkbox } from 'Components/Common';

describe('Checkbox', () => {
  it('is defined', () => {
    const component = shallow(
      <Checkbox
        isChecked={false}
        onChange={() => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
