import React from 'react';
import { shallow } from 'enzyme';

import { TranslationList } from 'Components/Common';

describe('TranslationList', () => {
  it('is defined', () => {
    const component = shallow(
      <TranslationList
        translatedString={{
          sv: 'Behöver diskutera om mötet',
          ru: 'Нужно обсудить на встрече',
        }}
        onChange={() => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
