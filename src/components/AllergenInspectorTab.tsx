import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  Edit3,
  Check,
  Copy,
  Plus,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { OFFICIAL_ALLERGENS, AllergenAnalysis, Dish } from '../types/menu';

interface AllergenInspectorTabProps {
  allergenAnalysis: AllergenAnalysis;
  dishes: Dish[];
  onUpdateDishes: (updatedDishes: Dish[]) => void;
}

export const AllergenInspectorTab: React.FC<AllergenInspectorTabProps> = ({
  allergenAnalysis,
  dishes,
  onUpdateDishes,
}) => {
  const [selectedAllergen, setSelectedAllergen] = useState<number | null>(null);
  const [editingDishIndex, setEditingDishIndex] = useState<number | null>(null);
  const [copiedLegend, setCopiedLegend] = useState<boolean>(false);

  // Compute all currently used allergen numbers across dishes
  const usedAllergenNumbers = Array.from(
    new Set(dishes.flatMap((d) => d.allergens || []))
  ).sort((a, b) => a - b);

  const toggleAllergenForDish = (dishIndex: number, allergenNum: number) => {
    const dish = dishes[dishIndex];
    const current = dish.allergens || [];
    let updatedAllergens: number[];

    if (current.includes(allergenNum)) {
      updatedAllergens = current.filter((n) => n !== allergenNum);
    } else {
      updatedAllergens = [...current, allergenNum].sort((a, b) => a - b);
    }

    const newDishes = [...dishes];
    newDishes[dishIndex] = { ...dish, allergens: updatedAllergens };
    onUpdateDishes(newDishes);
  };

  const copyOfficialLegend = () => {
    const text = `OFICIÁLNÍ SEZNAM ALERGENŮ (dle nařízení EU č. 1169/2011):
1 - Obiloviny obsahující lepek
2 - Korýši a výrobky z nich
3 - Vejce a výrobky z nich
4 - Ryby a výrobky z nich
5 - Jádra podzemnice olejné (arašídy)
6 - Sójové boby (sója)
7 - Mléko a výrobky z něj
8 - Skořápkové plody (ořechy)
9 - Celer a výrobky z něj
10 - Hořčice a výrobky z ní
11 - Sezamová semena
12 - Oxid siřičitý a siřičitany
13 - Vlčí bob (lupina)
14 - Měkkýši a výrobky z nich

Informace o obsažených alergenech v jednotlivých pokrmech vám na vyžádání ochotně sdělí obsluha.`;
    navigator.clipboard.writeText(text);
    setCopiedLegend(true);
    setTimeout(() => setCopiedLegend(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Oficiální kontrola a seznam alergenů (1–14)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Audit podle směrnice EU 1169/2011 a české legislativy včetně varování před skrytými alergeny
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Detekováno {usedAllergenNumbers.length} z 14 alergenů</span>
          </div>

          <button
            onClick={copyOfficialLegend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all"
            title="Zkopírovat zákonnou legendu k vyvěšení na zeď nebo na lístek"
          >
            {copiedLegend ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legenda zkopírována!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Kopírovat legendu 1–14</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety warnings from AI Chef Inspector */}
      {allergenAnalysis.safetyWarnings && allergenAnalysis.safetyWarnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Kontrola & doporučení šéfkuchaře (pozor na skryté alergeny):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-200/90">
            {allergenAnalysis.safetyWarnings.map((warning, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-stone-900/80 p-2.5 rounded-lg border border-amber-500/20"
              >
                <span className="text-amber-400 font-bold">•</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All 14 Official Allergens Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-amber-400" />
            Oficiální číselník EU 1–14 & dnešní výskyt:
          </h3>
          <span className="text-[11px] text-stone-500">
            Kliknutím na alergen zvýrazníte dotčená jídla
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {OFFICIAL_ALLERGENS.map((item) => {
            const isUsed = usedAllergenNumbers.includes(item.number);
            const isSelected = selectedAllergen === item.number;
            const dishesWithThis = dishes.filter((d) => (d.allergens || []).includes(item.number));

            return (
              <div
                key={item.number}
                onClick={() => setSelectedAllergen(isSelected ? null : item.number)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 shadow-lg ring-2 ring-amber-400/50'
                    : isUsed
                    ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400/60'
                    : 'border-stone-800 bg-stone-900/40 opacity-60 hover:opacity-100 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isUsed
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {item.number}
                    </span>
                    <span className="text-base">{item.icon}</span>
                  </div>
                  <div className="font-semibold text-xs text-stone-200 line-clamp-2 leading-tight">
                    {item.name}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                  {isUsed ? (
                    <span className="text-rose-400 font-bold">
                      {dishesWithThis.length} {dishesWithThis.length === 1 ? 'jídlo' : 'jídel'}
                    </span>
                  ) : (
                    <span className="text-stone-500">V menu není</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Allergen Drill-Down */}
      {selectedAllergen !== null && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 animate-in fade-in">
          {(() => {
            const allergenInfo = OFFICIAL_ALLERGENS.find((a) => a.number === selectedAllergen);
            const matchingDishes = dishes.filter((d) =>
              (d.allergens || []).includes(selectedAllergen)
            );

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
                      {selectedAllergen}
                    </span>
                    <span className="font-bold text-stone-100 text-sm">
                      {allergenInfo?.name} {allergenInfo?.icon}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAllergen(null)}
                    className="text-xs text-stone-400 hover:text-stone-200"
                  >
                    Zavřít detail ✕
                  </button>
                </div>
                <p className="text-xs text-stone-400">
                  Typické zdroje v kuchyni: <strong className="text-stone-300">{allergenInfo?.example}</strong>
                </p>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-stone-300 mb-1.5">
                    Položky dnešního menu obsahující tento alergen ({matchingDishes.length}):
                  </div>
                  {matchingDishes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchingDishes.map((dish, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-1.5"
                        >
                          <span className="text-amber-400">🍴</span>
                          <span>{dish.name}</span>
                          <span className="text-stone-400">({dish.price})</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400 font-medium">
                      ✓ Žádné dnešní jídlo tento alergen neobsahuje.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Interactive Dish-by-Dish Allergen Assignment */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-amber-400" />
            Interaktivní kontrola a úprava alergenů u jednotlivých jídel:
          </h3>
          <span className="text-[11px] text-stone-500">
            Klikněte na číslo alergenu pro přidání / odebrání
          </span>
        </div>

        <div className="space-y-2">
          {dishes.map((dish, dishIdx) => {
            const isEditing = editingDishIndex === dishIdx;

            return (
              <div
                key={dishIdx}
                className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-2.5 transition-all hover:border-stone-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                        {dish.category}
                      </span>
                      <strong className="text-sm text-stone-100">{dish.name}</strong>
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {dish.price}
                      </span>
                    </div>
                    {dish.description && (
                      <p className="text-xs text-stone-400 mt-0.5">{dish.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setEditingDishIndex(isEditing ? null : dishIdx)}
                    className="self-start sm:self-auto text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Skrýt číselník' : 'Změnit alergeny'}</span>
                  </button>
                </div>

                {/* Assigned allergens badges */}
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-xs text-stone-400 font-medium mr-1">Obsahuje alergeny:</span>
                  {dish.allergens && dish.allergens.length > 0 ? (
                    dish.allergens.map((num) => {
                      const info = OFFICIAL_ALLERGENS.find((a) => a.number === num);
                      return (
                        <span
                          key={num}
                          onClick={() => toggleAllergenForDish(dishIdx, num)}
                          className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-500/40 hover:line-through"
                          title={`Alergen ${num}: ${info?.name} (kliknutím odebrat)`}
                        >
                          <span>{num}</span>
                          <span className="text-[10px] font-normal text-rose-300/80">
                            {info?.name.split(' ')[0]}
                          </span>
                          <span className="text-rose-400/80 hover:text-rose-200 text-[10px]">✕</span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      ✓ Bez zaznamenaných alergenů
                    </span>
                  )}
                </div>

                {/* Expanded fast-toggle pad */}
                {isEditing && (
                  <div className="pt-2 border-t border-stone-800/80 bg-stone-950/40 p-3 rounded-lg space-y-2">
                    <span className="text-[11px] text-stone-400 font-medium block">
                      Rychlý přepínač všech 14 alergenů pro toto jídlo (kliknutím zapnete / vypnete):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                      {OFFICIAL_ALLERGENS.map((a) => {
                        const active = (dish.allergens || []).includes(a.number);
                        return (
                          <button
                            key={a.number}
                            type="button"
                            onClick={() => toggleAllergenForDish(dishIdx, a.number)}
                            className={`p-1.5 rounded text-left flex items-center justify-between text-xs transition-all ${
                              active
                                ? 'bg-rose-500 text-white font-bold shadow-sm'
                                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                            }`}
                          >
                            <span className="font-mono">{a.number}</span>
                            <span className="text-[10px] truncate max-w-[65px]">
                              {a.name.split(' ')[0]}
                            </span>
                            <span className="text-[10px]">{active ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
