import React, { useState } from 'react';
import {
  CheckCircle2,
  Crown,
  CreditCard,
  KeyRound,
  Sparkles,
  ShieldCheck,
  X,
  ArrowRight,
  Flame,
  Check,
  AlertCircle,
  Clock,
  Building2,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  onActivateSubscription: (planName: string, method: string) => void;
  onCancelSubscription: () => void;
}

// Jediný tajný VIP kód pro administrátora / majitele aplikace.
// Žádné veřejné kódy se nikde nezobrazují – cizí uživatel se bez tohoto tajného kódu nebo zaplacení nedostane.
const SECRET_ADMIN_VIP_TOKEN = 'GASTRO-SEF-2026';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  isSubscribed,
  onActivateSubscription,
  onCancelSubscription,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'token'>('card');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);
    const cleaned = tokenInput.trim().toUpperCase();

    if (!cleaned) {
      setTokenError('Zadejte prosím VIP aktivační kód.');
      return;
    }

    if (cleaned === SECRET_ADMIN_VIP_TOKEN) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setSuccessAnimation(true);
        setTimeout(() => {
          onActivateSubscription(`VIP Majitel (Aktivní)`, 'Tajný VIP Kód');
          setSuccessAnimation(false);
          onClose();
        }, 1200);
      }, 700);
    } else {
      setTokenError('Zadaný VIP kód není platný. Zkontrolujte prosím správnost kódu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Glow Header */}
        <div className="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-6 sm:p-8 border-b border-stone-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/30">
              <Crown className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Předplatné GastroMenu PRO
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif">
                Aktivovat předplatné (149 Kč/měsíc)
              </h3>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Získejte neomezený přístup k AI asistentovi pro sociální sítě vaší restaurace, automatický audit alergenů a webové HTML jídelní lístky.
          </p>

          <div className="mt-4 flex items-baseline gap-2 bg-stone-950/60 p-3 rounded-2xl border border-stone-800/80 w-fit">
            <span className="text-3xl font-extrabold text-amber-400 font-serif">149 Kč</span>
            <span className="text-stone-400 text-xs font-medium">/ měsíčně (cca 5 Kč denně)</span>
            <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Bez závazků • Kdykoliv zrušitelné
            </span>
          </div>
        </div>

        {/* Success celebratory animation overlay */}
        {successAnimation && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3 bg-stone-900">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500 animate-bounce">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-stone-100">Předplatné bylo úspěšně aktivováno!</h4>
            <p className="text-sm text-stone-400">
              Vítejte v GastroMenu Pro. Nyní můžete neomezeně analyzovat všechna denní menu.
            </p>
          </div>
        )}

        {!successAnimation && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* If currently subscribed */}
            {isSubscribed ? (
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-base">Vaše předplatné je aktivní</h4>
                    <p className="text-xs text-stone-400">
                      Máte neomezený přístup ke všem AI funkcím a generování menu.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-400 border-t border-emerald-900/50 pt-3 flex items-center justify-between">
                  <span>Platnost: Aktivní měsíční předplatné</span>
                  <button
                    onClick={() => {
                      if (confirm('Opravdu si přejete deaktivovat předplatné?')) {
                        onCancelSubscription();
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                  >
                    Deaktivovat předplatné
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Benefits List */}
                <div className="space-y-2.5">
                  <div className="text-xs uppercase font-bold tracking-wider text-stone-400">
                    Co v PRO verzi získáte:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-200">
                    <div className="flex items-center gap-2 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Neomezené AI generování ze snímku i textu</span>
                    </div>
                    <div className="flex items-center gap-2 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800">
                      <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span>Šťavnaté posty pro Facebook & Instagram</span>
                    </div>
                    <div className="flex items-center gap-2 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800">
                      <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>HTML kód tabulky pro váš web</span>
                    </div>
                    <div className="flex items-center gap-2 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800">
                      <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>Audit 14 alergenů podle norem EU</span>
                    </div>
                  </div>
                </div>

                {/* Tabs: Stripe Card / VIP Token */}
                <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'card'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Platební karta (Online brána)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('token')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'token'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>VIP Aktivační kód</span>
                  </button>
                </div>

                {/* Method 1: Stripe Card - Inactive during pilot test */}
                {activeTab === 'card' && (
                  <div className="space-y-4">
                    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                      <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
                        <span className="font-medium text-stone-300">Předplatné: 149 Kč / měsíčně</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Bez závazků
                        </span>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-stone-300 space-y-1">
                            <strong className="text-amber-300 block">
                              Platební brána je dočasně v testovacím režimu
                            </strong>
                            <p className="text-[11px] text-stone-400 leading-relaxed">
                              Přímé platby kartou budou spuštěny po dokončení pilotního provozu. Pokud chcete aplikaci vyzkoušet pro vaši restauraci, kontaktujte provozovatele nebo zadejte váš <strong>VIP aktivační kód</strong> v sousední záložce.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 opacity-60 pointer-events-none">
                        <div>
                          <label className="block text-[11px] font-medium text-stone-400 mb-1">
                            Číslo platební karty:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value="•••• •••• •••• ••••"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-400 font-mono"
                            />
                            <CreditCard className="w-4 h-4 text-stone-600 absolute left-3 top-2.5" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-stone-400 mb-1">
                              Platnost (MM/RR):
                            </label>
                            <input
                              type="text"
                              disabled
                              value="MM / RR"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-500 font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-stone-400 mb-1">
                              CVC / CVV:
                            </label>
                            <input
                              type="text"
                              disabled
                              value="•••"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-500 font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('token')}
                      className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Přejít na zadání VIP kódu</span>
                    </button>
                  </div>
                )}

                {/* Method 2: Test Token / Promo */}
                {activeTab === 'token' && (
                  <form onSubmit={handleTokenSubmit} className="space-y-4">
                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                      <label className="block text-xs font-medium text-stone-300">
                        Zadejte VIP aktivační kód:
                      </label>
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Vložte tajný VIP kód"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 text-sm text-stone-100 uppercase tracking-widest font-mono focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[11px] text-stone-500">
                        Tento přístup je určen výhradně pro autorizované partnery a majitele aplikace s přiděleným VIP kódem.
                      </p>
                    </div>

                    {tokenError && (
                      <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-rose-200 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{tokenError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                          <span>Ověřuji VIP kód...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Ověřit VIP kód a odemknout aplikaci</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
