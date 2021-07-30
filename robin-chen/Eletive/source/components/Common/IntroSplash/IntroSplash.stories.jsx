import React from 'react';

import { actionsStart } from 'images/actions';
import { IntroSplash } from './IntroSplash';


export default {
  title: 'Common|IntroSplash',

  parameters: {
    component: IntroSplash,
    componentSubtitle: 'Intro',
  },
};

const props = {
  title: 'Start message',
  icon: actionsStart,
};

export const normal = () => (
  <IntroSplash {...props} />
);
