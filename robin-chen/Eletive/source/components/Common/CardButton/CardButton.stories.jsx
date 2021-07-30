import React from 'react';
import { action } from '@storybook/addon-actions';

import { CardButton, SvgImage } from 'Components/Common';

import {
  calendarIcon,
  applyIcon,
  closeDaggerIcon,
} from 'images/icons/common';
import styled from 'styled-components';

export default {
  title: 'Common|CardButton',

  parameters: {
    component: CardButton,
    componentSubtitle: '',
  },
};

const Icon = styled(SvgImage)`
  display: inline-flex;
  flex: 0 0 auto;
  height: 15px;
  width: 15px;
  margin-left: 15px;
  color: red;
`;

const props = {
  text: 'Card button',
  onClick: action('onClick'),
};

export const normal = () => (
  <CardButton {...props} />
);

export const withRightIcon = () => (
  <CardButton {...props} rightIcon={calendarIcon} />
);

export const withLeftIcon = () => (
  <CardButton {...props} leftIcon={applyIcon} />
);

export const withNodeLeftIcon = () => (
  <CardButton {...props} leftIcon={<Icon source={closeDaggerIcon} />} />
);

export const withRightAndLeftIcon = () => (
  <CardButton {...props} rightIcon={calendarIcon} leftIcon={applyIcon} />
);

export const disabled = () => (
  <CardButton {...props} text="Disabled button" disabled />
);

export const customContent = () => (
  <CardButton> Custom Content </CardButton>
);
