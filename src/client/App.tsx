import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FontSelector } from './components/FontSelector';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextPreview } from './components/TextPreview/TextPreview';
import { SVGPreview } from './components/SVGPreview';
import { LayeredPreview } from './components/LayeredPreview';
import { useApp } from './hooks/useApp';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { ImageToSVGSection } from './components/ImageToSVG/ImageToSVGSection';
import { SVGToOutlineSection } from './components/SVGToOutline/SVGToOutlineSection';
import { Card, CardContent } from './components/ui/card';

const App = () => {
  const {
    boundUseFonts,
    preview,
    baseSVG,
    tightOutlineSVG,
    outerOutlineSVG,
    filledOuterSVG,
    includeFilledOuter,
    setIncludeFilledOuter,
    baseLayer,
    tightLayer,
    outerLayer,
    filledOuterLayer,
    handleDownload
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-2 p-8 border-slate-200">
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
                  label="Base" 
                  onDownload={() => handleDownload(baseSVG, 'Base', preview.text)}
                  data-testid="base-preview"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                <SVGPreview 
                  svgString={tightOutlineSVG} 
                  label="Tight Outline" 
                  onDownload={() => handleDownload(tightOutlineSVG, 'Tight Outline', preview.text)}
                  data-testid="tight-outline-preview"
                />
                <div className="flex flex-col space-y-2">
                  <SVGPreview 
                    svgString={outerOutlineSVG} 
                    label="Outer Outline" 
                    onDownload={() => handleDownload(outerOutlineSVG, 'Outer Outline', preview.text)}
                    data-testid="outer-outline-preview"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                <SVGPreview 
                  svgString={filledOuterSVG} 
                  label="Filled Outer Outline" 
                  onDownload={() => handleDownload(filledOuterSVG, 'Filled Outer Outline', preview.text)}
                  data-testid="filled-outer-preview"
                />
              </div>

              <div className="mt-8 border-t pt-8">
                <LayeredPreview 
                  baseLayer={baseLayer}
                  tightLayer={tightLayer}
                  outerLayer={outerLayer}
                  filledOuterLayer={includeFilledOuter ? filledOuterLayer : null}
                  label="Layered Preview"
                  renderAction={
                    <div className="flex items-center space-x-2" data-testid="filled-outer-toggle-container">
                      <Switch 
                        id="include-filled-outer" 
                        checked={includeFilledOuter} 
                        onCheckedChange={setIncludeFilledOuter} 
                        data-testid="filled-outer-toggle"
                      />
                      <Label htmlFor="include-filled-outer" className="text-[10px] text-slate-500 font-medium uppercase">
                        include filled outer outline
                      </Label>
                    </div>
                  }
                />
              </div>
            </section>
          </Card>

          <div className="lg:col-span-1">
            <ImageToSVGSection />
          </div>

          <div className="lg:col-span-1">
            <SVGToOutlineSection />
          </div>
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
