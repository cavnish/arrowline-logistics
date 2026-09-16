import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "arrowline_cookie_consent";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const DEFAULT_PREFS: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
};

function loadStoredConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (
      typeof parsed?.necessary !== "boolean" ||
      typeof parsed?.analytics !== "boolean" ||
      typeof parsed?.marketing !== "boolean"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, timestamp: new Date().toISOString() })
    );
  } catch {
    // Storage unavailable (private mode / quota) — banner simply reappears next visit.
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(loadStoredConsent);
  const [showSettings, setShowSettings] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [draft, setDraft] = useState({
    analytics: false,
    marketing: false,
  });

  const showBanner = consent === null;

  useEffect(() => {
    if (!showSettings) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSettings(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSettings]);

  const dismissBanner = (next: ConsentState) => {
    setDismissing(true);
    window.setTimeout(() => {
      storeConsent(next);
      setConsent(next);
      setShowSettings(false);
      setDismissing(false);
    }, 300);
  };

  const acceptAll = () => {
    const next: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    dismissBanner(next);
  };

  const rejectOptional = () => {
    const next: ConsentState = { ...DEFAULT_PREFS, timestamp: new Date().toISOString() };
    dismissBanner(next);
  };

  const savePreferences = () => {
    const next: ConsentState = {
      necessary: true,
      analytics: draft.analytics,
      marketing: draft.marketing,
      timestamp: new Date().toISOString(),
    };
    storeConsent(next);
    setConsent(next);
    setShowSettings(false);
  };

  const openSettings = () => {
    setDraft({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    });
    setShowSettings(true);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !dismissing && (
          <motion.div
            key="cookie-banner"
            role="region"
            aria-label="Cookie consent"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6"
          >
            <div className="mx-auto max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(3,33,45,0.35)] p-4 sm:p-5 overflow-hidden relative">
              {/* Top brand accent */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#FF6B1A] to-[#FFB366]" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FEF9F0] border border-[#FF6B1A]/20 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-[#FF6B1A]" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h2 className="text-sm font-black text-[#1E3A8A] flex items-center gap-2">
                    We use cookies
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#EAF3F6] text-[9px] font-bold text-[#062B3A] uppercase tracking-wider">
                      Privacy-first
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Essential cookies keep Arrowline Logistics working. Optional
                    cookies help us understand usage. No unnecessary tracking added.
                  </p>
                  <button
                    type="button"
                    onClick={openSettings}
                    className="text-xs font-bold text-[#1E3A8A] underline underline-offset-2 hover:text-[#FF6B1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Cookie Settings
                  </button>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={rejectOptional}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-[#1E3A8A] text-xs font-bold uppercase tracking-wide transition-all active:scale-95 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
                  >
                    Reject Optional
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    autoFocus
                    className="px-4 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-wide transition-all active:scale-95 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="cookie-settings-backdrop"
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#03212D]/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowSettings(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#FF6B1A] to-[#FFB366]" />

              <div className="p-5 sm:p-6 relative">
                <div className="flex items-start justify-between gap-4">
                  <h2 id="cookie-settings-title" className="text-base font-black text-[#1E3A8A]">
                    Cookie Settings
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    autoFocus
                    aria-label="Close cookie settings"
                    className="text-slate-400 hover:text-[#1E3A8A] p-1 rounded-lg border border-transparent hover:border-slate-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Manage which cookies we may use. Essential cookies are always
                  active because the website needs them to function.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                    <div>
                      <p className="text-xs font-bold text-[#1E3A8A]">Essential Cookies</p>
                      <p className="text-[10px] text-slate-500">Always active</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      On
                    </span>
                  </div>

                  <CookieToggle
                    label="Analytics Cookies"
                    description="Understand website usage to improve your experience."
                    checked={draft.analytics}
                    onChange={(value) => setDraft((prev) => ({ ...prev, analytics: value }))}
                  />

                  <CookieToggle
                    label="Marketing Cookies"
                    description="Personalise promotional content."
                    checked={draft.marketing}
                    onChange={(value) => setDraft((prev) => ({ ...prev, marketing: value }))}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="w-full py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2"
                  >
                    Save Preferences
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="w-full py-3 border border-slate-300 text-[#1E3A8A] hover:bg-slate-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface CookieToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function CookieToggle({ label, description, checked, onChange }: CookieToggleProps) {
  const toggleId = `cookie-toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3">
      <div>
        <label htmlFor={toggleId} className="text-xs font-bold text-[#1E3A8A] cursor-pointer">
          {label}
        </label>
        <p className="text-[10px] text-slate-500">{description}</p>
      </div>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label} ${checked ? "enabled" : "disabled"}`}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#FF7A00]" : "bg-slate-300"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}