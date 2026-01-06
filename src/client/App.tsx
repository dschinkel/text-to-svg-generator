import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FontSelector } from './components/FontSelector';
import { useFonts } from './hooks/useFonts';
import { fontRepository } from './repositories/fontRepository';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextPreview } from './components/TextPreview/TextPreview';
import { usePreview } from './components/TextPreview/usePreview';
import { SVGPreview } from './components/SVGPreview';
import { useSVG } from './components/useSVG';
import { downloadSVG } from './domain/downloadService';
import { useLayeredSVG } from './components/useLayeredSVG';
import { LayeredPreview } from './components/LayeredPreview';
import { useDownload } from './hooks/useDownload';

const App = () => {
  const repository = fontRepository();
  const boundUseFonts = () => useFonts(repository);
  
  const preview = usePreview();
  const { baseSVG, tightOutlineSVG, outerOutlineSVG } = useSVG(preview.text, preview.selectedFont?.id);
  const { baseLayer, tightLayer, outerLayer } = useLayeredSVG(baseSVG, tightOutlineSVG, outerOutlineSVG);
  const { handleDownload, handleLayeredDownload } = useDownload(downloadSVG);

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
                onSelect={preview.setSelectedFont} 
                selectedFont={preview.selectedFont}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <TextPreview 
                text={preview.text} 
                setText={preview.setText} 
                selectedFont={preview.selectedFont} 
              />
              <SVGPreview 
                svgString={baseSVG} 
                label="Base SVG" 
                onDownload={() => handleDownload(baseSVG, 'Base', preview.text)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
              <SVGPreview 
                svgString={tightOutlineSVG} 
                label="Tight Outline SVG" 
                onDownload={() => handleDownload(tightOutlineSVG, 'Tight Outline', preview.text)}
              />
              <SVGPreview 
                svgString={outerOutlineSVG} 
                label="Outer Outline SVG" 
                onDownload={() => handleDownload(outerOutlineSVG, 'Outer Outline', preview.text)}
              />
            </div>

            <div className="mt-8 border-t pt-8">
              <LayeredPreview 
                baseLayer={baseLayer}
                tightLayer={tightLayer}
                outerLayer={outerLayer}
                label="Layered Preview"
              />
            </div>
          </section>
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
