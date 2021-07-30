import React from 'react';
import { shallow } from 'enzyme';

import { List } from 'Components/Common';
import { applyIcon, editIcon, searchIcon } from 'images/icons/common';


describe('InlineButton', () => {
  it('is defined', () => {
    const props = {
      filterable: true,
      items: [
        {
          id: 1,
          title: 'Edit',
          icon: editIcon,
        }, {
          id: 2,
          title: 'Search',
          icon: searchIcon,
        }, {
          id: 3,
          title: 'Apply',
          icon: applyIcon,
        },

      ],
      activeItem: { id: 2 },
    };

    const component = shallow(
      <List {...props} />,
    );
    expect(component).toBeDefined();
  });
});
