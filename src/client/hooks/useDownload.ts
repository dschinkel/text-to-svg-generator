import { useCallback } from 'react';

export const useDownload = (downloadFn: (svg: string, filename: string) => void) => {
  const slugify = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'untitled';
  };

  const handleDownload = useCallback((svg: string | null, label: string, text: string) => {
    if (!svg) return;
    const textSlug = slugify(text);
    const labelSlug = label.toLowerCase().replace(/ /g, '-');
    downloadFn(svg, `${textSlug}-${labelSlug}.svg`);
  }, [downloadFn]);

  const handleLayeredDownload = useCallback((svgs: (string | null)[], text: string) => {
    const textSlug = slugify(text);
    svgs.forEach((svg, index) => {
      if (!svg) return;
      const labels = ['base', 'tight-outline', 'outer-outline'];
      const label = labels[index] || `layer-${index}`;
      downloadFn(svg, `${textSlug}-${label}.svg`);
    });
  }, [downloadFn]);

  return {
    handleDownload,
    handleLayeredDownload
  };
};
