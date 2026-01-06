import { useState } from 'react';

export interface Font {
  id: string;
  name: string;
  css_stack?: string;
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
