import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FontSelector } from './FontSelector';
import '@testing-library/jest-dom';

describe('FontSelector', () => {
  it('shows fonts', () => {
    const fonts = [
      { id: 'octin-sports', name: 'Octin Sports' },
      { id: 'campus-mn', name: 'Campus MN' }
    ];
    
    const fakeRepository = {
      getFonts: jest.fn().mockResolvedValue(fonts)
    };

    const useFonts = () => ({
      fonts,
      loading: false,
      error: null
    });

    render(
      <FontSelector 
        useFonts={useFonts} 
        onSelect={() => {}} 
      />
    );
    
    const selector = screen.getByTestId('font-selection');
    expect(selector).toBeInTheDocument();

    const options = screen.getAllByTestId('font');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Octin Sports');
    expect(options[1]).toHaveTextContent('Campus MN');
  });
});
