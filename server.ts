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
  // Candidate models in prioritized order based on availability
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
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
            temperature: 0.6,
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

    if (!image && (!text || text.trim().length === 0)) {
      return res.status(400).json({
        error: 'Chybí vstupní data. Nahrajte fotografii nebo zadejte text denního menu.',
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

    const systemInstruction = `Jsi elitní gastronomický marketingový expert, profesionální copywriter pro restaurace a šéfkuchařský auditor hygieny a alergenů v České republice.
Tvým úkolem je analyzovat polední/denní menu z fotky nebo textu a vygenerovat kompletní profesionální balíček pro majitele podniku:
1. Strukturovaný přepis všech položek (polévky, hlavní chody, dezerty/nápoje/speciály, ceny v Kč, alergeny 1-14).
2. Chytlavý, gurmánsky lákavý text pro Facebook a Instagram se skvělým háčkem (hookem), emotikony a cílenými českými hashtagy (#polednimenu, #dnesjim, #kamnaobed, #gastromapa...).
3. Přehlednou, estetickou HTML tabulku poledního menu, kterou lze ihned zkopírovat a vložit na web (např. do WordPressu, Webnode či jakéhokoliv CMS).
4. Detailní kontrolu všech 14 oficiálních alergenů (EU nařízení č. 1169/2011) včetně bezpečnostního upozornění na skryté alergeny (např. jíška = lepek 1, celer v hovězím vývaru = 9, smetana v omáčkách = 7, sójová omáčka = 6, trojobal = 1, 3, 7).

Použij styl: ${selectedTone}
Případný název restaurace: ${restaurantName || 'Naše restaurace / bistro'}
Zvláštní poznámka k podávání: ${specialsNote || 'Obědy podáváme obvykle 11:00 - 14:00 do vyprodání.'}

Vždy piš v perfektní, přirozené češtině s gastronadšením a citem pro kuchařské řemeslo.`;

    const promptText = `Analyzuj následující polední menu a vrať POUZE validní JSON v přesně definované struktuře.

${text ? `ZADANÝ TEXT MENU:\n"""\n${text}\n"""` : 'Analyzuj přiloženou fotografii papírového poledního menu.'}

Vrať JSON podle této struktury:
{
  "restaurantName": "Zjištěný nebo doplněný název podniku",
  "menuDate": "Název a den nabídky (např. Polední menu – Středa 24. září)",
  "servingHours": "např. 11:00 – 14:30 (nebo do vyprodání)",
  "dishes": [
    {
      "category": "Polévky" | "Hlavní jídla" | "Dezerty a doplňky" | "Týdenní speciál",
      "name": "Název jídla",
      "description": "Lákavý detailní popis nebo přílohy",
      "price": "165 Kč",
      "allergens": [1, 3, 7]
    }
  ],
  "socialPosts": {
    "facebook": {
      "headline": "Chytlavý titulek postu s emotikony",
      "body": "Poutavý hlavní text popisující dnešní speciality, vůně a chutě",
      "callToAction": "Výzva k akci (např. 'Stůl si rezervujte na tel. ... nebo se rovnou zastavte!')",
      "hashtags": ["#polednimenu", "#kamnaobed", "#dnesjim", "#restaurace", "#obed", "#poledninabidka"],
      "fullFormattedText": "Kompletní hotový post pro Facebook připravený k okamžitému zkopírování"
    },
    "instagram": {
      "hook": "První úderná věta / hook pro IG",
      "caption": "Estetický text pro Instagram s mezerami a emotikony",
      "hashtags": ["#polednimenu", "#dnesjim", "#obed", "#gastromapa", "#restaurace", "#foodiecz", "#kamnaobed", "#ceskakuchyne"],
      "fullFormattedText": "Kompletní hotový popisek pro Instagram i s hashtagy"
    },
    "smsWhatsapp": "Stručný text pro SMS nebo WhatsApp zprávu stálým štamgastům a zákazníkům"
  },
  "htmlTable": {
    "styledSnippet": "Kompletní responzivní HTML kód tabulky s inline styly (moderní čistý gastro design s lehkými rámečky, zarovnanými cenami a decentními bublinami pro čísla alergenů), který vypadá skvěle na každém webu.",
    "minimalSnippet": "Čistá HTML tabulka s třídami pro snadné přizpůsobení v CSS."
  },
  "allergenAnalysis": {
    "detectedAllergens": [
      {
        "number": 1,
        "name": "Obiloviny obsahující lepek",
        "foundInDishes": ["Název jídla 1", "Název jídla 2"]
      }
    ],
    "safetyWarnings": [
      "Upozornění šéfkuchaře na možné skryté alergeny (např. zkontrolujte celer 9 v základu svíčkové omáčky)"
    ],
    "isInspectionReady": true
  },
  "marketingTips": [
    "Doporučení pro nejlepší čas publikace na sítě (cca 10:15 - 10:45)",
    "Tip na atraktivní fotografii na stories"
  ]
}`;

    const parts: any[] = [];
    if (image) {
      // Clean base64 prefix if present
      const cleanBase64 = image.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
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
