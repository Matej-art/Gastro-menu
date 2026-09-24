import React from 'react';
import { Printer, X } from 'lucide-react';
import { Dish, OFFICIAL_ALLERGENS } from '../types/menu';

interface PrintMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  restaurantName: string;
  menuDate: string;
  servingHours: string;
}

export const PrintMenuModal: React.FC<PrintMenuModalProps> = ({
  isOpen,
  onClose,
  dishes,
  restaurantName,
  menuDate,
  servingHours,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getCategoryRank = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('polévk')) return 1;
    if (c.includes('hlavní')) return 2;
    if (c.includes('speciál') || c.includes('týden')) return 3;
    if (c.includes('salát') || c.includes('předkrm')) return 4;
    if (c.includes('dezert') || c.includes('sladk')) return 10;
    return 5;
  };

  const categories = Array.from(new Set(dishes.map((d) => d.category))).sort(
    (a, b) => getCategoryRank(a) - getCategoryRank(b)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-stone-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {/* Modal Controls (hidden during print) */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-stone-800 font-bold text-base">
            <Printer className="w-5 h-5 text-amber-600" />
            <span>Tiskový náhled denního menu (A4)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Vytisknout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Menu Paper Sheet */}
        <div className="border-4 border-stone-900 p-8 rounded-lg space-y-6 text-center">
          {/* Header */}
          <div className="space-y-1 border-b-2 border-stone-900 pb-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight uppercase text-stone-950">
              {restaurantName || 'Naše Restaurace & Bistro'}
            </h1>
            <h2 className="text-base sm:text-lg font-bold text-amber-700 tracking-wide uppercase">
              {menuDate || 'Denní polední nabídka'}
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Podáváme {servingHours || '11:00 – 14:30 nebo do vyprodání'}
            </p>
          </div>

          {/* Dishes by Category */}
          <div className="space-y-6 text-left">
            {categories.map((cat) => {
              const catDishes = dishes.filter((d) => d.category === cat);
              return (
                <div key={cat} className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 border-b border-stone-300 pb-1 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-[11px] font-normal text-stone-500 lowercase">cena</span>
                  </h3>
                  <div className="space-y-3 pt-1">
                    {catDishes.map((dish, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-sm text-stone-900">
                            {dish.name}
                            {dish.allergens && dish.allergens.length > 0 && (
                              <span className="ml-2 text-[11px] font-normal text-stone-600">
                                (A: {dish.allergens.join(', ')})
                              </span>
                            )}
                          </div>
                          {dish.description && (
                            <div className="text-xs text-stone-600 italic">
                              {dish.description}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-sm text-stone-950 font-mono text-right whitespace-nowrap">
                          {dish.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer allergen note */}
          <div className="border-t-2 border-stone-900 pt-4 text-[11px] text-stone-600 text-center leading-relaxed">
            <p className="font-semibold">
              Seznam alergenů 1–14 k nahlédnutí u obsluhy podniku. Přejeme vám dobrou chuť!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
