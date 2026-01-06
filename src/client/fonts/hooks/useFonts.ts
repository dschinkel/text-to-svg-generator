import { useState, useEffect } from 'react';
import { useWebFonts } from './useWebFonts';

export interface ClientFontRepository {
  getFonts: () => Promise<any[]>;
  addFont: (name: string) => Promise<any>;
}

export const useFonts = (repository: ClientFontRepository) => {
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [newFontName, setNewFontName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useWebFonts('jzl6jgi');

  useEffect(() => {
    let mounted = true;

    loadFonts(repository, setFonts, setLoading, setError, () => mounted);

    return () => {
      mounted = false;
    };
  }, [repository]);

  const addFont = async (name: string) => {
    try {
      const newFont = await repository.addFont(name);
      setFonts(prev => [...prev, newFont]);
    } catch (e) {
      setError(e as Error);
    }
  };

  const handleAdd = async () => {
    if (newFontName) {
      await addFont(newFontName);
      setNewFontName('');
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return { 
    fonts, 
    loading, 
    error, 
    addFont,
    newFontName,
    setNewFontName,
    isOpen,
    setIsOpen,
    toggleOpen,
    handleAdd
  };
};

const loadFonts = async (
  repository: ClientFontRepository,
  setFonts: (fonts: any[]) => void,
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
