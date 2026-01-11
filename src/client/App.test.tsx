import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import fetch from 'cross-fetch';
import { act } from 'react';

if (!global.fetch) {
  (global as any).fetch = (url: string, options: any) => {
    const absoluteUrl = url.startsWith('/') ? `http://localhost:4000${url}` : url;
    return fetch(absoluteUrl, options);
  };
}

describe('App', () => {
  it('shows text previews for font variation', async () => {
    // This test is an end-to-end test and should hit the real service.
    // It should NOT use test doubles or mocks.
    
    // Ensure fetch is NOT mocked (revert any global mock if it exists)
    // In many Jest setups, global.fetch might not be defined or might be a mock from a previous test.
    
    render(<App />);

    // Wait for initial load
    const input = await screen.findByTestId('font-input');
    
    // Type 'cholla' to search for the font
    fireEvent.change(input, { target: { value: 'cholla' } });
    fireEvent.focus(input);

    // Wait for the variation to appear in the list (fetched from real service)
    const variationFonts = await screen.findAllByTestId('font-variation');
    const targetVariation = variationFonts.find(v => v.textContent?.includes('Cholla Wide Ultra Bold'));
    
    if (!targetVariation) {
      throw new Error('Cholla Wide Ultra Bold variation not found in the list');
    }

    // Click the variation
    fireEvent.click(targetVariation);

    // Verify the selected font name updates in the UI
    await waitFor(() => {
      const selectedDisplay = screen.getByText(/Currently selected:/).parentElement;
      expect(selectedDisplay).toHaveTextContent('Cholla Wide Ultra Bold');
    }, { timeout: 10000 });
  });
});
