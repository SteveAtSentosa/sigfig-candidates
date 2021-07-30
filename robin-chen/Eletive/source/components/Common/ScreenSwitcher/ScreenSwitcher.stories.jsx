import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';

import { SectionActionButton, CardButton } from 'Components/Common';
import { ScreenSizes } from 'utilities/common';
import { ScreenSwitcher } from './ScreenSwitcher';

export default {
  title: 'Common|ScreenSwitcher',
  parameters: {
    component: ScreenSwitcher,
  },
};

export const normal = () => (
  <Provider store={store}>
    <ScreenSwitcher
      largerScreenContent={<SectionActionButton title="Desktop Button" />}
      smallerScreenContent={<CardButton>Mobile Button</CardButton>}
      threshold={ScreenSizes.sm}
    />
  </Provider>
);
