import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders welcome message', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to react flow/i);
  expect(headingElement).toBeInTheDocument();
});
