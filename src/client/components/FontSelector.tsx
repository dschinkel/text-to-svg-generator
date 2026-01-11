import * as React from 'react';

export interface FontVariation {
  id: string;
  name: string;
}

export interface Font {
  id: string;
  name: string;
  css_stack?: string;
  variations?: FontVariation[];
}

export interface FontSelectorProps {
  useFonts: () => { 
    fonts: Font[]; 
    filteredFonts: Font[];
    loading: boolean; 
    error: Error | null;
    newFontName: string;
    setNewFontName: (name: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleOpen: () => void;
    handleAdd: () => Promise<void>;
    handleVariationSelect: (font: Font, variationId: string) => Promise<Font | null>;
    removeFont: (id: string) => Promise<void>;
    containerRef: React.RefObject<HTMLDivElement>;
  };
  onSelect: (font: Font) => void;
  selectedFont?: Font | null;
}

export const FontSelector = ({ useFonts, onSelect, selectedFont }: FontSelectorProps) => {
  const state = useFonts();

  return (
    <div className="w-full max-w-sm" ref={state.containerRef}>
      <FontLoading loading={state.loading} />
      <FontSelection 
        {...state} 
        onSelect={onSelect} 
        selectedFont={selectedFont} 
        onSelectVariation={state.handleVariationSelect}
      />
      <FontError error={state.error} />
    </div>
  );
};

const FontLoading = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return <div data-testid="font-loading" className="text-sm text-slate-500 mb-2">Loading fonts...</div>;
};

const FontError = ({ error }: { error: Error | null }) => {
  if (!error) return null;
  return <div data-testid="font-error" className="text-sm text-red-500 mt-2">Error: {error.message}</div>;
};

const FontList = ({ 
  fonts, 
  onSelect, 
  setIsOpen,
  visible,
  onAdd,
  newFontName,
  selectedFont,
  onSelectVariation,
  onRemove
}: { 
  fonts: Font[], 
  onSelect: (font: Font) => void,
  setIsOpen: (isOpen: boolean) => void,
  visible: boolean,
  onAdd: () => void,
  newFontName: string,
  selectedFont?: Font | null,
  onSelectVariation: (font: Font, variationId: string) => Promise<Font | null>,
  onRemove: (id: string) => Promise<void>
}) => {
  if (!visible) return null;

  const showAddOption = newFontName && !fonts.find(f => f.name.toLowerCase() === newFontName.toLowerCase());

  return (
    <ul 
      className="w-full mt-2 bg-white border border-slate-300 rounded-lg shadow-inner max-h-80 overflow-y-auto"
      data-testid="font-list"
    >
      {fonts.map(font => {
        const isSelected = font.id === selectedFont?.id;
        const hasVariations = font.variations && font.variations.length > 0;
        const shouldShowVariations = hasVariations;

        return (
          <React.Fragment key={font.id}>
            <li 
              data-testid="font"
              className={`px-3 py-3 hover:bg-slate-100 cursor-pointer text-left text-xl transition-colors flex items-center justify-between group ${
                isSelected ? 'bg-green-50 border-l-4 border-green-500 font-medium' : ''
              }`}
            >
              <span 
                className="flex-grow"
                onClick={() => onSelect(font)}
                style={{ fontFamily: font.css_stack || font.name }}
              >
                {font.name}
              </span>
              <button
                data-testid="remove-font"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(font.id);
                }}
                className="ml-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove font"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
            {shouldShowVariations && font.variations?.map(v => (
              <li
                key={v.id}
                data-testid="font-variation"
                onClick={async () => {
                  const newFont = await onSelectVariation(font, v.id);
                  if (newFont) {
                    onSelect({ ...newFont, id: v.id, name: v.name });
                  }
                }}
                className="pl-10 pr-6 py-2 hover:bg-slate-50 cursor-pointer text-left text-lg text-slate-600 italic border-l-2 border-slate-200 transition-colors"
                style={{ fontFamily: `"${v.name}", "${font.name}", ${font.css_stack || 'sans-serif'}` }}
              >
                — {v.name}
              </li>
            ))}
          </React.Fragment>
        );
      })}
      {showAddOption && (
        <li 
          onClick={onAdd}
          className="px-3 py-3 hover:bg-green-50 cursor-pointer text-left text-green-600 border-t border-slate-100 text-xl font-medium"
          data-testid="add-font-option"
        >
          Add "{newFontName}"...
        </li>
      )}
      {fonts.length === 0 && !showAddOption && (
        <li className="px-3 py-2 text-slate-400 italic">No fonts found</li>
      )}
    </ul>
  );
};

const FontSelection = ({ 
  filteredFonts, 
  loading, 
  error, 
  newFontName, 
  setNewFontName, 
  isOpen, 
  setIsOpen,
  handleAdd,
  onSelect,
  selectedFont,
  onSelectVariation,
  removeFont
}: {
  filteredFonts: Font[],
  loading: boolean,
  error: Error | null,
  newFontName: string,
  setNewFontName: (name: string) => void,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  handleAdd: () => void,
  onSelect: (font: Font) => void,
  selectedFont?: Font | null,
  onSelectVariation: (font: Font, variationId: string) => Promise<Font | null>,
  removeFont: (id: string) => Promise<void>
}) => {
  if (loading) return null;

  return (
    <div className="relative">
      <div className="flex flex-col gap-1">
        <label className="text-base font-semibold text-slate-700 mb-1">Select a Font</label>
        <input
          type="text"
          data-testid="font-input"
          value={newFontName}
          onChange={(e) => {
            setNewFontName(e.target.value);
          }}
          placeholder="Search for a font..."
          className="border border-slate-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
        />
        {selectedFont && (
          <div className="mt-2 text-sm text-slate-500 font-medium">
            Currently selected: <span className="text-green-600 font-bold">{selectedFont.name}</span>
          </div>
        )}
      </div>

      <FontList 
        fonts={filteredFonts} 
        onSelect={onSelect} 
        setIsOpen={setIsOpen} 
        visible={true} 
        onAdd={() => {
          handleAdd();
        }}
        newFontName={newFontName}
        selectedFont={selectedFont}
        onSelectVariation={onSelectVariation}
        onRemove={removeFont}
      />
    </div>
  );
};
