import * as React from 'react';

export interface Font {
  id: string;
  name: string;
}

export interface FontSelectorProps {
  useFonts: (repository: any) => { fonts: Font[]; loading: boolean; error: Error | null };
  repository: any;
  onSelect: (font: Font) => void;
}

export const FontSelector = ({ useFonts, repository, onSelect }: FontSelectorProps) => {
  const { fonts } = useFonts(repository);

  return (
    <div>
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const font = fonts.find(f => f.id === e.target.value);
          if (font) onSelect(font);
        }}
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
