import { useEffect } from 'react';

export const useWebFonts = (kitId: string, version?: number) => {
  useEffect(() => {
    const baseUrl = `https://use.typekit.net/${kitId}.css`;
    const url = version ? `${baseUrl}?v=${version}` : baseUrl;
    
    // If it's the exact same URL, do nothing
    if (document.querySelector(`link[href="${url}"]`)) {
      return;
    }

    // Remove any existing typekit CSS links for this kit to avoid stacking
    const existingLinks = document.querySelectorAll(`link[href^="${baseUrl}"]`);
    existingLinks.forEach(link => link.remove());

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }, [kitId, version]);
};
