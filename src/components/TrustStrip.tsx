import { ShieldCheck, Anchor, Truck, Clock, Globe } from "lucide-react";

const capabilities = [
  { icon: Anchor,     label: "Mundra Port Hub",       sublabel: "Our base in Gujarat" },
  { icon: Globe,      label: "500+ Cities",            sublabel: "All across India" },
  { icon: Truck,      label: "Road, Rail & Sea",       sublabel: "Multimodal transport" },
  { icon: ShieldCheck,label: "Live GPS Tracking",      sublabel: "Real-time updates" },
  { icon: Clock,      label: "24/7 Support",           sublabel: "Always available" },
];

export default function TrustStrip() {
  return (
    <section className="bg-[#F5F8FA] border-y border-slate-200 py-5 sm:py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-xl group hover:bg-white hover:shadow-sm transition-all duration-200 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-[#FF6B1A]/40 group-hover:bg-[#FF6B1A]/5 transition-colors shadow-sm">
                  <Icon className="w-4.5 h-4.5 text-[#FF6B1A]" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#062B3A] truncate">{item.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 truncate">{item.sublabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
