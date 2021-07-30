import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { filledEllipse } from 'images/icons/common';
import { RadioButtonList } from './RadioButtonList';
import { SvgImage } from '../SvgImage/SvgImage';


export default {
  title: 'Common|RadioButtonGroup',

  parameters: {
    component: RadioButtonList,
    componentSubtitle: '',
  },
};

const verticalProps = new Store({
  isVerticalAlign: true,
  items: [
    {
      key: 'important',
      title: 'Important',
      icon: (<SvgImage source={filledEllipse} style={{ color: '#82e59f' }} />),
    },
    {
      key: 'follow-up',
      title: 'Follow-Up',
      icon: (<SvgImage source={filledEllipse} style={{ color: '#f4bd3b' }} />),
    },
    {
      key: 'idea',
      title: 'Idea',
      icon: (<SvgImage source={filledEllipse} style={{ color: '#f68e7e' }} />),
    },
    {
      key: 'no-label',
      title: 'No Label',
      icon: (<SvgImage source={filledEllipse} style={{ color: '#98a6bc' }} />),
    },
    {
      key: 'subtitle',
      title: 'Subtitle',
      subTitle: 'With Sub Title',
    },
  ],
  selectedValue: 'important',
  onChange: (key) => {
    action('OnChange')(key);
    verticalProps.set({ selectedValue: key });
  },
});

export const vertical = () => (
  <State store={verticalProps}>
    <RadioButtonList />
  </State>
);

const horizontalProps = new Store({
  isHorizontal: true,
  selectedValue: 'yes',
  items: [
    {
      key: 'yes',
      title: 'Yes',
    },
    {
      key: 'no',
      title: 'No',
    },
  ],
  onChange: (key) => {
    action('OnChange')(key);
    horizontalProps.set({ selectedValue: key });
  },
});

export const horizontal = () => (
  <State store={horizontalProps}>
    <RadioButtonList />
  </State>
);
