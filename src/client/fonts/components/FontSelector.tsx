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

  if (loading) return <div>Loading fonts...</div>;
  if (error) return <div>Error loading fonts: {error.message}</div>;

  return (
    <div>
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const font = fonts.find(f => f.id === e.target.value);
          if (font) onSelect(font);
        }}
        className="border border-slate-300 rounded px-2 py-1"
      >
        <option value="">Select a font</option>
        {fonts.map(font => (
          <option key={font.id} value={font.id}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
