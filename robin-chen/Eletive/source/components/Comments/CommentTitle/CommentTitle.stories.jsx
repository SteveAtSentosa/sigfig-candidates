
import React from 'react';

import { CommentTitle } from './CommentTitle';

export default {
  title: 'Features|Comments/CommentTitle',
  parameters: {
    component: CommentTitle,
  },
};

const props = {
  title: 'Comment title',
  timestamp: 1575280062,
  managers: [
    {
      isCurrentUser: true,
      firstName: 'Alex',
      lastName: 'Fevral',
    },
    {
      isCurrentUser: false,
      firstName: 'Eric',
      lastName: 'Heflin',
    },
  ],
};

export const noPopoverWhenNoManager = () => (
  <CommentTitle {...props} managers={[]} />
);

export const withMoreThan1Manager = () => (
  <CommentTitle {...props} />
);
