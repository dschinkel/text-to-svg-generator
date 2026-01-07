import * as React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 px-6 mt-12">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} SVG Generator. All rights reserved.</p>
        <ul className="flex gap-6">
          <li className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</li>
          <li className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</li>
          <li className="hover:text-slate-900 cursor-pointer transition-colors">Contact</li>
        </ul>
      </div>
    </footer>
  );
};
