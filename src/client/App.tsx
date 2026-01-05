import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FontSelector } from './fonts/components/FontSelector';
import { useFonts } from './fonts/hooks/useFonts';

const App = () => {
  const fakeRepository = {
    getFonts: async () => []
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <h1 className="text-3xl font-bold mb-8">Text to SVG Generator</h1>
      <FontSelector 
        useFonts={useFonts} 
        repository={fakeRepository} 
        onSelect={() => {}} 
      />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

export default App;
