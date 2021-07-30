import React from 'react';

import { ListBlock, InlineButton } from 'Components/Common';
import { addIcon } from 'images/icons/common';

export default {
  title: 'Common|ListBlock',

  parameters: {
    component: ListBlock,
    componentSubtitle: '',
  },
};

const props = {
  label: 'Talking Points',
  required: true,
  emptyText: 'There is nothing here',
  emptyAction: <InlineButton text="Create 1-on-1" icon={addIcon} />,
  headerAction: <InlineButton text="Add from template" icon={addIcon} />,
};

export const normal = () => (
  <ListBlock {...props}>
    <div>Content</div>
  </ListBlock>
);

export const emptyAction = () => (
  <ListBlock {...props} />
);

export const empty = () => (
  <ListBlock {...props} required={false} headerAction={null} emptyAction={null} />
);
