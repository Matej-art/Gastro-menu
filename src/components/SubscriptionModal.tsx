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

const VALID_TEST_TOKENS = ['GASTRO2026', 'PROMO149', 'TEST-PRO', 'VIP-SEF', 'RESTAURACE-FREE'];

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

  // Card form state
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [billingEmail, setBillingEmail] = useState<string>('restaurace@bistro.cz');

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);
    const cleaned = tokenInput.trim().toUpperCase();

    if (!cleaned) {
      setTokenError('Zadejte prosím testovací token nebo promo kód.');
      return;
    }

    if (VALID_TEST_TOKENS.includes(cleaned)) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setSuccessAnimation(true);
        setTimeout(() => {
          onActivateSubscription(`VIP Promo (${cleaned})`, 'Promo Token');
          setSuccessAnimation(false);
          onClose();
        }, 1200);
      }, 700);
    } else {
      setTokenError(
        'Neplatný token. Vyzkoušejte testovací kód: GASTRO2026 nebo TEST-PRO.'
      );
    }
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate instant payment authorization through Stripe / Lemon Squeezy
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        onActivateSubscription('Měsíční PRO plán (149 Kč)', 'Platební karta (Stripe)');
        setSuccessAnimation(false);
        onClose();
      }, 1200);
    }, 1200);
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

                {/* Tabs: Stripe Card / Test Token */}
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
                    <span>Platební karta (Stripe / Lemon)</span>
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
                    <span>Testovací token / Promo kód</span>
                  </button>
                </div>

                {/* Method 1: Stripe Card */}
                {activeTab === 'card' && (
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-400 pb-1 border-b border-stone-800/80">
                        <span>Zabezpečená platební brána (256-bit SSL)</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Stripe Verified
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-400 mb-1">
                          E-mail pro zasílání daňových dokladů:
                        </label>
                        <input
                          type="email"
                          required
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-400 mb-1">
                          Číslo karty:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                          />
                          <CreditCard className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-stone-400 mb-1">
                            Platnost (MM/RR):
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono text-center focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-stone-400 mb-1">
                            CVC / CVV:
                          </label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="888"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 font-mono text-center focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                          <span>Zpracovávám platbu 149 Kč...</span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Zaplatit 149 Kč a aktivovat Gastro PRO</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Method 2: Test Token / Promo */}
                {activeTab === 'token' && (
                  <form onSubmit={handleTokenSubmit} className="space-y-4">
                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                      <label className="block text-xs font-medium text-stone-300">
                        Zadejte promo kód nebo testovací token:
                      </label>
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="např. GASTRO2026 nebo TEST-PRO"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 text-sm text-stone-100 uppercase tracking-widest font-mono focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[11px] text-stone-500">
                        Tip pro testování: Použijte kód <strong className="text-amber-400">GASTRO2026</strong> nebo <strong className="text-amber-400">TEST-PRO</strong> pro okamžitou bezplatnou aktivaci.
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
                          <span>Ověřuji token...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Ověřit token a odemknout aplikaci</span>
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
