import React, { useState, useMemo } from 'react';
import {
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  Smartphone,
  Monitor,
  Sparkles,
  Laptop,
  CheckCircle2,
  FileCode,
  Palette,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Dish } from '../types/menu';

interface HtmlTableTabProps {
  styledSnippet?: string;
  minimalSnippet?: string;
  restaurantName: string;
  menuDate: string;
  servingHours?: string;
  dishes?: Dish[];
}

export type TableStylePreset = 'modern_light' | 'dark_luxury' | 'compact' | 'minimal_semantic' | 'ai_custom';

export const HtmlTableTab: React.FC<HtmlTableTabProps> = ({
  styledSnippet = '',
  minimalSnippet = '',
  restaurantName,
  menuDate,
  servingHours = '11:00 – 14:30',
  dishes = [],
}) => {
  const [selectedStyle, setSelectedStyle] = useState<TableStylePreset>('modern_light');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState<boolean>(false);

  // Group and sort dishes by proper gastro order: Polévky first -> Hlavní jídla -> Speciály -> Dezerty at the bottom
  const categorizedDishes = useMemo(() => {
    const groups: { [key: string]: Dish[] } = {};
    if (!dishes || dishes.length === 0) return groups;

    dishes.forEach((dish) => {
      const cat = dish.category?.trim() || 'Hlavní jídla';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(dish);
    });

    // Desired category sorting order
    const getCategoryRank = (cat: string) => {
      const c = cat.toLowerCase();
      if (c.includes('polévk')) return 1;
      if (c.includes('hlavní')) return 2;
      if (c.includes('speciál') || c.includes('týden')) return 3;
      if (c.includes('salát') || c.includes('předkrm')) return 4;
      if (c.includes('dezert') || c.includes('sladk')) return 10; // Dezerty always last at the bottom
      return 5;
    };

    const sortedEntries = Object.entries(groups).sort(
      ([catA], [catB]) => getCategoryRank(catA) - getCategoryRank(catB)
    );

    const sortedGroups: { [key: string]: Dish[] } = {};
    sortedEntries.forEach(([key, val]) => {
      sortedGroups[key] = val;
    });

    return sortedGroups;
  }, [dishes]);

  // Clean raw AI snippets if they contain markdown fences like ```html
  const cleanAiSnippet = useMemo(() => {
    let raw = styledSnippet || minimalSnippet || '';
    raw = raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '');
    raw = raw.replace(/\s*```$/i, '').trim();
    return raw;
  }, [styledSnippet, minimalSnippet]);

  // Generators for different styles
  const activeSnippet = useMemo(() => {
    const restTitle = restaurantName || 'Naše polední nabídka';
    const dateTitle = menuDate || 'Dnešní denní menu';
    const hours = servingHours || '11:00 – 14:30';

    if (selectedStyle === 'ai_custom' && cleanAiSnippet) {
      return cleanAiSnippet;
    }

    if (selectedStyle === 'minimal_semantic') {
      let rows = '';
      Object.entries(categorizedDishes).forEach(([category, items]) => {
        rows += `    <tr class="menu-category-row"><th colspan="3">${category}</th></tr>\n`;
        items.forEach((item) => {
          const allergenText = item.allergens && item.allergens.length > 0
            ? ` (Alergeny: ${item.allergens.join(', ')})`
            : '';
          const descText = item.description ? `<br><small class="menu-item-desc">${item.description}</small>` : '';
          rows += `    <tr class="menu-item-row">\n      <td class="menu-item-name"><strong>${item.name}</strong>${descText}</td>\n      <td class="menu-item-allergens">${allergenText}</td>\n      <td class="menu-item-price">${item.price || '-'}</td>\n    </tr>\n`;
        });
      });

      return `<!-- Polední menu: ${restTitle} -->
<table class="gastro-menu-table">
  <caption>${dateTitle} | ${hours}</caption>
  <thead>
    <tr>
      <th>Položka</th>
      <th>Alergeny</th>
      <th>Cena</th>
    </tr>
  </thead>
  <tbody>
${rows}  </tbody>
</table>`;
    }

    if (selectedStyle === 'dark_luxury') {
      let rowsHtml = '';
      Object.entries(categorizedDishes).forEach(([category, items]) => {
        const icon = category.toLowerCase().includes('polévk')
          ? '🍲'
          : category.toLowerCase().includes('dezert')
          ? '🍰'
          : '🍽️';

        rowsHtml += `
      <!-- KATEGORIE: ${category} -->
      <tr style="background-color: #1e293b; border-bottom: 1px solid #334155;">
        <td colspan="3" style="padding: 10px 18px; font-weight: 700; font-size: 13px; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px;">
          ${icon} ${category}
        </td>
      </tr>`;

        items.forEach((item) => {
          const allergenBadges = item.allergens && item.allergens.length > 0
            ? item.allergens
                .map(
                  (a) =>
                    `<span style="display:inline-block; padding: 2px 6px; margin: 1px; font-size: 11px; background: #334155; color: #cbd5e1; border-radius: 4px; font-weight: 600;">${a}</span>`
                )
                .join(' ')
            : '<span style="color: #64748b; font-size: 12px;">–</span>';

          const descHtml = item.description
            ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 3px; font-weight: 400; line-height: 1.4;">${item.description}</div>`
            : '';

          rowsHtml += `
      <tr style="border-bottom: 1px solid #1e293b; transition: background 0.2s;">
        <td style="padding: 14px 18px; color: #f8fafc; font-size: 14px; vertical-align: middle;">
          <strong style="font-weight: 600; color: #ffffff;">${item.name}</strong>
          ${descHtml}
        </td>
        <td style="padding: 14px 12px; text-align: center; vertical-align: middle; width: 90px;">
          ${allergenBadges}
        </td>
        <td style="padding: 14px 18px; text-align: right; vertical-align: middle; width: 110px;">
          <span style="font-size: 15px; font-weight: 700; color: #fbbf24; white-space: nowrap;">${item.price || '-'}</span>
        </td>
      </tr>`;
        });
      });

      return `<div style="max-width: 780px; margin: 16px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px 24px; text-align: center; border-bottom: 2px solid #f59e0b;">
    <h3 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">${restTitle}</h3>
    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">${dateTitle} &bull; Výdej od ${hours}</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: left; background-color: #0f172a;">
    <thead>
      <tr style="border-bottom: 1px solid #334155; background-color: #0b1120;">
        <th style="padding: 10px 18px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Pokrm</th>
        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600; text-align: center; width: 90px;">Alergeny</th>
        <th style="padding: 10px 18px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600; text-align: right; width: 110px;">Cena</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}
    </tbody>
  </table>
  <div style="background-color: #0b1120; padding: 10px 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
    Informace o obsažených alergenech (1–14) poskytne na vyžádání obsluha.
  </div>
</div>`;
    }

    if (selectedStyle === 'compact') {
      let rowsHtml = '';
      Object.entries(categorizedDishes).forEach(([category, items]) => {
        rowsHtml += `
      <tr style="background:#f8fafc; border-bottom: 1px solid #e2e8f0;">
        <td colspan="2" style="padding: 6px 12px; font-weight: 700; font-size: 12px; color: #475569; text-transform: uppercase;">${category}</td>
      </tr>`;

        items.forEach((item) => {
          const allergenInfo = item.allergens && item.allergens.length > 0 ? ` [${item.allergens.join(',')}]` : '';
          rowsHtml += `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 12px; color: #1e293b; font-size: 13px; vertical-align: top;">
          <strong>${item.name}</strong><span style="color:#64748b; font-size:11px;">${allergenInfo}</span>
          ${item.description ? `<div style="font-size:11px; color:#64748b;">${item.description}</div>` : ''}
        </td>
        <td style="padding: 8px 12px; text-align: right; font-weight: 700; color: #0f172a; font-size: 13px; white-space: nowrap; vertical-align: top;">
          ${item.price || '-'}
        </td>
      </tr>`;
        });
      });

      return `<div style="max-width: 480px; margin: 12px auto; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
  <div style="background: #0f172a; color: #ffffff; padding: 12px 16px; text-align: center;">
    <div style="font-weight: 700; font-size: 15px;">${dateTitle}</div>
    <div style="font-size: 11px; color: #94a3b8;">${restTitle} &bull; ${hours}</div>
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: left;">
    <tbody>${rowsHtml}
    </tbody>
  </table>
</div>`;
    }

    // Default: 'modern_light'
    let rowsHtml = '';
    Object.entries(categorizedDishes).forEach(([category, items]) => {
      const isSoup = category.toLowerCase().includes('polévk');
      const isDessert = category.toLowerCase().includes('dezert');
      const badgeColor = isSoup
        ? 'background-color: #fffbeb; color: #92400e; border-color: #fde68a;'
        : isDessert
        ? 'background-color: #fdf2f8; color: #9d174d; border-color: #fbcfe8;'
        : 'background-color: #f8fafc; color: #334155; border-color: #e2e8f0;';

      const icon = isSoup ? '🥣' : isDessert ? '🍰' : '🍴';

      rowsHtml += `
      <!-- KATEGORIE: ${category} -->
      <tr style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
        <td colspan="3" style="padding: 10px 20px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; ${badgeColor}">
          ${icon} ${category}
        </td>
      </tr>`;

      items.forEach((item) => {
        const allergenBadges = item.allergens && item.allergens.length > 0
          ? item.allergens
              .map(
                (a) =>
                  `<span style="display:inline-block; padding: 2px 7px; margin: 1px; font-size: 11px; background: #e2e8f0; color: #334155; border-radius: 10px; font-weight: 600;">${a}</span>`
              )
              .join(' ')
          : '<span style="color: #94a3b8; font-size: 12px;">–</span>';

        const descHtml = item.description
          ? `<div style="font-size: 12.5px; color: #64748b; margin-top: 3px; font-weight: 400; line-height: 1.4;">${item.description}</div>`
          : '';

        rowsHtml += `
      <tr style="border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
        <td style="padding: 13px 20px; color: #0f172a; font-size: 14px; vertical-align: middle;">
          <strong style="font-weight: 600; color: #0f172a; font-size: 14.5px;">${item.name}</strong>
          ${descHtml}
        </td>
        <td style="padding: 13px 12px; text-align: center; vertical-align: middle; width: 95px;">
          ${allergenBadges}
        </td>
        <td style="padding: 13px 20px; text-align: right; vertical-align: middle; width: 110px;">
          <span style="font-size: 15px; font-weight: 700; color: #b45309; white-space: nowrap;">${item.price || '-'}</span>
        </td>
      </tr>`;
      });
    });

    return `<div class="gastro-menu-widget" style="max-width: 780px; margin: 16px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08); color: #0f172a;">
  <!-- HLAVIČKA MENU -->
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 22px 26px; text-align: center;">
    <h3 style="margin: 0; font-size: 21px; font-weight: 700; letter-spacing: -0.4px; color: #ffffff;">${restTitle}</h3>
    <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #cbd5e1;">${dateTitle} &bull; Podáváme od ${hours} do vyprodání</p>
  </div>

  <!-- TABULKA POKRMŮ -->
  <table style="width: 100%; border-collapse: collapse; text-align: left; background-color: #ffffff;">
    <thead>
      <tr style="background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 11px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; font-weight: 600;">Denní nabídka</th>
        <th style="padding: 11px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; font-weight: 600; text-align: center; width: 95px;">Alergeny</th>
        <th style="padding: 11px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; font-weight: 600; text-align: right; width: 110px;">Cena</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}
    </tbody>
  </table>

  <!-- PATIČKA S UPOZORNĚNÍM -->
  <div style="background-color: #f8fafc; padding: 12px 20px; text-align: center; font-size: 11.5px; color: #64748b; border-top: 1px solid #e2e8f0;">
    Ceny jsou uvedeny včetně DPH. Seznam alergenů 1–14 je k nahlédnutí u personálu restaurace.
  </div>
</div>`;
  }, [
    selectedStyle,
    cleanAiSnippet,
    categorizedDishes,
    restaurantName,
    menuDate,
    servingHours,
  ]);

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
  <title>${restaurantName || 'Polední menu'} - ${menuDate || 'Denní nabídka'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px 16px; background-color: #f8fafc; color: #0f172a; margin: 0; }
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Přehledná HTML tabulka poledního menu
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Kompletní responzivní kód se všemi položkami ({dishes.length} jídel) připravený pro WordPress, Webnode, Shoptet či newsletter.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Zkopírováno do schránky!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Zkopírovat HTML kód</span>
              </>
            )}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all active:scale-95"
            title="Stáhnout jako samostatný soubor .html"
          >
            <Download className="w-4 h-4 text-stone-400" />
            <span>Stáhnout .html</span>
          </button>
        </div>
      </div>

      {/* Style selector pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs">
        <div className="flex items-center gap-2 text-stone-400">
          <Palette className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-stone-300">Styl tabulky:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedStyle('modern_light')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStyle === 'modern_light'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            ☀️ Moderní bistro (světlý)
          </button>
          <button
            onClick={() => setSelectedStyle('dark_luxury')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStyle === 'dark_luxury'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            🌙 Exkluzivní tmavý (dark)
          </button>
          <button
            onClick={() => setSelectedStyle('compact')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStyle === 'compact'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            📱 Kompaktní widget
          </button>
          <button
            onClick={() => setSelectedStyle('minimal_semantic')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedStyle === 'minimal_semantic'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            💻 Čisté HTML (bez stylů)
          </button>
          {cleanAiSnippet && (
            <button
              onClick={() => setSelectedStyle('ai_custom')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedStyle === 'ai_custom'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              🤖 AI původní
            </button>
          )}
        </div>
      </div>

      {/* View Switcher & Device Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Živý náhled na webu</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Zdrojový kód tabulky ({activeSnippet.length} znaků)</span>
          </button>
        </div>

        {viewMode === 'preview' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">Velikost okna:</span>
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                devicePreview === 'desktop'
                  ? 'bg-stone-700 text-white font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
              title="Počítač / plná šířka"
            >
              <Monitor className="w-3 h-3" />
              <span>Počítač</span>
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                devicePreview === 'mobile'
                  ? 'bg-stone-700 text-white font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
              title="Mobilní telefon (380px)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobil</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === 'preview' ? (
        <div className="rounded-2xl p-4 sm:p-8 border border-stone-800 bg-stone-900/40 backdrop-blur overflow-x-auto shadow-2xl flex justify-center">
          <div
            className={`transition-all duration-300 w-full ${
              devicePreview === 'mobile'
                ? 'max-w-[400px] border-4 border-stone-800 rounded-3xl p-3 bg-stone-950 shadow-2xl'
                : 'max-w-4xl'
            }`}
          >
            {devicePreview === 'mobile' && (
              <div className="flex justify-center mb-2">
                <span className="w-12 h-1 bg-stone-700 rounded-full" />
              </div>
            )}

            {/* We render in an isolated container with explicit color reset so that Tailwind dark styles don't turn table text white */}
            <div
              className="w-full text-slate-900 bg-slate-50 p-2 sm:p-4 rounded-xl border border-slate-300/40 shadow-inner"
              style={{
                color: selectedStyle === 'dark_luxury' ? '#ffffff' : '#0f172a',
                backgroundColor: selectedStyle === 'dark_luxury' ? '#090d16' : '#f8fafc',
              }}
              dangerouslySetInnerHTML={{ __html: activeSnippet }}
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              poledni-menu.html
            </span>
            <button
              onClick={handleCopyCode}
              className="text-amber-400 hover:text-amber-300 font-sans font-semibold flex items-center gap-1 active:scale-95 transition-transform"
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
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-xs text-stone-400 space-y-3">
        <h4 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-amber-400" />
          Jak tabulku jednoduše vložit na váš web:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-stone-300">
          <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">WordPress (Gutenberg / Elementor):</strong>
            Přidejte blok <em>&bdquo;Vlastní HTML&ldquo;</em> (Custom HTML), vložte kód a klikněte na Aktualizovat. Tabulka se okamžitě zobrazí se všemi barvami a písmy.
          </div>
          <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">Webnode, Wix & Squarespace:</strong>
            Přidejte prvek <em>&bdquo;HTML kód / Vložený kód&ldquo;</em> a vložte zkopírovaný snippet. Responzivní design se přizpůsobí šířce stránky.
          </div>
          <div className="bg-stone-950/70 p-3 rounded-lg border border-stone-800">
            <strong className="text-amber-400 block mb-1">E-mail newsletter (Mailchimp, Ecomail):</strong>
            Vložte HTML snippet do HTML bloku v e-mailovém editoru. Všechny styly jsou inline, takže se v e-mailových klientech nerozhodí.
          </div>
        </div>
      </div>
    </div>
  );
};
