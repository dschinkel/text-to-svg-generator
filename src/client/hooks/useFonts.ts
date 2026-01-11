import { useState, useEffect, useRef } from 'react';
import { useWebFonts } from './useWebFonts.ts';

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

export interface ClientFontRepository {
  getFonts: () => Promise<Font[]>;
  addFont: (name: string, variationId?: string) => Promise<Font>;
}

export const useFonts = (repository: ClientFontRepository) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newFontName, setNewFontName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useWebFonts('jzl6jgi');

  useEffect(() => {
    let mounted = true;

    loadFonts(repository, setFonts, setLoading, setError, () => mounted);

    return () => {
      mounted = false;
    };
  }, [repository]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const addFont = async (name: string, variationId?: string) => {
    try {
      const newFont = await repository.addFont(name, variationId);
      setFonts(prev => {
        const otherFonts = prev.filter(f => f.id !== newFont.id);
        return [...otherFonts, newFont];
      });
      return newFont;
    } catch (e) {
      setError(e as Error);
      return null;
    }
  };

  const handleVariationSelect = async (font: Font, variationId: string) => {
    return await addFont(font.name, variationId);
  };

  const handleAdd = async () => {
    if (newFontName) {
      await addFont(newFontName);
      setNewFontName('');
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);
  const filteredFonts = fonts.filter(font =>
    font && font.name && font.name.toLowerCase().includes(newFontName.toLowerCase())
  );

  return { 
    fonts, 
    filteredFonts,
    loading, 
    error, 
    addFont,
    newFontName,
    setNewFontName,
    isOpen,
    setIsOpen,
    toggleOpen,
    handleAdd,
    handleVariationSelect,
    containerRef
  };
};

  const loadFonts = async (
  repository: ClientFontRepository,
  setFonts: (fonts: Font[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error) => void,
  isMounted: () => boolean
) => {
  try {
    const data = await repository.getFonts();
    if (isMounted()) {
      setFonts(data);
      setLoading(false);
    }
  } catch (e) {
    if (isMounted()) {
      setError(e as Error);
      setLoading(false);
    }
  }
};
