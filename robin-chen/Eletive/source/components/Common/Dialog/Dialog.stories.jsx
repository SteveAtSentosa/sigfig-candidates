import React from 'react';
import { actions } from '@storybook/addon-actions';

import { Dialog } from 'Components/Common';

export default {
  title: 'Common|Dialog',
  parameters: {
    component: Dialog,
  },
};

const eventsFromNames = actions('onClose', 'onClosing', 'onOpened', 'onOpening');

export const simple = () => (
  <Dialog
    isOpen
    title="Dialog title"
    {...eventsFromNames}
  >
    <p>Some dialog content</p>
  </Dialog>
);
