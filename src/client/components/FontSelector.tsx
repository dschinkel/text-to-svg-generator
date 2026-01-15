import * as React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Trash2 } from 'lucide-react';
import { cn } from '@/client/lib/utils';

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
    handleAdd: () => Promise<Font | null>;
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
  onAdd: () => Promise<Font | null>,
  newFontName: string,
  selectedFont?: Font | null,
  onSelectVariation: (font: Font, variationId: string) => Promise<Font | null>,
  onRemove: (id: string) => Promise<void>
}) => {
  if (!visible) return null;

  const showAddOption = newFontName && !fonts.find(f => f.name.toLowerCase() === newFontName.toLowerCase());

  return (
    <ScrollArea 
      className="w-full mt-2 bg-white border border-slate-300 rounded-lg shadow-inner h-80"
      data-testid="font-list"
    >
      <ul className="w-full">
        {fonts.map(font => {
          const isSelected = font.id === selectedFont?.id;
          const hasVariations = font.variations && font.variations.length > 0;
          const shouldShowVariations = hasVariations;

          return (
            <React.Fragment key={font.id}>
              <li 
                data-testid="font"
                className={cn(
                  "px-3 py-3 hover:bg-slate-100 cursor-pointer text-left text-xl transition-colors flex items-center justify-between group",
                  isSelected && "bg-green-50 border-l-4 border-green-500 font-medium"
                )}
              >
                <span 
                  className="flex-grow"
                  onClick={() => onSelect(font)}
                  style={{ fontFamily: font.css_stack || font.name }}
                >
                  {font.name}
                </span>
                <Button
                  data-testid="remove-font"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(font.id);
                  }}
                  className="ml-2 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove font"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
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
            onClick={async () => {
              const newFont = await onAdd();
              if (newFont) {
                onSelect(newFont);
              }
            }}
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
    </ScrollArea>
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
  handleAdd: () => Promise<Font | null>,
  onSelect: (font: Font) => void,
  selectedFont?: Font | null,
  onSelectVariation: (font: Font, variationId: string) => Promise<Font | null>,
  removeFont: (id: string) => Promise<void>
}) => {
  if (loading) return null;

  return (
    <div className="relative">
      <div className="flex flex-col gap-1">
        <Label className="text-base font-semibold text-slate-700 mb-1">Select a Font</Label>
        <Input
          type="text"
          data-testid="font-input"
          value={newFontName}
          onChange={(e) => {
            setNewFontName(e.target.value);
          }}
          placeholder="Search for a font..."
          className="px-4 py-3 h-auto w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
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
