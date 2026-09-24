import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '35mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const OFFICIAL_ALLERGENS_CZ: Record<number, string> = {
  1: 'Obiloviny obsahující lepek',
  2: 'Korýši a výrobky z nich',
  3: 'Vejce a výrobky z nich',
  4: 'Ryby a výrobky z nich',
  5: 'Jádra podzemnice olejné (arašídy)',
  6: 'Sójové boby (sója)',
  7: 'Mléko a výrobky z něj',
  8: 'Skořápkové plody (ořechy)',
  9: 'Celer a výrobky z něj',
  10: 'Hořčice a výrobky z ní',
  11: 'Sezamová semena',
  12: 'Oxid siřičitý a siřičitany',
  13: 'Vlčí bob (lupina)',
  14: 'Měkkýši a výrobky z nich',
};

// Helper function to extract a clean, human-friendly error message
function formatErrorMessage(err: any): string {
  if (!err) return 'Nastala neočekávaná chyba při zpracování menu.';
  const rawMsg = err?.message || String(err);

  try {
    const trimmed = typeof rawMsg === 'string' ? rawMsg.trim() : '';
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (parsed?.error?.message) {
        if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
          return 'AI má teď plno, zkus to prosím za chvíli znovu';
        }
        if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED') {
          return 'AI má teď plno, zkus to prosím za chvíli znovu';
        }
        return parsed.error.message;
      }
    }
  } catch {
    // Ignore JSON parse error and fallback to string checks
  }

  if (
    rawMsg.includes('503') ||
    rawMsg.includes('UNAVAILABLE') ||
    rawMsg.includes('high demand') ||
    rawMsg.includes('429') ||
    rawMsg.includes('RESOURCE_EXHAUSTED')
  ) {
    return 'AI má teď plno, zkus to prosím za chvíli znovu';
  }

  return rawMsg;
}

// Clean markdown code blocks from model JSON output if present
function parseModelJson(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  }
  return JSON.parse(cleaned);
}

// Resilient menu analysis with automatic model fallback and retries
async function generateMenuWithFallback(
  aiInstance: GoogleGenAI,
  contents: any,
  systemInstruction: string
) {
  // Candidate models in prioritized order based on real-time availability and speed
  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AI Analysis] Attempting menu generation with model '${model}' (attempt ${attempt})...`);
        const response = await aiInstance.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const text = response.text || '';
        if (!text || text.trim().length === 0) {
          throw new Error(`Model ${model} vrátil prázdný výsledek.`);
        }

        const parsed = parseModelJson(text);
        console.log(`[AI Analysis] Successfully analyzed menu using '${model}'.`);
        return { data: parsed, usedModel: model };
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const isTransient =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('quota');

        console.warn(`[AI Analysis] Model '${model}' failed on attempt ${attempt}:`, msg.slice(0, 180));

        if (isTransient && attempt < 2) {
          // Automatic 3-second delay before retry as requested
          console.log(`[AI Analysis] Temporary overload detected, retrying in 3 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }

        // If not transient or already retried, break inner loop to try next model
        break;
      }
    }
  }

  throw lastError || new Error('AI má teď plno, zkus to prosím za chvíli znovu');
}

app.post('/api/analyze-menu', async (req, res) => {
  try {
    const {
      image,
      mimeType = 'image/jpeg',
      text,
      tone = 'chutne_a_stavnate',
      restaurantName = '',
      specialsNote = '',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          'Chybí nastavený GEMINI_API_KEY na serveru. V administraci Render.com otevřete záložku "Environment" a přidejte proměnnou GEMINI_API_KEY s vaším klíčem z Google AI Studio.',
      });
    }

    if (!image && (!text || text.trim().length === 0)) {
      return res.status(400).json({
        error: 'Chybí vstupní data. Nahrajte fotografii jídelního lístku nebo zadejte text denního menu.',
      });
    }

    const tonePrompts: Record<string, string> = {
      chutne_a_stavnate:
        'Velmi lákavý, smyslový a šťavnatý gastro styl (popiš vůně, křupavost, poctivost přípravy, čerstvé bylinky, tažené vývary).',
      elegantni:
        'Moderní, stylový, kultivovaný a elegantní tón vhodný pro moderní bistro a fine-casual koncept.',
      humorne_pratelske:
        'Vřelý, sousedský a neformální tón, jako když kamarád zve na skvělý domácí oběd.',
    };

    const selectedTone = tonePrompts[tone] || tonePrompts.chutne_a_stavnate;

    const systemInstruction = `Jsi elitní gastronomický auditor, špičkový OCR specialista na čtení českých jídelních lístků a profesionální gastro copywriter v České republice.
Tvým prvořadým úkolem je DŮKLADNĚ A PŘESNĚ PŘEČÍST A EXTRAHOVAT SEZNAM VŠECH JÍDEL Z PŘILOŽENÉ FOTOGRAFIE NEBO TEXTU A SPRÁVNĚ JE ZAŘADIT DO KATEGORIÍ.

Pravidla pro přesnou kategorizaci pokrmů (category):
1. "Polévky":
   - Vývary, kulajda, bramboračka, dršťková, česnečka, polévka dne atd.
2. "Hlavní jídla":
   - Všechny hlavní teplé i studené chody, maso, omáčky, těstoviny, saláty jako hlavní jídlo, burgery, minutky.
   - POZOR: Chuťovky, studená jídla a hospodské speciality jako "Nakládaný hermelín", "Utopenec", "Tlačenka", "Tatarák", "Pikantní masová směs" či "Smažený sýr" patři VŽDY do "Hlavní jídla" (nebo chuťovky k pivu), NIKDY TO NENÍ DEZERT!
3. "Dezerty a doplňky":
   - Pouze sladká jídla a dezerty! Např. jablečný závin (štrúdl), palačinky, lívance, medovník, tiramisu, čokoládový fondant, zmrzlinový pohár, panna cotta.
   - V jídelních lístcích bývají dezerty umístěny úplně dole na konci lístku nebo pod samostatným nadpisem "Dezerty" / "Sladká tečka".
   - Pokud jídlo není sladký dezert, NESMÍ mít kategorii "Dezerty a doplňky".
4. "Týdenní speciál":
   - Pokrmy označené jako týdenní nabídka, šéfkuchař doporučuje nebo speciál.

Pravidla pro extrakci položek (DISHES):
1. Přečti VŠECHNY položky bez výjimky – polévky, hlavní chody, minutky, týdenní nabídky, saláty i dezerty.
2. Pro každé jídlo urči:
   - "category": ("Polévky" | "Hlavní jídla" | "Dezerty a doplňky" | "Týdenní speciál")
   - "name": přesný a plný název jídla (včetně gramáže, je-li uvedena, např. "150g Hovězí líčka na víně" nebo "100g Nakládaný hermelín s feferonkou")
   - "description": přílohy a detaily (např. "bramborovo-celerové pyré, glazovaná karotka" nebo "čerstvý chléb, cibule")
   - "price": přesná cena (např. "185 Kč", "45 Kč"). Pokud cena na snímku není, uveď "-" nebo realistickou cenu.
   - "allergens": pole celých čísel alergenů 1 až 14. Pokud jsou na fotce čísla uvedena, přepiš je. Pokud čísla chybí, TY jako šéfkuchař sám přesně urči čísla alergenů podle surovin (např. lepek 1, vejce 3, mléko/máslo 7, celer 9, hořčice 10).
3. Pokud je na fotce viditelný název restaurace nebo datum/den nabídky, extrahuj je do "restaurantName" a "menuDate".
4. NIKDY nevracej prázdný seznam dishes. Seznam musí obsahovat reálná jídla z fotografie.
5. Vytvoř lákavý marketingový text na Facebook a Instagram v českém jazyce v tónu: ${selectedTone}.`;

    const promptText = `ÚKOL: DŮKLADNÁ ANALÝZA A OCR EXTRAKCE JÍDELNÍHO LÍSTKU / POLEDNÍHO MENU.

${
  image
    ? `POKYNY PRO FOTOGRAFII:
- Prohlédni si přiložený snímek poledního menu / jídelního lístku (může to být tištěný papír, tabule psaná křídou, vývěska nebo jídelní lístek na stole).
- Přečti každý řádek a vytáhni kompletní seznam pokrmů s cenami a alergeny.
- Každé jídlo zařaď do seznamu 'dishes'.`
    : `ZADANÝ TEXT MENU:\n"""\n${text}\n"""`
}
${text && image ? `\nDOPLŇUJÍCÍ POZNÁMKY K MENU:\n"""\n${text}\n"""` : ''}

Vrať POUZE validní JSON v této přesné struktuře:
{
  "restaurantName": "${restaurantName || 'Název restaurace zjištěný z fotky nebo Naše restaurace'}",
  "menuDate": "Zjištěný den a datum nabídky (např. Polední menu – Středa 24. září)",
  "servingHours": "${specialsNote || '11:00 – 14:30 (nebo do vyprodání)'}",
  "dishes": [
    {
      "category": "Polévky",
      "name": "Název polévky",
      "description": "popis nebo suroviny",
      "price": "45 Kč",
      "allergens": [1, 9]
    },
    {
      "category": "Hlavní jídla",
      "name": "Název hlavního chodu",
      "description": "příloha a omáčka",
      "price": "165 Kč",
      "allergens": [1, 3, 7]
    }
  ],
  "socialPosts": {
    "facebook": {
      "headline": "Chytlavý titulek postu s emotikony",
      "body": "Poutavý hlavní text popisující dnešní speciality na základě rozpoznaných jídel",
      "callToAction": "Výzva k rezervaci či zastavení se na oběd",
      "hashtags": ["#polednimenu", "#kamnaobed", "#dnesjim", "#restaurace", "#obed"],
      "fullFormattedText": "Kompletní hotový post pro Facebook"
    },
    "instagram": {
      "hook": "První úderná věta pro Instagram",
      "caption": "Estetický text pro Instagram s mezerami a emotikony",
      "hashtags": ["#polednimenu", "#dnesjim", "#obed", "#foodiecz", "#kamnaobed"],
      "fullFormattedText": "Kompletní hotový popisek pro Instagram"
    },
    "smsWhatsapp": "Stručný text zprávy pro štamgasty se seznamem jídel a cenami"
  },
  "htmlTable": {
    "styledSnippet": "Kompletní responzivní HTML kód tabulky s inline styly pro všechna extrahovaná jídla",
    "minimalSnippet": "Čistá HTML tabulka s třídami"
  },
  "allergenAnalysis": {
    "detectedAllergens": [
      {
        "number": 1,
        "name": "Obiloviny obsahující lepek",
        "foundInDishes": ["názvy jídel obsahujících lepek"]
      }
    ],
    "safetyWarnings": [
      "Bezpečnostní upozornění na možné skryté alergeny podle českých gastronomických standardů"
    ],
    "isInspectionReady": true
  },
  "marketingTips": [
    "Doporučený čas publikace na sítě (cca 10:15 - 10:45)",
    "Tip na lákavou fotku jídla"
  ]
}`;

    const parts: any[] = [];
    if (image) {
      let cleanBase64 = '';
      let effectiveMime = mimeType || 'image/jpeg';

      if (typeof image === 'string' && image.includes(';base64,')) {
        const match = image.match(/^data:([^;]+);base64,/);
        if (match && match[1]) {
          effectiveMime = match[1];
        }
        cleanBase64 = image.split(';base64,')[1].trim();
      } else if (typeof image === 'string') {
        cleanBase64 = image.trim();
      }

      if (!cleanBase64) {
        return res.status(400).json({
          error: 'Nahraný obrázek je prázdný nebo poškozený. Zkuste prosím vyfotit nebo nahrát fotografii znovu.',
        });
      }

      parts.push({
        inlineData: {
          mimeType: effectiveMime,
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: promptText,
    });

    const { data: parsedData, usedModel } = await generateMenuWithFallback(
      ai,
      { parts },
      systemInstruction
    );

    // Safeguard: Ensure savory/beer snacks like "hermelín", "utopenec", "tlačenka", "tatarák", "řízek", "sýr" are never categorized as dessert
    if (parsedData && Array.isArray(parsedData.dishes)) {
      const savorySnackKeywords = [
        'hermelín', 'hermelin', 'camembert', 'nakládaný', 'nakladany',
        'utopenec', 'utopenci', 'tlačenka', 'tlacenka', 'tatarák', 'tatarak',
        'klobása', 'klobasa', 'párek', 'parek', 'bramborák', 'bramborak',
        'smažák', 'smazak', 'smažený sýr', 'smazeny syr', 'topinka', 'topinky',
        'chilli cheese', 'chipsy', 'hranolky', 'křídla', 'kridla', 'žebra', 'zobra'
      ];

      parsedData.dishes = parsedData.dishes.map((dish: any) => {
        const lowerName = (dish.name || '').toLowerCase();
        const lowerCat = (dish.category || '').toLowerCase();
        
        // If it got marked as dessert or sweet, but contains known savory pub food words
        if (
          (lowerCat.includes('dezert') || lowerCat.includes('sladk')) &&
          savorySnackKeywords.some((kw) => lowerName.includes(kw))
        ) {
          return {
            ...dish,
            category: 'Hlavní jídla',
          };
        }
        return dish;
      });
    }

    return res.json({ success: true, data: parsedData, model: usedModel });
  } catch (error: any) {
    console.error('Error analyzing menu:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      error: friendlyError,
    });
  }
});

// Allergen reference endpoint
app.get('/api/allergens-reference', (_req, res) => {
  res.json({ allergens: OFFICIAL_ALLERGENS_CZ });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GastroMenu Asistent Pro running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
