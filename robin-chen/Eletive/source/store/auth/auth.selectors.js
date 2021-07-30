import { createSelector } from 'reselect';

const currentUser = state => state.currentUser;
const changePasswordStatus = state => state.changePasswordStatus;

export const isCurrentUserOwner = createSelector(
  currentUser,
  user => user && user.role === 'Owners',
);

export const isCurrentUserAdministrator = createSelector(
  currentUser,
  user => user && user.role === 'Administrators',
);

export const isCurrentUserAnalyst = createSelector(
  currentUser,
  user => user && user.role === 'Analysts',
);

export const isPasswordChanging = createSelector(
  changePasswordStatus,
  status => status === 'pending',
);

export const isGdprConsented = createSelector(
  currentUser,
  user => Boolean(user && user.gdprConsented),
);
