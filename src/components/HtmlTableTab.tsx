import React, { useState } from 'react';
import {
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  ExternalLink,
  Laptop,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

interface HtmlTableTabProps {
  styledSnippet: string;
  minimalSnippet: string;
  restaurantName: string;
  menuDate: string;
}

export const HtmlTableTab: React.FC<HtmlTableTabProps> = ({
  styledSnippet,
  minimalSnippet,
  restaurantName,
  menuDate,
}) => {
  const [formatType, setFormatType] = useState<'styled' | 'minimal'>('styled');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);
  const [previewBg, setPreviewBg] = useState<'light' | 'dark'>('light');

  const activeSnippet = formatType === 'styled' ? styledSnippet : minimalSnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${restaurantName || 'Polední menu'} - ${menuDate}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; color: #1e293b; }
    .daily-menu-table { width: 100%; max-width: 800px; margin: 0 auto; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .daily-menu-table th, .daily-menu-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .daily-menu-table th { background: #f1f5f9; font-weight: 600; font-size: 13px; text-transform: uppercase; color: #64748b; }
    .daily-menu-table .category th { background: #fffbeb; color: #92400e; font-size: 14px; }
  </style>
</head>
<body>
  ${activeSnippet}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poledni-menu-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Přehledná HTML tabulka poledního menu
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Responzivní a čistý HTML kód připravený k okamžitému vložení na web (WordPress, Webnode, Shoptet, atd.)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Format style toggle */}
          <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setFormatType('styled')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                formatType === 'styled'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Kompletní stylovaná tabulka s inline CSS – funguje okamžitě na jakémkoliv webu"
            >
              Kompletní stylovaná (doporučeno)
            </button>
            <button
              onClick={() => setFormatType('minimal')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                formatType === 'minimal'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Čisté sémantické HTML pro napojení na vlastní CSS šablonu"
            >
              Čisté HTML
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Zkopírováno!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Zkopírovat HTML kód</span>
              </>
            )}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all"
            title="Stáhnout jako .html soubor"
          >
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span>Stáhnout .html</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Background Toggle */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vizuální náhled tabulky</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Zdrojový HTML kód</span>
          </button>
        </div>

        {viewMode === 'preview' && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Pozadí náhledu:</span>
            <button
              onClick={() => setPreviewBg('light')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                previewBg === 'light'
                  ? 'bg-white text-stone-900 font-bold'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              Světlý web
            </button>
            <button
              onClick={() => setPreviewBg('dark')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                previewBg === 'dark'
                  ? 'bg-stone-800 text-stone-100 font-bold'
                  : 'bg-stone-900 text-stone-400'
              }`}
            >
              Tmavý web
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === 'preview' ? (
        <div
          className={`rounded-2xl p-4 sm:p-8 border border-stone-800 overflow-x-auto shadow-2xl transition-colors ${
            previewBg === 'light' ? 'bg-slate-100' : 'bg-stone-950'
          }`}
        >
          {/* Render the HTML snippet directly */}
          <div
            className="w-full max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: activeSnippet }}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              menu-tabulka.html
            </span>
            <button
              onClick={handleCopyCode}
              className="text-amber-400 hover:text-amber-300 font-sans font-semibold flex items-center gap-1"
            >
              {copied ? '✓ Zkopírováno' : 'Kopírovat kód'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-stone-200 overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{activeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Quick CMS Integration Guide */}
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-xs text-stone-400 space-y-2">
        <h4 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-amber-400" />
          Jak tabulku vložit na váš web:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-stone-300">
          <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">WordPress (Gutenberg):</strong>
            Přidejte blok <em>&bdquo;Vlastní HTML&ldquo;</em> (Custom HTML) a vložte zkopírovaný kód. Uložte změny.
          </div>
          <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">Webnode / Wix:</strong>
            Vyberte prvek <em>&bdquo;HTML kód / Vložený kód&ldquo;</em> a vložte snippet do okna. Tabulka se okamžitě zobrazí.
          </div>
          <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">E-mail newsletter:</strong>
            Stylovaná varianta má inline CSS, takže ji můžete vložit i do e-mailingu pro své zákazníky.
          </div>
        </div>
      </div>
    </div>
  );
};
