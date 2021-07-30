import React from 'react';
import { State, Store } from '@sambego/storybook-state';

import { TranslationSelector } from 'Components/Common';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Common|TranslationSelector',

  parameters: {
    component: TranslationSelector,
    componentSubtitle: '',
  },
};

const props = new Store({
  languageList: ['sv', 'ru'],
  onChange(languageList) {
    action('onChange')(languageList);
    props.set({ languageList });
  },
});

export const normal = () => (
  <State store={props}>
    <TranslationSelector />
  </State>
);
