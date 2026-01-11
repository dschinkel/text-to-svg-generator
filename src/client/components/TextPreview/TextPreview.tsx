import * as React from 'react';
import { Font } from './usePreview';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/client/lib/utils';

export interface TextPreviewProps {
  text: string;
  setText: (text: string) => void;
  selectedFont: Font | null;
}

export const TextPreview = ({ text, setText, selectedFont }: TextPreviewProps) => {
  return (
    <Card className="mt-8 p-6 border-slate-200">
      <CardContent className="flex flex-col gap-6 p-0">
        <div className="flex flex-col gap-2">
          <Label htmlFor="preview-text" className="text-base font-semibold text-slate-700">
            Enter Text
          </Label>
          <Input
            id="preview-text"
            type="text"
            data-testid="preview-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something to preview..."
            className="px-4 py-3 h-auto w-full text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
      </CardContent>
    </Card>
  );
};
