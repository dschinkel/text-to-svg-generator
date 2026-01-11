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
  removeFont: (id: string) => Promise<void>;
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

    const load = async () => {
      try {
        const data = await repository.getFonts();
        if (mounted) {
          const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
          setFonts(sortedData);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e as Error);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [repository]);

  useEffect(() => {
    // No longer need to close on click outside as it's not a dropdown
  }, []);

  const addFont = async (name: string, variationId?: string) => {
    try {
      const newFont = await repository.addFont(name, variationId);
      setFonts(prev => {
        const otherFonts = prev.filter(f => f.id !== newFont.id);
        const updated = [...otherFonts, newFont];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
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

  const removeFont = async (id: string) => {
    try {
      await repository.removeFont(id);
      setFonts(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      setError(e as Error);
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);
  const filteredFonts = fonts.filter(font =>
    font && font.name && font.name.toLowerCase().includes(newFontName.toLowerCase())
  );

  useEffect(() => {
    if (newFontName && filteredFonts.length === 0) {
      setIsOpen(true);
    }
  }, [newFontName, filteredFonts.length]);

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
    removeFont,
    containerRef
  };
};

