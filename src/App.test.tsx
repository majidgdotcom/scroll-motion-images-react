import { render, screen } from '@testing-library/react';
import App from './App';

// App renders Home which renders ScrollMotionImageSequence components.
// We test the visible output rather than implementation details.
test('renders the scroll motion containers', () => {
  render(<App />);
  expect(document.getElementById('imageItemmajidTemplate')).toBeInTheDocument();
  expect(document.getElementById('imageItemmickyTemplate')).toBeInTheDocument();
});

test('shows loading state on initial render', () => {
  render(<App />);
  const loadingIndicators = screen.getAllByText('Loading...');
  expect(loadingIndicators.length).toBeGreaterThan(0);
});
