import '@testing-library/jest-dom';

// Suppress the ReactDOMTestUtils.act deprecation warning.
// This is a false positive from older @testing-library/react internals
// against React 18 — it does not affect test correctness.
const originalError = console.error.bind(console.error);
beforeAll(() => {
  console.error = (msg: string, ...args: unknown[]) => {
    if (typeof msg === 'string' && msg.includes('ReactDOMTestUtils.act` is deprecated')) return;
    originalError(msg, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
