import React, { useState } from 'react';
import {
  Copy,
  Check,
  Facebook,
  Instagram,
  MessageSquare,
  Sparkles,
  Share2,
  Hash,
  Clock,
  ThumbsUp,
  MessageCircle,
  Heart,
  Bookmark,
  Send,
} from 'lucide-react';
import { SocialPostData, InstagramPostData } from '../types/menu';

interface SocialMediaTabProps {
  facebook: SocialPostData;
  instagram: InstagramPostData;
  smsWhatsapp: string;
  restaurantName: string;
  menuDate: string;
  marketingTips?: string[];
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  facebook,
  instagram,
  smsWhatsapp,
  restaurantName,
  menuDate,
  marketingTips = [],
}) => {
  const [subTab, setSubTab] = useState<'facebook' | 'instagram' | 'sms'>('facebook');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const displayName = restaurantName || 'Naše restaurace & bistro';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            Lákavé gastro příspěvky pro sociální sítě
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Optimalizované texty s gastronábojem, lákavým popisem chutí, výzvou k návštěvě a hashtagy
          </p>
        </div>

        {/* Sub-tab buttons */}
        <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800 self-start sm:self-auto">
          <button
            onClick={() => setSubTab('facebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => setSubTab('instagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setSubTab('sms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === 'sms'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS / WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* FACEBOOK PREVIEW */}
          {subTab === 'facebook' && (
            <div className="bg-stone-900 border border-stone-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
              {/* FB Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 font-bold flex items-center justify-center text-sm shadow">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-stone-100">{displayName}</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 flex items-center gap-1">
                      <span>Dnes v 10:15</span> • <span>🌐 Veřejné</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(facebook.fullFormattedText, 'fb')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white transition-all text-xs font-semibold"
                >
                  {copiedType === 'fb' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zkopírováno!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopírovat pro Facebook</span>
                    </>
                  )}
                </button>
              </div>

              {/* FB Post Body */}
              <div className="text-sm text-stone-200 leading-relaxed space-y-3 whitespace-pre-wrap font-sans bg-stone-950/60 p-4 rounded-xl border border-stone-800">
                {facebook.fullFormattedText}
              </div>

              {/* FB Engagement bar */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-around text-xs text-stone-400 font-medium">
                <div className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition-colors py-1">
                  <ThumbsUp className="w-4 h-4" /> To se mi líbí
                </div>
                <div className="flex items-center gap-1.5 hover:text-stone-200 cursor-pointer transition-colors py-1">
                  <MessageCircle className="w-4 h-4" /> Komentář
                </div>
                <div className="flex items-center gap-1.5 hover:text-stone-200 cursor-pointer transition-colors py-1">
                  <Share2 className="w-4 h-4" /> Sdílet
                </div>
              </div>
            </div>
          )}

          {/* INSTAGRAM PREVIEW */}
          {subTab === 'instagram' && (
            <div className="bg-stone-900 border border-stone-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
              {/* IG Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center font-bold text-xs text-stone-100">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-100 lowercase">
                      {displayName.toLowerCase().replace(/\s+/g, '_')}
                    </span>
                    <p className="text-[11px] text-stone-400">{menuDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(instagram.fullFormattedText, 'ig')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600 border border-pink-500/40 text-pink-300 hover:text-white transition-all text-xs font-semibold"
                >
                  {copiedType === 'ig' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zkopírováno!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopírovat pro Instagram</span>
                    </>
                  )}
                </button>
              </div>

              {/* IG Hook Highlight */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Úderný hook pro Instagram: &ldquo;{instagram.hook}&rdquo;</span>
              </div>

              {/* IG Caption Content */}
              <div className="text-sm text-stone-200 leading-relaxed whitespace-pre-wrap font-sans bg-stone-950/60 p-4 rounded-xl border border-stone-800">
                {instagram.fullFormattedText}
              </div>

              {/* IG Fake Actions */}
              <div className="flex items-center justify-between text-stone-400 pt-1">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
                  <MessageCircle className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                  <Send className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          )}

          {/* SMS / WHATSAPP PREVIEW */}
          {subTab === 'sms' && (
            <div className="bg-stone-900 border border-stone-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-stone-100">Rychlá zpráva (WhatsApp / SMS)</span>
                </div>
                <button
                  onClick={() => handleCopy(smsWhatsapp, 'sms')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all text-xs font-semibold"
                >
                  {copiedType === 'sms' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zkopírováno!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopírovat zprávu</span>
                    </>
                  )}
                </button>
              </div>

              <div className="max-w-md bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-2xl text-sm text-stone-200 leading-relaxed font-sans shadow-inner">
                <div className="text-[11px] text-emerald-400 font-semibold mb-1">
                  💬 Náhled pro zákazníky / štamgasty:
                </div>
                {smsWhatsapp}
              </div>
            </div>
          )}
        </div>

        {/* Right: Gastro Marketing Insights & Hashtags */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hashtags Cloud */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                Doporučené české gastro hashtagy:
              </h3>
              <button
                onClick={() => {
                  const tags = (subTab === 'instagram' ? instagram.hashtags : facebook.hashtags).join(' ');
                  handleCopy(tags, 'tags');
                }}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                {copiedType === 'tags' ? 'Zkopírováno!' : 'Kopírovat hashtagy'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(subTab === 'instagram' ? instagram.hashtags : facebook.hashtags).map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCopy(tag, `tag-${idx}`)}
                  className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-400/90 text-xs font-mono cursor-pointer transition-colors border border-stone-700/60"
                  title="Kliknutím zkopírovat jeden hashtag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Gastro Marketing Tips */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Tipy šéfkuchaře pro maximální dosah:
            </h3>

            <div className="space-y-2.5 text-xs text-stone-300">
              {marketingTips.length > 0 ? (
                marketingTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-stone-950/50 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2 bg-stone-950/50 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-amber-400 font-bold">⏰</span>
                    <span><strong>Ideální čas pro post:</strong> 10:15 – 10:45 dopoledne, kdy lidé v kancelářích rozhodují o obědě.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-stone-950/50 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-amber-400 font-bold">📸</span>
                    <span><strong>Foto na stories:</strong> Vyfoťte první vydaný talíř z výšky u okna na denním světle.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-stone-950/50 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-amber-400 font-bold">📍</span>
                    <span><strong>Lokalita:</strong> Vždy k příspěvku připojte polohu podniku, ať vás najdou noví hosté z okolí.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Instant copy all button */}
          <button
            onClick={() => handleCopy(subTab === 'instagram' ? instagram.fullFormattedText : facebook.fullFormattedText, 'all')}
            className="w-full py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            {copiedType === 'all' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Celý text zkopírován do schránky!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Zkopírovat celý aktuální příspěvek</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
