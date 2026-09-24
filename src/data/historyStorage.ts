import { MenuAnalysisResult, Dish } from '../types/menu';

export interface HistoryMenuItem {
  id: string;
  savedAt: string; // ISO string
  restaurantName: string;
  menuDate: string;
  servingHours: string;
  dishesCount: number;
  previewDishes: string[]; // First 2-3 dish names for quick recognition
  data: MenuAnalysisResult;
}

const STORAGE_KEY = 'gastromenu_recent_history_v1';
const MAX_HISTORY_ITEMS = 5;

export const getMenuHistory = (): HistoryMenuItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Failed to read menu history from localStorage:', err);
    return [];
  }
};

export const saveMenuToHistory = (menu: MenuAnalysisResult): HistoryMenuItem[] => {
  try {
    const existing = getMenuHistory();
    
    // Create new history item
    const newItem: HistoryMenuItem = {
      id: `menu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      savedAt: new Date().toISOString(),
      restaurantName: menu.restaurantName || 'Naše restaurace',
      menuDate: menu.menuDate || 'Denní nabídka',
      servingHours: menu.servingHours || '11:00 – 14:30',
      dishesCount: menu.dishes?.length || 0,
      previewDishes: (menu.dishes || []).slice(0, 3).map((d: Dish) => d.name),
      data: menu,
    };

    // Filter out potential identical entries (same restaurant + date + dishes count) to avoid duplicates
    const filtered = existing.filter(
      (item) =>
        !(
          item.restaurantName.toLowerCase() === newItem.restaurantName.toLowerCase() &&
          item.menuDate.toLowerCase() === newItem.menuDate.toLowerCase() &&
          item.dishesCount === newItem.dishesCount
        )
    );

    // Keep most recent first, max 5 items
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save menu to localStorage history:', err);
    return getMenuHistory();
  }
};

export const deleteHistoryItem = (id: string): HistoryMenuItem[] => {
  try {
    const existing = getMenuHistory();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to delete history item:', err);
    return getMenuHistory();
  }
};

export const clearAllMenuHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear menu history:', err);
  }
};
