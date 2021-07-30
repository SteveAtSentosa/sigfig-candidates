import React from 'react';
import { action } from '@storybook/addon-actions';

import { plusIcon } from 'images/icons/common';
import { RoundedButton, RoundedButtonIntent } from './RoundedButton';

export default {
  title: 'Common|RoundedButton',
  parameters: {
    component: RoundedButton,
  },
};

const props = {
  text: 'Success button',
  intent: RoundedButtonIntent.SUCCESS,
  onClick: action('onClick'),
};


const disabled = () => (
  <RoundedButton
    {...props}
    text="Disabled button"
    disabled
  />
);

const success = () => (
  <RoundedButton {...props} />
);

const danger = () => (
  <RoundedButton
    {...props}
    text="Danger button"
    intent={RoundedButtonIntent.DANGER}
  />
);

const secondary = () => (
  <RoundedButton
    {...props}
    text="Secondary button"
    intent={RoundedButtonIntent.SECONDARY}
  />
);

const withIconAndText = () => (
  <RoundedButton
    {...props}
    text="With Icon"
    icon={plusIcon}
  />
);

const iconOnly = () => (
  <RoundedButton
    {...props}
    text=""
    icon={plusIcon}
  />
);

const withoutIntent = () => (
  <RoundedButton
    {...props}
    intent=""
    text="Cancel"
  />
);

const all = () => (
  <>
    {success()}
    {danger()}
    {secondary()}
    {withIconAndText()}
    {iconOnly()}
    {withoutIntent()}
    {disabled()}
  </>
);


export { all, success, danger, secondary, withIconAndText, iconOnly, withoutIntent, disabled };
