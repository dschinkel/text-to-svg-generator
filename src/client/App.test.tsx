import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'octin-sports', name: 'Octin Sports' }]
    });
  });

  it('shows font selector', async () => {
    render(<App />);
    expect(await screen.findByText('Select a font')).toBeInTheDocument();
  });
});
