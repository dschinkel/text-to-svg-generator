import * as React from 'react';
import { Font } from './usePreview';

export interface TextPreviewProps {
  text: string;
  setText: (text: string) => void;
  selectedFont: Font | null;
}

export const TextPreview = ({ text, setText, selectedFont }: TextPreviewProps) => {
  return (
    <div className="flex flex-col gap-6 mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="preview-text" className="text-base font-semibold text-slate-700">
          Enter Text
        </label>
        <input
          id="preview-text"
          type="text"
          data-testid="preview-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to preview..."
          className="border border-slate-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-base font-semibold text-slate-700">Preview</span>
        <div 
          data-testid="preview-display"
          className="min-h-[150px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8"
        >
          {text ? (
            <p 
              className="text-5xl text-center break-all" 
              style={{ fontFamily: selectedFont?.css_stack || selectedFont?.name || 'inherit' }}
            >
              {text}
            </p>
          ) : (
            <span className="text-slate-400 italic">No text to preview</span>
          )}
        </div>
      </div>
    </div>
  );
};
