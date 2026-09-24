export interface Dish {
  id?: string;
  category: string;
  name: string;
  description?: string;
  price: string;
  allergens: number[];
  isDefaultPriceApplied?: boolean;
}

export interface SocialPostData {
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullFormattedText: string;
}

export interface InstagramPostData {
  hook: string;
  caption: string;
  hashtags: string[];
  fullFormattedText: string;
}

export interface AllergenDetection {
  number: number;
  name: string;
  foundInDishes: string[];
}

export interface AllergenAnalysis {
  detectedAllergens: AllergenDetection[];
  safetyWarnings: string[];
  isInspectionReady: boolean;
}

export interface MenuAnalysisResult {
  restaurantName: string;
  menuDate: string;
  servingHours: string;
  dishes: Dish[];
  socialPosts: {
    facebook: SocialPostData;
    instagram: InstagramPostData;
    smsWhatsapp: string;
  };
  htmlTable: {
    styledSnippet: string;
    minimalSnippet: string;
  };
  allergenAnalysis: AllergenAnalysis;
  marketingTips: string[];
}

export const OFFICIAL_ALLERGENS: { number: number; name: string; icon: string; example: string }[] = [
  { number: 1, name: 'Obiloviny obsahující lepek', icon: '🌾', example: 'pšenice, žito, ječmen, oves, jíška, těstoviny' },
  { number: 2, name: 'Korýši a výrobky z nich', icon: '🦐', example: 'krevety, humr, krab, rak' },
  { number: 3, name: 'Vejce a výrobky z nich', icon: '🥚', example: 'majonéza, těstoviny, trojobal, pečivo' },
  { number: 4, name: 'Ryby a výrobky z nich', icon: '🐟', example: 'losos, tuňák, treska, rybí omáčka' },
  { number: 5, name: 'Jádra podzemnice olejné (arašídy)', icon: '🥜', example: 'arašídy, burákové máslo, asijská jídla' },
  { number: 6, name: 'Sójové boby (sója)', icon: '🫘', example: 'sójová omáčka, tofu, sójový lecitin' },
  { number: 7, name: 'Mléko a výrobky z něj', icon: '🥛', example: 'smetana, máslo, sýry, jogurt, syrovátka' },
  { number: 8, name: 'Skořápkové plody (ořechy)', icon: '🌰', example: 'vlašské ořechy, mandle, lískové oříšky, kešu' },
  { number: 9, name: 'Celer a výrobky z něj', icon: '🥬', example: 'kořenová zelenina, vývary, omáčky, celerová sůl' },
  { number: 10, name: 'Hořčice a výrobky z ní', icon: '🌱', example: 'plnotučná, dijonská, dresinky, marinády' },
  { number: 11, name: 'Sezamová semena', icon: '⚪', example: 'sezamový olej, tahini, posyp pečiva, burger bulky' },
  { number: 12, name: 'Oxid siřičitý a siřičitany', icon: '🍷', example: 'víno, sušené ovoce, vinný ocet' },
  { number: 13, name: 'Vlčí bob (lupina)', icon: '🌸', example: 'lupinová mouka v pečivu a těstovinách' },
  { number: 14, name: 'Měkkýši a výrobky z nich', icon: '🦪', example: 'slávky, ústřice, chobotnice, kalamáry' },
];
