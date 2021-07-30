import { configure, addDecorator } from '@storybook/react';
import StoryRouter from 'storybook-react-router'

import '../source/styles/index.scss';

addDecorator(StoryRouter());

configure(require.context('../source', true, /\.stories\.jsx$/), module);
