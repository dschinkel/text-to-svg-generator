import * as React from 'react';

export interface Font {
  id: string;
  name: string;
  css_stack?: string;
}

export interface FontSelectorProps {
  useFonts: () => { 
    fonts: Font[]; 
    loading: boolean; 
    error: Error | null;
    newFontName: string;
    setNewFontName: (name: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleOpen: () => void;
    handleAdd: () => Promise<void>;
  };
  onSelect: (font: Font) => void;
}

export const FontSelector = ({ useFonts, onSelect }: FontSelectorProps) => {
  const state = useFonts();

  return (
    <>
      <FontLoading loading={state.loading} />
      <FontError error={state.error} />
      <FontSelection {...state} onSelect={onSelect} />
    </>
  );
};

const FontLoading = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return <div data-testid="font-loading">Loading fonts...</div>;
};

const FontError = ({ error }: { error: Error | null }) => {
  if (!error) return null;
  return <div data-testid="font-error">Error loading fonts: {error.message}</div>;
};

const FontList = ({ 
  fonts, 
  onSelect, 
  setIsOpen,
  visible 
}: { 
  fonts: Font[], 
  onSelect: (font: Font) => void,
  setIsOpen: (isOpen: boolean) => void,
  visible: boolean 
}) => {
  if (!visible) return null;
  return (
    <ul 
      className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-60 overflow-auto"
      data-testid="font-list"
    >
      {fonts.map(font => (
        <li 
          key={font.id}
          data-testid="font"
          onClick={() => {
            onSelect(font);
            setIsOpen(false);
          }}
          className="px-2 py-2 hover:bg-slate-100 cursor-pointer"
          style={{ fontFamily: font.css_stack || font.name }}
        >
          {font.name}
        </li>
      ))}
    </ul>
  );
};

const FontSelection = ({ 
  fonts, 
  loading, 
  error, 
  newFontName, 
  setNewFontName, 
  isOpen, 
  setIsOpen,
  toggleOpen,
  handleAdd,
  onSelect 
}: any) => {
  if (loading || error) return null;

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex gap-2">
        <input
          type="text"
          data-testid="font-input"
          value={newFontName}
          onChange={(e) => setNewFontName(e.target.value)}
          placeholder="Type font name..."
          className="border border-slate-300 rounded px-2 py-1 flex-1"
        />
        <button
          data-testid="add-font-button"
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <div className="relative">
        <button
          data-testid="font-selection"
          onClick={toggleOpen}
          className="border border-slate-300 rounded px-2 py-1 w-full text-left bg-white"
        >
          Select a font
        </button>
        <FontList 
          fonts={fonts} 
          onSelect={onSelect} 
          setIsOpen={setIsOpen} 
          visible={isOpen} 
        />
      </div>
    </div>
  );
};
