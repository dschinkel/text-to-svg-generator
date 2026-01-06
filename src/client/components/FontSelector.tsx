import * as React from 'react';

export interface Font {
  id: string;
  name: string;
  css_stack?: string;
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
      <FontError error={state.error} />
      <FontSelection {...state} onSelect={onSelect} selectedFont={selectedFont} />
    </div>
  );
};

const FontLoading = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return <div data-testid="font-loading" className="text-sm text-slate-500 mb-2">Loading fonts...</div>;
};

const FontError = ({ error }: { error: Error | null }) => {
  if (!error) return null;
  return <div data-testid="font-error" className="text-sm text-red-500 mb-2">Error: {error.message}</div>;
};

const FontList = ({ 
  fonts, 
  onSelect, 
  setIsOpen,
  visible,
  onAdd,
  newFontName,
  selectedFont
}: { 
  fonts: Font[], 
  onSelect: (font: Font) => void,
  setIsOpen: (isOpen: boolean) => void,
  visible: boolean,
  onAdd: () => void,
  newFontName: string,
  selectedFont?: Font | null
}) => {
  if (!visible) return null;

  const showAddOption = newFontName && !fonts.find(f => f.name.toLowerCase() === newFontName.toLowerCase());

  return (
    <ul 
      className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-60 overflow-auto"
      data-testid="font-list"
    >
      {fonts.map(font => {
        const isSelected = font.id === selectedFont?.id;
        return (
          <li 
            key={font.id}
            data-testid="font"
            onClick={() => {
              onSelect(font);
              setIsOpen(false);
            }}
            className={`px-3 py-3 hover:bg-slate-100 cursor-pointer text-left text-xl ${
              isSelected ? 'bg-green-50 border-l-4 border-green-500 font-medium' : ''
            }`}
            style={{ fontFamily: font.css_stack || font.name }}
          >
            {font.name}
          </li>
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
  selectedFont
}: any) => {
  if (loading || error) return null;

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
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or type a new font..."
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
        visible={isOpen} 
        onAdd={() => {
          handleAdd();
          setIsOpen(false);
        }}
        newFontName={newFontName}
        selectedFont={selectedFont}
      />
    </div>
  );
};
