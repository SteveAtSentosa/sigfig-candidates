import React from 'react';
import { UserAvatar } from 'Components/Common';

export default {
  title: 'Common|UserAvatar',

  parameters: {
    component: UserAvatar,
    componentSubtitle: '',
  },
};

const props = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

export const normal = () => (
  <UserAvatar {...props} />
);

export const small = () => (
  <UserAvatar small {...props} />
);

export const anonym = () => (
  <UserAvatar anonym user={null} />
);

export const anonymSmall = () => (
  <UserAvatar anonym small user={null} />
);
