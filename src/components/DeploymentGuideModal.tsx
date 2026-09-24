import React, { useState } from 'react';
import {
  Rocket,
  ShieldAlert,
  Server,
  Key,
  FolderTree,
  Copy,
  Check,
  X,
  ExternalLink,
  Code2,
  CheckCircle2,
  FileCode,
  Globe,
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'files' | 'hosting' | 'security' | 'stripe'>('files');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-100 font-serif">
                Návod k nasazení (Deployment Guide)
              </h3>
              <p className="text-xs text-stone-400">
                Kompletní příručka: soubory, hosting zdarma a zabezpečení API klíčů
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('files')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSection === 'files'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            1. Struktura souborů
          </button>
          <button
            onClick={() => setActiveSection('hosting')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSection === 'hosting'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            2. Kde hostovat zdarma
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSection === 'security'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-4 h-4" />
            3. Zabezpečení API klíče
          </button>
          <button
            onClick={() => setActiveSection('stripe')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSection === 'stripe'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server className="w-4 h-4" />
            4. Platby (Stripe / Lemon)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-stone-300">
          {/* Section 1: File Structure */}
          {activeSection === 'files' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                Jaké soubory přesně potřebujete a jak je poskládat
              </h4>
              <p className="text-xs text-stone-400">
                Aplikace je postavena jako moderní fullstack aplikace (Express backend s Vite + React frontendem).
              </p>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 space-y-1 relative">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `gastro-asistent/
├── package.json          # Balíčky a skripty (express, @google/genai, react...)
├── tsconfig.json        # TypeScript konfigurace
├── vite.config.ts       # Vite bundler a Tailwind CSS v4
├── server.ts            # Node/Express backend (volá Gemini a chrání API klíč)
├── index.html           # HTML vstupní bod s fonty
├── src/
│   ├── main.tsx         # React bootstrap
│   ├── index.css        # Tailwind styly a tiskové CSS
│   ├── App.tsx          # Hlavní stav, záložky, platby a auto-retry
│   ├── types/menu.ts    # Datové typy (Menu, Dishe, Alergeny 1-14)
│   ├── data/presets.ts  # Ukázková menu pro okamžitou demonstraci
│   └── components/      # UI komponenty (Header, MenuInput, SocialMediaTab...)
└── .env                 # GEMINI_API_KEY=... (tajný klíč, nikdy nepatří na GitHub!)`,
                      'tree'
                    )
                  }
                  className="absolute top-3 right-3 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] flex items-center gap-1"
                >
                  {copiedText === 'tree' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedText === 'tree' ? 'Zkopírováno' : 'Kopírovat'}
                </button>
                <div className="text-amber-400 font-bold">gastro-asistent/</div>
                <div>├── <span className="text-stone-100 font-bold">package.json</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# definice závislostí a build skriptu</div>
                <div>├── <span className="text-stone-100 font-bold">server.ts</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Express backend (bezpečné volání Gemini API)</div>
                <div>├── <span className="text-stone-100 font-bold">vite.config.ts</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# konfigurace Vite a Tailwind CSS</div>
                <div>├── <span className="text-stone-100 font-bold">index.html</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# HTML obal aplikace</div>
                <div>├── <span className="text-amber-400">src/</span></div>
                <div>│ &nbsp;&nbsp;├── <span className="text-stone-200">App.tsx</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# hlavní obrazovka, předplatné a chybový fallback</div>
                <div>│ &nbsp;&nbsp;├── <span className="text-stone-200">components/</span> &nbsp;&nbsp;&nbsp;&nbsp;# záložky: sítě, HTML, alergeny, tisk</div>
                <div>│ &nbsp;&nbsp;├── <span className="text-stone-200">data/presets.ts</span> &nbsp;# 3 hotová ukázková polední menu</div>
                <div>│ &nbsp;&nbsp;└── <span className="text-stone-200">types/menu.ts</span> &nbsp;&nbsp;&nbsp;# typy a seznam 14 oficiálních alergenů EU</div>
                <div>└── <span className="text-emerald-400 font-bold">.env</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# soubor s privátními proměnnými prostředí</div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs space-y-1 text-amber-200">
                <strong className="block text-amber-300 font-semibold">Skripty v package.json pro nasazení:</strong>
                <p>• <code className="bg-stone-900 px-1 py-0.5 rounded text-amber-300">npm run build</code> – zkompiluje React frontend do složky <code className="text-stone-200">dist/</code>.</p>
                <p>• <code className="bg-stone-900 px-1 py-0.5 rounded text-amber-300">npm start</code> – spustí serverový soubor <code className="text-stone-200">node server.ts</code> (nebo tsx).</p>
              </div>
            </div>
          )}

          {/* Section 2: Hosting */}
          {activeSection === 'hosting' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Kam nahrát kód zdarma, aby běžel na reálné adrese
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Option A: Render.com */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">1. Render.com (Doporučeno)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Zdarma</span>
                  </div>
                  <p className="text-stone-400">
                    Ideální pro Node.js fullstack aplikaci s Express backendem i Vite frontendem na 1 kliknutí.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-stone-300 pt-1">
                    <li>Vytvořte si účet na <strong className="text-amber-400">render.com</strong> a propojte GitHub repozitář.</li>
                    <li>Klikněte na <strong>New +</strong> → <strong>Web Service</strong>.</li>
                    <li>Build Command: <code className="bg-stone-900 px-1 rounded text-amber-300">npm install --legacy-peer-deps && npm run build</code></li>
                    <li>Start Command: <code className="bg-stone-900 px-1 rounded text-amber-300">npm start</code></li>
                    <li>V záložce <strong>Environment</strong> přidejte proměnnou <code className="text-amber-300">GEMINI_API_KEY</code>.</li>
                  </ol>
                </div>

                {/* Option B: Vercel */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">2. Vercel</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Zdarma</span>
                  </div>
                  <p className="text-stone-400">
                    Bleskový hosting s globální CDN a automatickou SSL certifikací zdarma.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-stone-300 pt-1">
                    <li>Nahrajte kód do repozitáře na GitHubu.</li>
                    <li>Přejděte na <strong className="text-amber-400">vercel.com</strong> a klikněte na <strong>Import Project</strong>.</li>
                    <li>Vercel sám detekuje Vite aplikaci.</li>
                    <li>V sekci <strong>Environment Variables</strong> zadejte svůj <code className="text-amber-300">GEMINI_API_KEY</code>.</li>
                    <li>Během 60 sekund máte hotovou URL typu <code className="text-stone-400">gastromenu.vercel.app</code>.</li>
                  </ol>
                </div>

                {/* Option C: Railway.app */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">3. Railway.app</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">Free Trial</span>
                  </div>
                  <p className="text-stone-400">
                    Velmi populární platforma pro automatické nasazení z GitHubu s vlastní doménou.
                  </p>
                </div>

                {/* Option D: Google Cloud Run */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">4. Google Cloud Run</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Štědrý free tier</span>
                  </div>
                  <p className="text-stone-400">
                    Oficiální cloud od Googlu s 2 miliony požadavků měsíčně zdarma a nulovými náklady při nečinnosti.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: API Key Security */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Jak správně zabezpečit Gemini API klíč
              </h4>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-100 block font-semibold">1. Klíč zůstává pouze na serveru (v server.ts)</strong>
                    <p className="text-stone-400 mt-0.5">
                      V naší architektuře se API klíč nachází <strong>výhradně v backendovém Express serveru</strong> v <code className="text-amber-300">process.env.GEMINI_API_KEY</code>. Prohlížeč hosta komunikuje jen s interní URL <code className="text-amber-300">/api/analyze-menu</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-100 block font-semibold">2. Nikdy neukládejte .env soubor do Gitu</strong>
                    <p className="text-stone-400 mt-0.5">
                      Soubor <code className="text-amber-300">.env</code> je v souboru <code className="text-amber-300">.gitignore</code>. Na hostingu (Vercel, Render) nastavíte klíč v ovládacím panelu v sekci <strong>Environment Variables</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-100 block font-semibold">3. Omezení rozpočtu v Google AI Studiu</strong>
                    <p className="text-stone-400 mt-0.5">
                      V konzoli Google Cloud si můžete nastavit rozpočtový strop (Spend limit), takže i kdyby došlo k velkému nárůstu návštěvnosti, nikdy nepřekročíte nastavenou částku.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Stripe / Monetization */}
          {activeSection === 'stripe' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-400" />
                Jak zapojit reálnou platební bránu Stripe / Lemon Squeezy
              </h4>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs leading-relaxed">
                <p className="text-stone-300">
                  Aplikace má již implementovaný stav předplatného, ochranu generování i platební dialog pro 149 Kč/měsíc. Pro reálný výběr peněz na váš bankovní účet:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-stone-300 pt-1">
                  <li>
                    <strong>Vytvořte si účet na Stripe.com nebo LemonSqueezy.com:</strong>
                    <p className="text-stone-400 pl-4">Založení je zdarma a trvá cca 5 minut.</p>
                  </li>
                  <li>
                    <strong>Vytvořte Recurring Product (Předplatné):</strong>
                    <p className="text-stone-400 pl-4">Název: <em>GastroMenu Asistent Pro</em>, Cena: <em>149 Kč / měsíc</em>.</p>
                  </li>
                  <li>
                    <strong>Získejte Payment Link:</strong>
                    <p className="text-stone-400 pl-4">Stripe vygeneruje odkaz typu <code className="text-amber-300">https://buy.stripe.com/abc123xyz</code>. Tento odkaz lze vložit přímo do tlačítka nebo otevřít v iframe/popupu.</p>
                  </li>
                  <li>
                    <strong>Vyplácení peněz:</strong>
                    <p className="text-stone-400 pl-4">Stripe automaticky posílá vybrané předplatné přímo na váš český bankovní účet v CZK.</p>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>GastroMenu Asistent Pro v1.0 • Připraveno pro komerční spuštění</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-semibold transition-colors"
          >
            Zavřít průvodce
          </button>
        </div>
      </div>
    </div>
  );
};
