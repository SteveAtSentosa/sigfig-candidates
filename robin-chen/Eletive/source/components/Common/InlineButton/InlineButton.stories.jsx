import React from 'react';
import { action } from '@storybook/addon-actions';

import { plusIcon } from 'images/icons/common';
import { InlineButton } from './InlineButton';

export default {
  title: 'Common|InlineButton',
  parameters: {
    component: InlineButton,
  },
};

const props = {
  text: 'Inline button',
  onClick: action('onClick'),
};


const disabled = () => (
  <InlineButton
    {...props}
    text="Disabled button"
    disabled
  />
);

const normal = () => (
  <InlineButton {...props} />
);

const withIconAndText = () => (
  <InlineButton
    {...props}
    text="With Icon"
    icon={plusIcon}
  />
);

const iconOnly = () => (
  <InlineButton
    {...props}
    text=""
    icon={plusIcon}
  />
);

const all = () => (
  <>
    {normal()}
    {withIconAndText()}
    {iconOnly()}
    {disabled()}
  </>
);


export { all, normal, withIconAndText, iconOnly, disabled };
