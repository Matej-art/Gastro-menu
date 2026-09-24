import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MenuInput } from './components/MenuInput';
import { SocialMediaTab } from './components/SocialMediaTab';
import { HtmlTableTab } from './components/HtmlTableTab';
import { AllergenInspectorTab } from './components/AllergenInspectorTab';
import { DishesEditorTab } from './components/DishesEditorTab';
import { PrintMenuModal } from './components/PrintMenuModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MenuHistoryBar } from './components/MenuHistoryBar';
import { DefaultPricingSettingsCard } from './components/DefaultPricingSettingsCard';
import { SAMPLE_PRESETS, SampleMenuPreset } from './data/presets';
import { MenuAnalysisResult, Dish } from './types/menu';
import {
  getMenuHistory,
  saveMenuToHistory,
  deleteHistoryItem,
  clearAllMenuHistory,
  HistoryMenuItem,
} from './data/historyStorage';
import {
  getDefaultPricingSettings,
  saveDefaultPricingSettings,
  applyDefaultCategoryPrices,
  DefaultPricingSettings,
} from './data/defaultPricingStorage';
import {
  Share2,
  Code2,
  ShieldAlert,
  Utensils,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChefHat,
  ArrowRight,
  Crown,
  Clock,
  History,
} from 'lucide-react';

export default function App() {
  // Start with first preset loaded by default so the user sees a complete, rich, live demonstration immediately!
  const [result, setResult] = useState<MenuAnalysisResult | null>(
    SAMPLE_PRESETS[0].sampleResult
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'social' | 'html' | 'allergens' | 'dishes'>('social');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [lastPayload, setLastPayload] = useState<{
    image?: string;
    mimeType?: string;
    text?: string;
    tone: string;
    restaurantName: string;
    specialsNote: string;
  } | null>(null);

  // Local storage menu history (up to 5 recent menus)
  const [menuHistory, setMenuHistory] = useState<HistoryMenuItem[]>(() => {
    const existing = getMenuHistory();
    if (existing.length === 0 && SAMPLE_PRESETS[0]?.sampleResult) {
      // Seed with initial sample preset so user immediately sees how history works
      return saveMenuToHistory(SAMPLE_PRESETS[0].sampleResult);
    }
    return existing;
  });

  // Default pricing settings for missing prices
  const [defaultPricingSettings, setDefaultPricingSettings] = useState<DefaultPricingSettings>(() => {
    return getDefaultPricingSettings();
  });

  const handleSaveDefaultPricing = (updated: DefaultPricingSettings) => {
    setDefaultPricingSettings(updated);
    saveDefaultPricingSettings(updated);
  };

  // Modals state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // Subscription state (persisted in localStorage)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gastromenu_pro_active') === 'true';
    } catch {
      return false;
    }
  });

  const handleActivateSubscription = (planName: string, method: string) => {
    setIsSubscribed(true);
    try {
      localStorage.setItem('gastromenu_pro_active', 'true');
      localStorage.setItem(
        'gastromenu_pro_details',
        JSON.stringify({ planName, method, activatedAt: new Date().toISOString() })
      );
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleCancelSubscription = () => {
    setIsSubscribed(false);
    try {
      localStorage.removeItem('gastromenu_pro_active');
      localStorage.removeItem('gastromenu_pro_details');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const executeAnalyzeRequest = async (payload: any) => {
    const payloadWithSettings = {
      ...payload,
      defaultPricing: defaultPricingSettings,
    };

    const response = await fetch('/api/analyze-menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadWithSettings),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Nastala chyba při zpracování menu.');
    }

    // Client-side fallback check: Ensure any dishes with empty/missing price are filled according to default settings
    const analyzedData = data.data;
    if (analyzedData && Array.isArray(analyzedData.dishes)) {
      const { dishes: filledDishes } = applyDefaultCategoryPrices(
        analyzedData.dishes,
        defaultPricingSettings
      );
      analyzedData.dishes = filledDishes;
    }

    return analyzedData;
  };

  const handleAnalyze = async (payload: {
    image?: string;
    mimeType?: string;
    text?: string;
    tone: string;
    restaurantName: string;
    specialsNote: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryCountdown(null);
    setLastPayload(payload);

    try {
      const data = await executeAnalyzeRequest(payload);
      setResult(data);
      // Automatically save to local history (last 5 menus)
      const updatedHistory = saveMenuToHistory(data);
      setMenuHistory(updatedHistory);
      // Immediately display the extracted dishes list so the user sees the parsed food items right away
      setActiveTab('dishes');
    } catch (err: any) {
      console.warn('Initial analysis attempt failed:', err);
      const rawMsg = err.message || '';
      const isTransient =
        rawMsg.includes('503') ||
        rawMsg.includes('plno') ||
        rawMsg.includes('UNAVAILABLE') ||
        rawMsg.includes('přetížení') ||
        rawMsg.includes('high demand') ||
        rawMsg.includes('429');

      if (isTransient) {
        // Automatic 3-second countdown retry as requested
        for (let sec = 3; sec >= 1; sec--) {
          setRetryCountdown(sec);
          await new Promise((r) => setTimeout(r, 1000));
        }
        setRetryCountdown(null);

        try {
          console.log('Retrying analysis after 3s delay...');
          const retryData = await executeAnalyzeRequest(payload);
          setResult(retryData);
          setActiveTab('dishes');
          setIsLoading(false);
          return;
        } catch (retryErr: any) {
          console.error('Retry analysis also failed:', retryErr);
          setErrorMessage('AI má teď plno, zkus to prosím za chvíli znovu');
          setIsLoading(false);
          return;
        }
      }

      setErrorMessage(rawMsg || 'Nepodařilo se připojit k AI modelu.');
    } finally {
      setIsLoading(false);
      setRetryCountdown(null);
    }
  };

  const handleSelectPreset = (preset: SampleMenuPreset) => {
    setResult(preset.sampleResult);
    setErrorMessage(null);
    const updatedHistory = saveMenuToHistory(preset.sampleResult);
    setMenuHistory(updatedHistory);
  };

  const handleSelectFromHistory = (historyMenu: MenuAnalysisResult) => {
    setResult(historyMenu);
    setErrorMessage(null);
    // Switch to dishes tab or social tab for instant review
    setActiveTab('dishes');
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setMenuHistory(updated);
  };

  const handleClearAllHistory = () => {
    if (confirm('Opravdu chcete vymazat celou historii uložených menu z tohoto prohlížeče?')) {
      clearAllMenuHistory();
      setMenuHistory([]);
    }
  };

  const handleScrollToHistory = () => {
    const el = document.getElementById('gastro-history-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to re-generate HTML table snippet when dishes or allergens are edited
  const handleUpdateDishes = (newDishes: Dish[]) => {
    if (!result) return;

    // Dynamically rebuild the clean styled HTML table
    const dishesByCategory: Record<string, Dish[]> = {};
    newDishes.forEach((d) => {
      const cat = d.category || 'Hlavní jídla';
      if (!dishesByCategory[cat]) dishesByCategory[cat] = [];
      dishesByCategory[cat].push(d);
    });

    let styledHtmlRows = '';
    let minimalHtmlRows = '';

    Object.entries(dishesByCategory).forEach(([category, items]) => {
      styledHtmlRows += `\n      <tr style="background-color: #fffbeb;"><td colspan="3" style="padding: 10px 20px; font-weight: 700; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">🍴 ${category}</td></tr>`;
      minimalHtmlRows += `\n    <tr class="category"><th colspan="3">${category}</th></tr>`;

      items.forEach((item) => {
        const allergenStr = item.allergens && item.allergens.length > 0 ? item.allergens.join(', ') : '-';
        styledHtmlRows += `\n      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 20px;">
          <strong style="color: #0f172a; font-size: 15px;">${item.name}</strong>
          ${item.description ? `<div style="color: #64748b; font-size: 13px; margin-top: 2px;">${item.description}</div>` : ''}
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">${allergenStr}</span>
        </td>
        <td style="padding: 14px 20px; text-align: right; font-weight: 700; color: #0f172a; font-size: 15px;">${item.price}</td>
      </tr>`;

        minimalHtmlRows += `\n    <tr><td>${item.name}</td><td>${allergenStr}</td><td>${item.price}</td></tr>`;
      });
    });

    const updatedStyled = `<div class="gastro-menu-container" style="max-width: 780px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eaeaea;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 24px 28px; text-align: center;">
    <h3 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">${result.restaurantName || 'Naše polední nabídka'}</h3>
    <p style="margin: 0; font-size: 14px; opacity: 0.85;">${result.menuDate} | ${result.servingHours || 'Podáváme od 11:00'}</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: left;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 12px 20px; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 600;">Položka menu</th>
        <th style="padding: 12px 16px; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 600; text-align: center; width: 100px;">Alergeny</th>
        <th style="padding: 12px 20px; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 600; text-align: right; width: 110px;">Cena</th>
      </tr>
    </thead>
    <tbody>${styledHtmlRows}
    </tbody>
  </table>
  <div style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    Informace o obsažených alergenech vám ochotně poskytne personál restaurace.
  </div>
</div>`;

    const updatedMinimal = `<table class="daily-menu-table">
  <thead>
    <tr><th>Jídlo</th><th>Alergeny</th><th>Cena</th></tr>
  </thead>
  <tbody>${minimalHtmlRows}
  </tbody>
</table>`;

    const updatedResult: MenuAnalysisResult = {
      ...result,
      dishes: newDishes,
      htmlTable: {
        styledSnippet: updatedStyled,
        minimalSnippet: updatedMinimal,
      },
    };

    setResult(updatedResult);
    // Also save updated version to history
    const updatedHistory = saveMenuToHistory(updatedResult);
    setMenuHistory(updatedHistory);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header
        onLoadPreset={(presetId) => {
          const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
          if (found) handleSelectPreset(found);
        }}
        isSubscribed={isSubscribed}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        historyCount={menuHistory.length}
        onScrollToHistory={handleScrollToHistory}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-100">
                Gastro asistent pro majitele a šéfkuchaře
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Vyfoťte papírový jídelní lístek ze stolu nebo vložte text menu. Systém ihned vygeneruje
              lákavé <strong>příspěvky pro Facebook a Instagram</strong>, <strong>HTML tabulku na web</strong> a{' '}
              <strong>oficiální kontrolu alergenů 1–14</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {!isSubscribed && (
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Předplatné (149 Kč/měs)</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 self-start md:self-auto">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Připraveno pro české restaurace & bistra</span>
            </div>
          </div>
        </div>

        {/* Automatic Retry Countdown Banner */}
        {retryCountdown !== null && (
          <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-4 text-amber-200 text-sm flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <strong className="block font-semibold text-amber-100">
                  AI má teď plno, probíhá automatické zopakování:
                </strong>
                <p className="text-xs mt-0.5 text-amber-300">
                  Zkouším to automaticky znovu za <strong>{retryCountdown} {retryCountdown === 1 ? 'sekundu' : 'sekundy'}</strong>...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input section: photo / text / presets */}
        <MenuInput
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onSelectPreset={handleSelectPreset}
          isSubscribed={isSubscribed}
          onRequireSubscription={() => setIsSubscriptionModalOpen(true)}
        />

        {/* Default Pricing Settings for food categories */}
        <DefaultPricingSettingsCard
          settings={defaultPricingSettings}
          onSaveSettings={handleSaveDefaultPricing}
        />

        {/* Local Storage History of up to 5 recent menus */}
        {menuHistory.length > 0 && (
          <div id="gastro-history-section">
            <MenuHistoryBar
              history={menuHistory}
              onSelectMenu={handleSelectFromHistory}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              currentMenuTitle={result ? `${result.restaurantName} – ${result.menuDate}` : undefined}
            />
          </div>
        )}

        {/* Error notification if any */}
        {errorMessage && !retryCountdown && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 text-rose-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-rose-100">Chyba při zpracování menu:</strong>
                <p className="text-xs mt-0.5 text-rose-200/90 leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {lastPayload && (
                <button
                  onClick={() => handleAnalyze(lastPayload)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800/80 active:bg-rose-700 text-rose-100 border border-rose-600/50 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Zkusit znovu</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1.5 hover:bg-rose-900/40 text-rose-300 hover:text-rose-100 rounded-lg text-xs transition-colors"
                title="Zavřít"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Generated Results Area */}
        {result && (
          <section className="space-y-6 pt-4 border-t border-stone-800/80">
            {/* Results Title and Restaurant Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block">
                  Vygenerovaný výsledek
                </span>
                <h2 className="text-xl font-bold text-stone-100 font-serif">
                  {result.restaurantName || 'Naše restaurace'} – {result.menuDate}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Podáváme: {result.servingHours || '11:00 – 14:30'} • Celkem {result.dishes?.length || 0} položek
                </p>
              </div>

              {/* Main Tab Navigation */}
              <div className="flex flex-wrap rounded-xl bg-stone-950 p-1 border border-stone-800 self-start sm:self-auto gap-1">
                <button
                  onClick={() => setActiveTab('dishes')}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'dishes'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>1. Seznam jídel z menu ({result.dishes?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('social')}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'social'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>2. Sociální sítě (FB & IG)</span>
                </button>

                <button
                  onClick={() => setActiveTab('html')}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'html'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>3. HTML tabulka na web</span>
                </button>

                <button
                  onClick={() => setActiveTab('allergens')}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'allergens'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>4. Kontrola alergenů (1–14)</span>
                </button>
              </div>
            </div>

            {/* Quick extracted summary metrics strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  {result.dishes?.length || 0}
                </span>
                <div>
                  <span className="text-stone-400 text-[11px] block">Nalezeno položek</span>
                  <strong className="text-stone-200">v denním lístku</strong>
                </div>
              </div>
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  {result.dishes?.filter((d) => d.category?.toLowerCase().includes('polévk')).length || 0}
                </span>
                <div>
                  <span className="text-stone-400 text-[11px] block">Polévky</span>
                  <strong className="text-stone-200">v nabídce</strong>
                </div>
              </div>
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                  {result.dishes?.filter(
                    (d) =>
                      !d.category?.toLowerCase().includes('polévk') &&
                      !d.category?.toLowerCase().includes('dezert') &&
                      !d.category?.toLowerCase().includes('sladk')
                  ).length || 0}
                </span>
                <div>
                  <span className="text-stone-400 text-[11px] block">Hlavní chody</span>
                  <strong className="text-stone-200">teplá i studená</strong>
                </div>
              </div>
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
                  {result.dishes?.filter(
                    (d) =>
                      d.category?.toLowerCase().includes('dezert') ||
                      d.category?.toLowerCase().includes('sladk')
                  ).length || 0}
                </span>
                <div>
                  <span className="text-stone-400 text-[11px] block">Dezerty & sladké</span>
                  <strong className="text-stone-200">sladká tečka</strong>
                </div>
              </div>
            </div>

            {/* Tab 1: Dishes Editor and Printable View */}
            {activeTab === 'dishes' && (
              <DishesEditorTab
                dishes={result.dishes}
                menuDate={result.menuDate}
                restaurantName={result.restaurantName}
                servingHours={result.servingHours}
                onUpdateDishes={handleUpdateDishes}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
              />
            )}

            {/* Tab 2: Social Media Posts */}
            {activeTab === 'social' && (
              <SocialMediaTab
                facebook={result.socialPosts.facebook}
                instagram={result.socialPosts.instagram}
                smsWhatsapp={result.socialPosts.smsWhatsapp}
                restaurantName={result.restaurantName}
                menuDate={result.menuDate}
                marketingTips={result.marketingTips}
              />
            )}

            {/* Tab 3: HTML Table for Website */}
            {activeTab === 'html' && (
              <HtmlTableTab
                styledSnippet={result.htmlTable?.styledSnippet || ''}
                minimalSnippet={result.htmlTable?.minimalSnippet || ''}
                restaurantName={result.restaurantName}
                menuDate={result.menuDate}
                servingHours={result.servingHours}
                dishes={result.dishes || []}
              />
            )}

            {/* Tab 4: Official Allergens 1-14 Check */}
            {activeTab === 'allergens' && (
              <AllergenInspectorTab
                allergenAnalysis={result.allergenAnalysis}
                dishes={result.dishes}
                onUpdateDishes={handleUpdateDishes}
              />
            )}
          </section>
        )}
      </main>

      {/* Print modal */}
      {result && (
        <PrintMenuModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          dishes={result.dishes}
          restaurantName={result.restaurantName}
          menuDate={result.menuDate}
          servingHours={result.servingHours}
        />
      )}

      {/* Subscription Paywall Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        isSubscribed={isSubscribed}
        onActivateSubscription={handleActivateSubscription}
        onCancelSubscription={handleCancelSubscription}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800 bg-stone-950 py-6 text-center text-xs text-stone-500 space-y-1">
        <p className="font-medium text-stone-400">
          GastroMenu Asistent Pro – Vytvořeno pro majitele restaurací, bister a kaváren v České republice
        </p>
        <p>
          Rychlý export poledních nabídek na Facebook, Instagram, firemní weby a oficiální audit alergenů 1–14
        </p>
      </footer>
    </div>
  );
}
