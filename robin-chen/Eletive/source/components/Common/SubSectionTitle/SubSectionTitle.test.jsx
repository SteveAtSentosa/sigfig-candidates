import React from 'react';
import { shallow } from 'enzyme';

import { SubSectionTitle } from 'Components/Common';

describe('SubSectionTitle', () => {
  it('renders title', () => {
    const component = shallow(
      <SubSectionTitle title="Eletive - Employee Engagement" />,
    );
    expect(component.text()).toBe('Eletive - Employee Engagement');
  });
});
