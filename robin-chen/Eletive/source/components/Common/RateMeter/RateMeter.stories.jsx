import React from 'react';

import { RateMeter } from 'Components/Common';
import { State, Store } from '@sambego/storybook-state';

export default {
  title: 'Common|RateMeter',

  parameters: {
    component: RateMeter,
    componentSubtitle: 'Show a meter with ratings',
  },
};

const props = {
  ratings: [
    { color: '#a83232', label: 'Very Weak' },
    { color: '#a86532', label: 'Weak' },
    { color: '#9aa832', label: 'Good' },
    { color: '#85a832', label: 'Better' },
    { color: '#38a832', label: 'Awesome' },
  ],
  ratingScore: null,
  noRatingLabel: 'Not rated',
};

const store = new Store(props);

export const normal = () => (
  <>
    <p>Control the ratingScore prop value with the buttons<br /><br />
      <button type="button" onClick={() => store.set({ ratingScore: null })}>null</button>
      <button type="button" onClick={() => store.set({ ratingScore: 0 })}>0</button>
      <button type="button" onClick={() => store.set({ ratingScore: 1 })}>1</button>
      <button type="button" onClick={() => store.set({ ratingScore: 2 })}>2</button>
      <button type="button" onClick={() => store.set({ ratingScore: 3 })}>3</button>
      <button type="button" onClick={() => store.set({ ratingScore: 4 })}>4</button>
    </p>
    <br />
    <State store={store}>
      <RateMeter {...props} />
    </State>
  </>
);
