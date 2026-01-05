import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App', () => {
  it('shows font selector', () => {
    render(<App />);
    expect(screen.getByText('Select a font')).toBeInTheDocument();
  });
});
