import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { Modal } from 'Components/Common';

export default {
  title: 'Common|Modal',
  parameters: {
    component: Modal,
  },
};

const props = new Store({
  isOpen: false,
  onClose: () => {
    props.set({ isOpen: false });
    action('onClose')();
  },
  onClickOutside: action('onClickOutside'),
});

export const normal = () => (
  <>
    <button type="button" onClick={() => props.set({ isOpen: true })}>Show</button>
    <State store={props}>
      <Modal>
        <div>Modal content</div>
      </Modal>
    </State>
  </>
);
