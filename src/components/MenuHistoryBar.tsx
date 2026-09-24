import React from 'react';
import { History, Clock, ArrowRight, Trash2, Utensils, RotateCcw, Sparkles } from 'lucide-react';
import { HistoryMenuItem } from '../data/historyStorage';
import { MenuAnalysisResult } from '../types/menu';

interface MenuHistoryBarProps {
  history: HistoryMenuItem[];
  onSelectMenu: (menu: MenuAnalysisResult) => void;
  onDeleteItem: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  currentMenuTitle?: string;
}

export const MenuHistoryBar: React.FC<MenuHistoryBarProps> = ({
  history,
  onSelectMenu,
  onDeleteItem,
  onClearAll,
  currentMenuTitle,
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / 86400000);

      if (diffMin < 1) return 'před chvilkou';
      if (diffMin < 60) return `před ${diffMin} min`;
      if (diffHours < 24) return `dnes před ${diffHours} h`;
      if (diffDays === 1) return 'včera';
      return `${date.getDate()}. ${date.getMonth() + 1}.`;
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-200">
                Nedávná historie menu
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700/60 font-medium">
                {history.length} / 5 uložených v paměti
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Uloženo automaticky v tomto prohlížeči – kliknutím se okamžitě vrátíte k předešlé nabídce a můžete ji dál upravit.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-800/80 cursor-pointer"
          title="Smazat celou historii"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Vyčistit historii</span>
        </button>
      </div>

      {/* List of up to 5 history items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 pt-1">
        {history.map((item) => {
          const isSelected =
            currentMenuTitle &&
            currentMenuTitle.toLowerCase().trim() ===
              `${item.restaurantName} – ${item.menuDate}`.toLowerCase().trim();

          return (
            <div
              key={item.id}
              onClick={() => onSelectMenu(item.data)}
              className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-stone-950/70 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="font-semibold text-xs text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.restaurantName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => onDeleteItem(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400 p-0.5 rounded transition-opacity"
                    title="Odstranit z historie"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-[11px] text-amber-400/90 font-medium mb-1.5 line-clamp-1">
                  {item.menuDate}
                </div>

                {item.previewDishes && item.previewDishes.length > 0 && (
                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed mb-2">
                    {item.previewDishes.join(', ')}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Utensils className="w-2.5 h-2.5 text-stone-400" />
                  {item.dishesCount} položek
                </span>
                <span className="flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                  <Clock className="w-2.5 h-2.5" />
                  {formatRelativeTime(item.savedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
