import React from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Share2,
  Code2,
  ShieldAlert,
  Crown,
  Rocket,
  CheckCircle2,
  History,
} from 'lucide-react';

interface HeaderProps {
  onLoadPreset: (presetId: string) => void;
  isSubscribed: boolean;
  onOpenSubscriptionModal: () => void;
  onOpenDeploymentGuide: () => void;
  historyCount?: number;
  onScrollToHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  isSubscribed,
  onOpenSubscriptionModal,
  onOpenDeploymentGuide,
  historyCount = 0,
  onScrollToHistory,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-100 tracking-tight flex items-center gap-2 font-['Playfair_Display',serif]">
                GastroMenu Asistent Pro
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                AI Gastro
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Chytrý převod fotky nebo textu menu na sítě, webový HTML kód a audit alergenů 1–14
            </p>
          </div>
        </div>

        {/* Feature badges and Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* History button if menus are stored */}
          {historyCount > 0 && onScrollToHistory && (
            <button
              onClick={onScrollToHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Přejít na historii uložených menu"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">Historie ({historyCount}/5)</span>
            </button>
          )}

          {/* Deployment Guide Button */}
          <button
            onClick={onOpenDeploymentGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-stone-100 transition-colors cursor-pointer"
            title="Návod k nasazení aplikace a nastavení API klíče"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Návod k nasazení</span>
          </button>

          {/* Subscription Button */}
          {isSubscribed ? (
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold transition-all cursor-pointer shadow-sm"
              title="Správa předplatného"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRO Aktivní (149 Kč/měs)</span>
            </button>
          ) : (
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Aktivovat předplatné (149 Kč/měsíc)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
