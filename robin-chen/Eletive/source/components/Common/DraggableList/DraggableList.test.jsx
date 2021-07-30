import React from 'react';
import { shallow } from 'enzyme';

import { DraggableList } from './DraggableList';

describe('DraggableList', () => {
  it('is defined', () => {
    const listItems = [
      {
        id: 1,
        item: <div>Item 1</div>,
      },
      {
        id: 2,
        item: <div>Item 1</div>,
      },
      {
        id: 3,
        item: <div>Item 3</div>,
        dragHandler: <span>Handle</span>,
      },
    ];

    const component = shallow(
      <DraggableList
        listItems={listItems}
      />,
    );
    expect(component).toBeDefined();
  });
});
