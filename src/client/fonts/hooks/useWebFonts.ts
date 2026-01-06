import { useEffect } from 'react';

export const useWebFonts = (kitId: string) => {
  useEffect(() => {
    const url = `https://use.typekit.net/${kitId}.css`;
    if (document.querySelector(`link[href="${url}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }, [kitId]);
};
