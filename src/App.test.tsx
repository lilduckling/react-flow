import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ReactFlowProvider } from 'reactflow'; 

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders welcome message', () => {
  render(
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
  const headingElement = screen.getByText(/welcome to react flow/i);
  expect(headingElement).toBeInTheDocument();
});

