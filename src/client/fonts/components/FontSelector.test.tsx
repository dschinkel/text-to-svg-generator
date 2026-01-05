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

    const useFonts = (repository: any) => ({
      fonts,
      loading: false,
      error: null
    });

    render(
      <FontSelector 
        useFonts={useFonts} 
        repository={fakeRepository} 
        onSelect={() => {}} 
      />
    );

    expect(screen.getByText('Octin Sports')).toBeInTheDocument();
    expect(screen.getByText('Campus MN')).toBeInTheDocument();
  });
});
