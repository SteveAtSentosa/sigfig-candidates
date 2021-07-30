import React from 'react';
import { State, Store } from '@sambego/storybook-state';

import { TranslationList } from 'Components/Common';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Common|TranslationList',

  parameters: {
    component: TranslationList,
    componentSubtitle: '',
  },
};

const props = new Store({
  translatedString: {
    sv: 'Behöver diskutera om mötet',
    ru: 'Нужно обсудить на встрече',
  },
  onChange(translatedString) {
    action('onChange')(translatedString);
    props.set({ translatedString });
  },
});

export const normal = () => (
  <State store={props}>
    <TranslationList />
  </State>
);
