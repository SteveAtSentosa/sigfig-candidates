import React from 'react';

import { LanguageSelector } from './LanguageSelector';

export default {
  title: 'Common|LanguageSelector',

  parameters: {
    component: LanguageSelector,
    componentSubtitle: '',
  },
};

const props = {
  language: 'en',
  // eslint-disable-next-line no-unused-vars
  handleLanguageChange: (lang) => { },
};

export const normal = () => (
  <LanguageSelector {...props} />
);
