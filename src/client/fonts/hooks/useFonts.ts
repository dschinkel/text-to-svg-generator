import { useState, useEffect } from 'react';

export interface ClientFontRepository {
  getFonts: () => Promise<any[]>;
}

export const useFonts = (repository: ClientFontRepository) => {
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    loadFonts(repository, setFonts, setLoading, setError, () => mounted);

    return () => {
      mounted = false;
    };
  }, [repository]);

  return { fonts, loading, error };
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
