export interface CategoryDefaultPrice {
  id: string;
  category: string;
  defaultPrice: number | string; // e.g. 45 or "45 Kč"
  enabled: boolean;
}

export interface DefaultPricingSettings {
  enabled: boolean;
  categories: {
    soups: { name: string; price: number; enabled: boolean };
    mains: { name: string; price: number; enabled: boolean };
    desserts: { name: string; price: number; enabled: boolean };
    specials: { name: string; price: number; enabled: boolean };
  };
}

const DEFAULT_PRICING_STORAGE_KEY = 'gastromenu_category_default_prices_v1';

export const INITIAL_DEFAULT_PRICING: DefaultPricingSettings = {
  enabled: true,
  categories: {
    soups: { name: 'Polévky', price: 45, enabled: true },
    mains: { name: 'Hlavní jídla', price: 165, enabled: true },
    desserts: { name: 'Dezerty a doplňky', price: 65, enabled: true },
    specials: { name: 'Týdenní speciál', price: 195, enabled: true },
  },
};

export const getDefaultPricingSettings = (): DefaultPricingSettings => {
  try {
    const raw = localStorage.getItem(DEFAULT_PRICING_STORAGE_KEY);
    if (!raw) return INITIAL_DEFAULT_PRICING;
    const parsed = JSON.parse(raw);
    return {
      enabled: parsed.enabled ?? true,
      categories: {
        soups: {
          name: 'Polévky',
          price: Number(parsed.categories?.soups?.price) || 45,
          enabled: parsed.categories?.soups?.enabled ?? true,
        },
        mains: {
          name: 'Hlavní jídla',
          price: Number(parsed.categories?.mains?.price) || 165,
          enabled: parsed.categories?.mains?.enabled ?? true,
        },
        desserts: {
          name: 'Dezerty a doplňky',
          price: Number(parsed.categories?.desserts?.price) || 65,
          enabled: parsed.categories?.desserts?.enabled ?? true,
        },
        specials: {
          name: 'Týdenní speciál',
          price: Number(parsed.categories?.specials?.price) || 195,
          enabled: parsed.categories?.specials?.enabled ?? true,
        },
      },
    };
  } catch (err) {
    console.warn('Failed to load default pricing settings:', err);
    return INITIAL_DEFAULT_PRICING;
  }
};

export const saveDefaultPricingSettings = (settings: DefaultPricingSettings): void => {
  try {
    localStorage.setItem(DEFAULT_PRICING_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save default pricing settings:', err);
  }
};

/**
 * Helper that checks if a dish price is missing or unformatted ("-", "", "0", "0 Kč", "neuvedeno")
 * and applies the configured default price for its category.
 */
export const applyDefaultCategoryPrices = (
  dishes: any[],
  settings: DefaultPricingSettings
): { dishes: any[]; appliedCount: number } => {
  if (!settings.enabled || !Array.isArray(dishes)) {
    return { dishes, appliedCount: 0 };
  }

  let appliedCount = 0;

  const isPriceMissingOrZero = (priceStr: any): boolean => {
    if (priceStr === undefined || priceStr === null) return true;
    const trimmed = String(priceStr).trim().toLowerCase();
    if (!trimmed || trimmed === '-' || trimmed === '–' || trimmed === '—' || trimmed === '0' || trimmed === '0 kč' || trimmed === '0,-' || trimmed.includes('neuvedeno') || trimmed === 'kč') {
      return true;
    }
    // Check if only digits without non-zero number
    const numbers = trimmed.replace(/[^0-9]/g, '');
    if (!numbers || Number(numbers) === 0) {
      return true;
    }
    return false;
  };

  const updatedDishes = dishes.map((dish) => {
    if (!isPriceMissingOrZero(dish.price)) {
      return dish;
    }

    const cat = (dish.category || '').toLowerCase();
    let assignedPrice: number | null = null;

    if (cat.includes('polévk') || cat.includes('polevk') || cat.includes('soup')) {
      if (settings.categories.soups.enabled) {
        assignedPrice = settings.categories.soups.price;
      }
    } else if (cat.includes('dezert') || cat.includes('sladk') || cat.includes('dessert')) {
      if (settings.categories.desserts.enabled) {
        assignedPrice = settings.categories.desserts.price;
      }
    } else if (cat.includes('speciál') || cat.includes('special') || cat.includes('týden')) {
      if (settings.categories.specials.enabled) {
        assignedPrice = settings.categories.specials.price;
      }
    } else {
      // Main dishes or any other category
      if (settings.categories.mains.enabled) {
        assignedPrice = settings.categories.mains.price;
      }
    }

    if (assignedPrice !== null && assignedPrice > 0) {
      appliedCount++;
      return {
        ...dish,
        price: `${assignedPrice} Kč`,
        isDefaultPriceApplied: true,
      };
    }

    return dish;
  });

  return { dishes: updatedDishes, appliedCount };
};
