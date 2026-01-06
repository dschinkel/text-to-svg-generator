import * as React from 'react';

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm py-8 px-6 mb-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Text to SVG <span className="text-green-600">Generator</span>
          </h1>
        </div>
        <nav>
          <ul className="flex gap-8 text-base font-medium text-slate-600">
            <li className="hover:text-green-600 cursor-pointer transition-colors">Home</li>
            <li className="hover:text-green-600 cursor-pointer transition-colors">History</li>
            <li className="hover:text-green-600 cursor-pointer transition-colors">Settings</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
