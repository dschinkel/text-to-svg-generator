import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App', () => {
  beforeEach(() => {
    global.fetch = (() => Promise.resolve({
      ok: true,
      json: async () => [{ id: 'octin-sports', name: 'Octin Sports', css_stack: '"octin-sports"' }]
    })) as any;
  });

  it('shows font selector', async () => {
    render(<App />);
    expect(await screen.findByTestId('font-input')).toBeInTheDocument();
  });
});
