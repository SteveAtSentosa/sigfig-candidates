import React from 'react';
import { shallow } from 'enzyme';

import { TranslationSelector } from 'Components/Common';

describe('TranslationSelector', () => {
  it('is defined', () => {
    const component = shallow(
      <TranslationSelector
        languageList={['sv', 'ru']}
        onChange={() => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
