import { useState, useEffect, useRef } from 'react';
import { useWebFonts } from './useWebFonts.ts';

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
  const filteredFonts = fonts.filter(font => 
    font.name.toLowerCase().includes(newFontName.toLowerCase())
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
    containerRef
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
