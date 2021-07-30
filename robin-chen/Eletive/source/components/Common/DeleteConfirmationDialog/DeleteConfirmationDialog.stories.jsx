import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { DeleteConfirmationDialog } from 'Components/Common';

export default {
  title: 'Common|DeleteConfirmationDialog',
  parameters: {
    component: DeleteConfirmationDialog,
  },
};

const props = new Store({
  isOpen: false,
  title: 'Do you want to delete attr?',
  onCancelDelete: action('onCancel'),
  onConfirmDelete: action('OnConfirm'),
});

export const normal = () => (
  <>
    <button type="button" onClick={() => props.set({ isOpen: true })}>Show</button>
    <State store={props}>
      <DeleteConfirmationDialog {...props}>
        Test Text
      </DeleteConfirmationDialog>
    </State>
  </>
);
