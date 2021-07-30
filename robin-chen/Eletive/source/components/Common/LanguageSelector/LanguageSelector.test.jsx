import React from 'react';
import { mount } from 'enzyme';

import { LanguageSelector } from './LanguageSelector';

describe('LanguageSelector', () => {
  it('is defined', () => {
    const component = mount(
      <LanguageSelector
        language="en"
        // eslint-disable-next-line no-unused-vars
        handleLanguageChange={(lang) => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
