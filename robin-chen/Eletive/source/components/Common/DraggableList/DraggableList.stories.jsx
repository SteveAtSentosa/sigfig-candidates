import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { DraggableList } from './DraggableList';

const Item = styled.div`
  padding: 15px;
  background-color: white;
`;

export default {
  title: 'Common|DraggableList',

  parameters: {
    component: DraggableList,
    componentSubtitle: '',
  },
};

const props = {
  listItems: [
    {
      id: '1',
      item: <Item>Item 1</Item>,
      itemValue: 1,
    },
    {
      id: '2',
      item: <Item>Item 2</Item>,
      itemValue: 2,
    },
    {
      id: '3',
      item: <Item>Item 3</Item>,
      itemValue: 3,
      disabled: true,
    },
  ],
  onDragEnd: action('onDragEnd'),
  onDelete: action('onDelete'),
};

export const normal = () => (
  <div style={{ padding: '20px' }}>
    <DraggableList {...props} />
  </div>
);

export const disabled = () => (
  <div style={{ padding: '20px' }}>
    <DraggableList {...props} disabled />
  </div>
);
