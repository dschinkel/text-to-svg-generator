import * as React from 'react';

export interface Font {
  id: string;
  name: string;
}

export interface FontSelectorProps {
  useFonts: () => { fonts: Font[]; loading: boolean; error: Error | null };
  onSelect: (font: Font) => void;
}

export const FontSelector = ({ useFonts, onSelect }: FontSelectorProps) => {
  const { fonts, loading, error } = useFonts();

  if (loading) return <div data-testid="font-loading">Loading fonts...</div>;
  if (error) return <div data-testid="font-error">Error loading fonts: {error.message}</div>;

  return (
    <div>
      <select
        data-testid="font-selection"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const font = fonts.find(f => f.id === e.target.value);
          if (font) onSelect(font);
        }}
        className="border border-slate-300 rounded px-2 py-1"
      >
        <option value="">Select a font</option>
        {fonts.map(font => (
          <option key={font.id} value={font.id} data-testid="font">
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
