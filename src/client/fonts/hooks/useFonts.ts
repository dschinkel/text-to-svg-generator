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

    const loadFonts = async () => {
      try {
        const data = await repository.getFonts();
        if (mounted) {
          setFonts(data);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e as Error);
          setLoading(false);
        }
      }
    };

    loadFonts();

    return () => {
      mounted = false;
    };
  }, [repository]);

  return { fonts, loading, error };
};
