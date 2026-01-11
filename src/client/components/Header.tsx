import * as React from 'react';
import { cn } from '@/client/lib/utils';

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm py-8 mb-8">
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            SVG <span className="text-primary">Generator</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
