import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Sparkles,
  X,
  Camera,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Clock,
  Store,
  ChevronDown,
  Crown,
  Lock,
} from 'lucide-react';
import { SAMPLE_PRESETS, SampleMenuPreset } from '../data/presets';

interface MenuInputProps {
  onAnalyze: (payload: {
    image?: string;
    mimeType?: string;
    text?: string;
    tone: string;
    restaurantName: string;
    specialsNote: string;
  }) => Promise<void>;
  isLoading: boolean;
  onSelectPreset: (preset: SampleMenuPreset) => void;
  isSubscribed?: boolean;
  onRequireSubscription?: () => void;
}

export const MenuInput: React.FC<MenuInputProps> = ({
  onAnalyze,
  isLoading,
  onSelectPreset,
  isSubscribed = false,
  onRequireSubscription,
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'text'>('photo');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [rawText, setRawText] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [servingHours, setServingHours] = useState<string>('11:00 – 14:30');
  const [tone, setTone] = useState<'chutne_a_stavnate' | 'elegantni' | 'humorne_pratelske'>('chutne_a_stavnate');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycle loading steps for pleasant feedback
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const steps = [
      'Rozpoznávám položky, polévky a ceny...',
      'Píšu šťavnaté texty pro Facebook & Instagram s hashtagy...',
      'Generuji responzivní HTML tabulku na web...',
      'Provádím audit oficiálních alergenů 1–14 a kontrolu skrytých přísad...',
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Support pasting image from clipboard anywhere on the page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleImageFile(blob);
            setActiveTab('photo');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processAndResizeImage = (file: File): Promise<{ dataUrl: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultStr = typeof e.target?.result === 'string' ? e.target.result : '';
        if (!resultStr) {
          resolve({ dataUrl: '', mimeType: 'image/jpeg' });
          return;
        }

        const img = new Image();
        img.onload = () => {
          const maxDim = 1800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.88);
            resolve({ dataUrl: optimized, mimeType: 'image/jpeg' });
            return;
          }
          resolve({ dataUrl: resultStr, mimeType: file.type || 'image/jpeg' });
        };
        img.onerror = () => {
          resolve({ dataUrl: resultStr, mimeType: file.type || 'image/jpeg' });
        };
        img.src = resultStr;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Prosím vyberte obrázek (JPG, PNG, WEBP).');
      return;
    }

    try {
      const { dataUrl, mimeType } = await processAndResizeImage(file);
      if (dataUrl) {
        setImageMimeType(mimeType);
        setImagePreview(dataUrl);
      }
    } catch (err) {
      console.error('Chyba při zpracování obrázku:', err);
      // Fallback direct read
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Subscription Paywall check: must be subscribed or active promo token
    if (!isSubscribed) {
      if (onRequireSubscription) {
        onRequireSubscription();
      }
      return;
    }

    if (activeTab === 'photo' && !imagePreview) {
      alert('Nahrajte prosím fotografii menu nebo přepněte na záložku "Zadat textem".');
      return;
    }
    if (activeTab === 'text' && !rawText.trim()) {
      alert('Zadejte prosím text poledního menu nebo vyberte ukázkové menu.');
      return;
    }

    await onAnalyze({
      image: activeTab === 'photo' ? imagePreview || undefined : undefined,
      mimeType: imageMimeType,
      text: activeTab === 'text' ? rawText : undefined,
      tone,
      restaurantName,
      specialsNote: servingHours,
    });
  };

  const handlePresetClick = (preset: SampleMenuPreset) => {
    onSelectPreset(preset);
    setRestaurantName(preset.sampleResult.restaurantName);
    setServingHours(preset.sampleResult.servingHours);
    setRawText(preset.rawText);
  };

  const loadingMessages = [
    'Rozpoznávám položky, polévky a ceny...',
    'Píšu šťavnaté texty pro Facebook & Instagram s hashtagy...',
    'Generuji responzivní HTML tabulku na web...',
    'Provádím audit oficiálních alergenů 1–14 a kontrolu skrytých přísad...',
  ];

  return (
    <div className="bg-stone-950 border border-stone-800/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Preset quick buttons */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Vyzkoušet na ukázkovém menu (1 kliknutí):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="text-left p-3 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-stone-200 group-hover:text-amber-400 transition-colors">
                    {preset.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-amber-400/90 font-medium">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-400 line-clamp-1">{preset.description}</p>
              </div>
              <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1 font-medium group-hover:text-stone-300">
                <span>Kliknutím načíst hotový výsledek</span> →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tab switcher */}
        <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'photo'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Nahrát fotku papírového menu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Zadat menu textem</span>
          </button>
        </div>

        {/* Tab 1: Photo input */}
        {activeTab === 'photo' && (
          <div className="space-y-3">
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-stone-800 hover:border-amber-500/50 bg-stone-900/40 hover:bg-stone-900/80'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-inner">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-200">
                    Klikněte pro nahrání fotky nebo ji přetáhněte sem
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Vyfoťte ceduli, papírové menu na stole nebo tiskový podklad (JPG, PNG, WEBP)
                  </p>
                  <p className="text-[11px] text-amber-400/80 mt-2 font-mono">
                    💡 Tip: Můžete také vložit obrázek ze schránky pomocí Ctrl+V / Cmd+V
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-900 p-2">
                <div className="relative max-h-72 flex items-center justify-center bg-stone-950/60 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Náhled poledního menu"
                    className="max-h-72 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/90 text-stone-300 hover:text-white hover:bg-rose-600 transition-colors shadow-lg"
                    title="Odebrat fotografii"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 px-2 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Fotografie připravena k analýze
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-amber-400 hover:underline font-medium"
                  >
                    Změnit fotku
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Text input */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Vložte nebo napište text poledního menu:
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={8}
              placeholder="Např.:
POLEDNÍ MENU - STŘEDA
Polévka:
Česnečka se sýrem a krutony 45 Kč
Hlavní jídla:
1. Svíčková na smetaně, houskový knedlík 179 Kč
2. Smažený sýr, hranolky, tatarka 159 Kč
3. Kuřecí steak s grilovanou zeleninou 165 Kč
Dezert: Jablečný závin 55 Kč"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Customization bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Restaurant name */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-stone-500" />
              Název podniku (volitelné):
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="např. Bistro Na Růžku"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Serving hours */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Čas výdeje obědů:
            </label>
            <input
              type="text"
              value={servingHours}
              onChange={(e) => setServingHours(e.target.value)}
              placeholder="např. 11:00 – 14:30"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              Tón příspěvku:
            </label>
            <select
              value={tone}
              onChange={(e: any) => setTone(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
            >
              <option value="chutne_a_stavnate">🥩 Šťavnatý & Gurmánský</option>
              <option value="elegantni">🥂 Moderní & Elegantní</option>
              <option value="humorne_pratelske">🍻 Přátelský & Sousedský</option>
            </select>
          </div>
        </div>

        {/* Subscription Notice if not subscribed */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Aktivujte Gastro PRO (149 Kč/měsíc)</strong> pro okamžité neomezené čtení a generování z fotografií.
              </span>
            </div>
            <button
              type="button"
              onClick={onRequireSubscription}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline self-start sm:self-auto cursor-pointer"
            >
              Aktivovat předplatné →
            </button>
          </div>
        )}

        {/* Big Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-stone-950 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2.5 text-base cursor-pointer ${
            !isSubscribed
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-amber-500/20 active:scale-[0.99]'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-amber-500/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div className="text-left leading-tight">
                <div className="text-sm font-bold">Generuji gastro balíček...</div>
                <div className="text-[11px] font-normal opacity-90">{loadingMessages[loadingStep]}</div>
              </div>
            </>
          ) : !isSubscribed ? (
            <>
              <Crown className="w-5 h-5" />
              <span>Aktivovat předplatné (149 Kč/měsíc) a vygenerovat menu</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Vygenerovat texty na sítě, HTML tabulku a audit alergenů</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
