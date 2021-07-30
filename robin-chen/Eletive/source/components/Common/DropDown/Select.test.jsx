import React from 'react';
import { shallow } from 'enzyme';

import { SingleSelect } from 'Components/Common';
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
          onClick: () => {},
        }, {
          id: 2,
          title: 'Search',
          icon: searchIcon,
          onClick: () => {},
        }, {
          id: 3,
          title: 'Apply',
          icon: applyIcon,
          onClick: () => {},
        },
      ],
      activeItem: { id: 2 },
      itemFilter: () => {},
      itemRenderer: item => item.title,
      labelRenderer: () => 'bla bla bla',
    };

    const component = shallow(
      <SingleSelect {...props} />,
    );
    expect(component).toBeDefined();
  });
});
