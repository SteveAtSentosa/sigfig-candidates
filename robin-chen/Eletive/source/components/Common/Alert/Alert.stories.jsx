import React from 'react';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import { RoundedButtonIntent, Alert, AlertIntent } from 'Components/Common';
import { bellIcon, deleteBinIcon, exclamationIcon } from 'images/icons/common';

export default {
  title: 'Common|Alert',
  parameters: {
    component: Alert,
  },
};

const notifyProps = new Store({
  isOpen: false,
  icon: bellIcon,
  intent: AlertIntent.DANGER,
  title: (
    <>Do you want to send reminders to <b>4 employees?</b> Please note that reminders will also be sent automatically</>
  ),
  actions: [
    {
      text: 'No',
      intent: RoundedButtonIntent.SECONDARY,
      onClick: action('No'),
    },
    {
      text: 'Yes',
      intent: RoundedButtonIntent.SUCCESS,
      onClick: action('Yes'),
    },
  ],
  onClose: () => {
    notifyProps.set({ isOpen: false });
    action('onClose')();
  },
});

export const notifyAlert = () => (
  <>
    <button type="button" onClick={() => notifyProps.set({ isOpen: true })}>Show</button>
    <State store={notifyProps}>
      <Alert {...notifyProps} />
    </State>
  </>
);

const confirmProps = new Store({
  isOpen: false,
  icon: deleteBinIcon,
  intent: AlertIntent.DANGER,
  title: <b>Are you sure?</b>,
  actions: [
    {
      text: 'No',
      intent: RoundedButtonIntent.SECONDARY,
      onClick: action('No'),
    },
    {
      text: 'Yes',
      intent: RoundedButtonIntent.SUCCESS,
      onClick: action('Yes'),
    },
  ],
  onClose: () => {
    confirmProps.set({ isOpen: false });
    action('onClose')();
  },
});

export const confirmAlert = () => (
  <>
    <button type="button" onClick={() => confirmProps.set({ isOpen: true })}>Show</button>
    <State store={confirmProps}>
      <Alert {...confirmProps} />
    </State>
  </>
);

const duplicateProps = new Store({
  isOpen: false,
  icon: exclamationIcon,
  intent: AlertIntent.DANGER,
  title: <b>Duplicate Error</b>,
  description: 'It looks like you already have a 1-on-1 agenda with Micheal Sen',
  onClose: () => {
    duplicateProps.set({ isOpen: false });
    action('onClose')();
  },
});

export const duplicateAlert = () => (
  <>
    <button type="button" onClick={() => duplicateProps.set({ isOpen: true })}>Show</button>
    <State store={duplicateProps}>
      <Alert {...duplicateProps} />
    </State>
  </>
);

const unsavedProps = new Store({
  isOpen: false,
  icon: exclamationIcon,
  intent: AlertIntent.DANGER,
  title: <b>Unsaved Changes</b>,
  description: 'You have unsaved changes! Are you sure you want to leave this page?',
  actions: [
    {
      text: 'No',
      intent: RoundedButtonIntent.SECONDARY,
      onClick: action('No'),
    },
    {
      text: 'Yes',
      intent: RoundedButtonIntent.SUCCESS,
      onClick: action('Yes'),
    },
  ],
  onClose: () => {
    unsavedProps.set({ isOpen: false });
    action('onClose')();
  },
});

export const unsavedAlert = () => (
  <>
    <button type="button" onClick={() => unsavedProps.set({ isOpen: true })}>Show</button>
    <State store={unsavedProps}>
      <Alert {...unsavedProps} />
    </State>
  </>
);

const surveyNotifyProps = new Store({
  isOpen: false,
  icon: exclamationIcon,
  intent: AlertIntent.SUCCESS,
  title: <b>Good News</b>,
  description: 'It is time to answer a few simple questions',
  actions: [
    {
      text: 'Let\'s go',
      intent: RoundedButtonIntent.SECONDARY,
      onClick: action('Go'),
    },
  ],
  onClose: () => {
    surveyNotifyProps.set({ isOpen: false });
    action('onClose')();
  },
});

export const surveyNotifyAlert = () => (
  <>
    <button type="button" onClick={() => surveyNotifyProps.set({ isOpen: true })}>Show</button>
    <State store={surveyNotifyProps}>
      <Alert {...surveyNotifyProps} />
    </State>
  </>
);
