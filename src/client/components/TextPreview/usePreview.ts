import { useState } from 'react';

export interface FontVariation {
  id: string;
  name: string;
}

export interface Font {
  id: string;
  name: string;
  css_stack?: string;
  variations?: FontVariation[];
}

export const usePreview = () => {
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);

  return {
    text,
    setText,
    selectedFont,
    setSelectedFont
  };
};

export type FontPreview = {
  text: string;
  selectedFont: Font | null;
};
