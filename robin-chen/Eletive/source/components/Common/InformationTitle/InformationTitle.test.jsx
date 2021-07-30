import React from 'react';
import { shallow } from 'enzyme';

import { InformationTitle } from './InformationTitle';

describe('InformationTitle component', () => {
  it('is defined', () => {
    const component = shallow(
      <InformationTitle />,
    );

    expect(component).toBeDefined();
  });
});
