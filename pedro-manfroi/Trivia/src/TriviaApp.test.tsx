import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './TriviaApp';

test('it renders the TriviaApp component', () => {
  render(<App />);
  expect(screen.getByText('Welcome to the Trivia Challenge!')).toBeInTheDocument();
});

