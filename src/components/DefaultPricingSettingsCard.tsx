import React, { useState } from 'react';
import {
  DollarSign,
  Settings2,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  DefaultPricingSettings,
  INITIAL_DEFAULT_PRICING,
} from '../data/defaultPricingStorage';

interface DefaultPricingSettingsProps {
  settings: DefaultPricingSettings;
  onSaveSettings: (settings: DefaultPricingSettings) => void;
}

export const DefaultPricingSettingsCard: React.FC<DefaultPricingSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<DefaultPricingSettings>(settings);
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  const handleToggleGlobal = () => {
    const updated = {
      ...current,
      enabled: !current.enabled,
    };
    setCurrent(updated);
    onSaveSettings(updated);
  };

  const handleCategoryPriceChange = (
    key: keyof DefaultPricingSettings['categories'],
    val: number
  ) => {
    const updated = {
      ...current,
      categories: {
        ...current.categories,
        [key]: {
          ...current.categories[key],
          price: isNaN(val) ? 0 : val,
        },
      },
    };
    setCurrent(updated);
    onSaveSettings(updated);
    triggerSaved();
  };

  const handleCategoryToggle = (
    key: keyof DefaultPricingSettings['categories']
  ) => {
    const updated = {
      ...current,
      categories: {
        ...current.categories,
        [key]: {
          ...current.categories[key],
          enabled: !current.categories[key].enabled,
        },
      },
    };
    setCurrent(updated);
    onSaveSettings(updated);
  };

  const handleReset = () => {
    setCurrent(INITIAL_DEFAULT_PRICING);
    onSaveSettings(INITIAL_DEFAULT_PRICING);
    triggerSaved();
  };

  const triggerSaved = () => {
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 1800);
  };

  const categoryItems: {
    key: keyof DefaultPricingSettings['categories'];
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      key: 'soups',
      label: 'Polévky',
      description: 'Denní vývary, kulajdy, gulášovky, česnečky',
      icon: '🥣',
    },
    {
      key: 'mains',
      label: 'Hlavní chody',
      description: 'Svíčková, řízky, těstoviny, burgery, minutky',
      icon: '🍖',
    },
    {
      key: 'specials',
      label: 'Týdenní speciály',
      description: 'Šéfkuchař doporučuje, steaky, ryby',
      icon: '⭐',
    },
    {
      key: 'desserts',
      label: 'Dezerty & sladké',
      description: 'Palačinky, štrúdly, lívance, poháry',
      icon: '🍰',
    },
  ];

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-md">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-850/50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-stone-200">
                Výchozí cenová hladina pro kategorie
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  current.enabled
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {current.enabled ? 'Aktivní automatické doplňování' : 'Vypnuto'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Pokud na fotce nebo v lístku chybí cena, automaticky doplní vaše zvyklé ceny (např. Polévka{' '}
              <strong className="text-stone-300 font-medium">
                {current.categories.soups.price} Kč
              </strong>
              , Hlavní chod{' '}
              <strong className="text-stone-300 font-medium">
                {current.categories.mains.price} Kč
              </strong>
              )
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSavedRecently && (
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Uloženo
            </span>
          )}
          <button
            type="button"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded configuration body */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-stone-800/80 bg-stone-950/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-stone-300">
                <span className="font-semibold text-stone-200">
                  Jak automatická cenová hladina funguje:
                </span>
                <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                  Pokud kuchař na tabuli zapomene napsat cenu nebo je na papíru rozmazaná,
                  systém jízdní lístek automaticky osadí vaší standardní cenou pro danou kategorii.
                  V editoru jídla lze jakoukoliv cenu kdykoliv dodatečně přepsat.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                title="Vrátit standardní české hospodské ceny"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleToggleGlobal}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  current.enabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'
                }`}
              >
                {current.enabled ? 'Zapnuto' : 'Vypnuto'}
              </button>
            </div>
          </div>

          {/* Grid of category prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categoryItems.map((item) => {
              const catConfig = current.categories[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    catConfig.enabled && current.enabled
                      ? 'bg-stone-900 border-stone-700/80 shadow-sm'
                      : 'bg-stone-950/60 border-stone-850 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={catConfig.enabled}
                        onChange={() => handleCategoryToggle(item.key)}
                        disabled={!current.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-7 h-4 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <p className="text-[10px] text-stone-400 mb-2.5 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        disabled={!current.enabled || !catConfig.enabled}
                        value={catConfig.price || ''}
                        onChange={(e) =>
                          handleCategoryPriceChange(item.key, parseInt(e.target.value, 10))
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 font-mono text-right pr-9 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-stone-400 pointer-events-none font-medium">
                        Kč
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
