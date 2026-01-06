import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FontSelector } from './fonts/components/FontSelector';
import { useFonts } from './fonts/hooks/useFonts';
import { fontRepository } from './fonts/repositories/fontRepository';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = () => {
  const repository = fontRepository();
  const boundUseFonts = () => useFonts(repository);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Font Selection</h2>
            <div className="max-w-md">
              <FontSelector 
                useFonts={boundUseFonts} 
                onSelect={() => {}} 
              />
            </div>
          </section>
          
          {/* Future sections will go here */}
        </div>
      </main>

      <Footer />
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
