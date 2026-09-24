import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Edit2, Check, DollarSign, Printer } from 'lucide-react';
import { Dish, OFFICIAL_ALLERGENS } from '../types/menu';

interface DishesEditorTabProps {
  dishes: Dish[];
  menuDate: string;
  restaurantName: string;
  servingHours: string;
  onUpdateDishes: (dishes: Dish[]) => void;
  onOpenPrintModal: () => void;
}

export const DishesEditorTab: React.FC<DishesEditorTabProps> = ({
  dishes,
  menuDate,
  restaurantName,
  servingHours,
  onUpdateDishes,
  onOpenPrintModal,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDish, setNewDish] = useState<Dish>({
    category: 'Hlavní jídla',
    name: '',
    description: '',
    price: '',
    allergens: [],
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleDishChange = (index: number, field: keyof Dish, value: any) => {
    const updated = [...dishes];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateDishes(updated);
  };

  const handleRemoveDish = (index: number) => {
    if (confirm(`Opravdu chcete odebrat položku "${dishes[index].name}"?`)) {
      const updated = dishes.filter((_, i) => i !== index);
      onUpdateDishes(updated);
    }
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;

    onUpdateDishes([...dishes, newDish]);
    setNewDish({
      category: 'Hlavní jídla',
      name: '',
      description: '',
      price: '',
      allergens: [],
    });
    setIsAdding(false);
  };

  const categories = Array.from(new Set(dishes.map((d) => d.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            Správa a úprava položek denního menu
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Zde můžete upravit názvy jídel, ceny, doplňující popisky nebo přidat další chod
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat jídlo</span>
          </button>
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-stone-400" />
            <span>Tisk menu na papír / tabuli</span>
          </button>
        </div>
      </div>

      {/* Add new dish card */}
      {isAdding && (
        <form
          onSubmit={handleAddDish}
          className="bg-stone-900 border border-amber-500/40 rounded-xl p-4 space-y-3 animate-in fade-in"
        >
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Nová položka poledního menu:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Kategorie:</label>
              <select
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
              >
                <option value="Polévky">Polévky</option>
                <option value="Hlavní jídla">Hlavní jídla</option>
                <option value="Dezerty a doplňky">Dezerty a doplňky</option>
                <option value="Týdenní speciál">Týdenní speciál</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-stone-400 mb-1">Název jídla:</label>
              <input
                type="text"
                required
                placeholder="např. 150g Kuřecí steak na bylinkách"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Cena (Kč):</label>
              <input
                type="text"
                placeholder="např. 169 Kč"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-stone-400 mb-1">Popis / Příloha:</label>
            <input
              type="text"
              placeholder="např. s grilovanou zeleninou a bramborami grenaille"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-semibold"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
            >
              Uložit a přidat
            </button>
          </div>
        </form>
      )}

      {/* Dishes List */}
      <div className="space-y-3">
        {dishes.map((dish, index) => {
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className="bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-xl p-4 transition-all"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Kategorie:</label>
                      <input
                        type="text"
                        value={dish.category}
                        onChange={(e) => handleDishChange(index, 'category', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-400 mb-1">Název jídla:</label>
                      <input
                        type="text"
                        value={dish.name}
                        onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Cena:</label>
                      <input
                        type="text"
                        value={dish.price}
                        onChange={(e) => handleDishChange(index, 'price', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Popis / Příloha:</label>
                    <input
                      type="text"
                      value={dish.description || ''}
                      onChange={(e) => handleDishChange(index, 'description', e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-100"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Hotovo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                        {dish.category}
                      </span>
                      <strong className="text-sm text-stone-100">{dish.name}</strong>
                      <span className="text-xs font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {dish.price}
                      </span>
                    </div>
                    {dish.description && (
                      <p className="text-xs text-stone-400">{dish.description}</p>
                    )}
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-0.5">
                      <span>Alergeny:</span>
                      {dish.allergens && dish.allergens.length > 0 ? (
                        <span className="text-rose-400 font-mono font-bold">
                          {dish.allergens.join(', ')}
                        </span>
                      ) : (
                        <span className="text-emerald-400">Bez alergenů</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                      title="Upravit položku"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveDish(index)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-400 transition-colors"
                      title="Odebrat z menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
