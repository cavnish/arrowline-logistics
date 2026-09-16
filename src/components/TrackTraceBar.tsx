import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

interface TrackTraceBarProps { }

export default function TrackTraceBar(_props: TrackTraceBarProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setTrackingStatus(`Tracking Active: Consignment #${trackingNumber.toUpperCase()} is on scheduled transit corridor.`);
    setTimeout(() => setTrackingStatus(null), 5000);
  };

  return (
    <section className="bg-white text-[#062B3A] py-12 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="bg-[#F0F5FA] border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">

          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B1A] block">
              REAL-TIME CONSIGNMENT TELEMETRY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#062B3A]">
              Track Your Cargo / Consignment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Enter your B/L, LR, Container No, or Trip Manifest ID for instant location & ETA.
            </p>
          </div>

          {/* Tracking Form */}
          <div className="w-full lg:max-w-md space-y-2">
            <form onSubmit={handleTrack} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. AL-98421 / MSKU-7489"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-[#062B3A] placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B1A] shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>TRACK</span>
              </button>
            </form>

            {trackingStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{trackingStatus}</span>
              </div>
            )}
          </div>

        </Reveal>
      </div>
    </section>
  );
}
