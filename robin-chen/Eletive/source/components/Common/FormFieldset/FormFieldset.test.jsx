import React from 'react';
import { shallow } from 'enzyme';

import { FormFieldset } from 'Components/Common';

describe('FormFieldset', () => {
  it('FormFieldset is defined', () => {
    const component = shallow(
      <FormFieldset legendText="My Form Legend Text" />,
    );
    expect(component).toBeDefined();
  });

  it('renders legend text', () => {
    const component = shallow(
      <FormFieldset legendText="Details section" />,
    );
    expect(component.text()).toBe('Details section');
  });

  it('renders children', () => {
    const component = shallow(
      <FormFieldset legendText="Details section"><input /><input /></FormFieldset>,
    );
    expect(component.find('input')).toHaveLength(2);
  });
});
