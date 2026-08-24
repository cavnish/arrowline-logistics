import { CASE_STUDIES } from "../data/logisticsData";
import MasonryGallery from "../components/MasonryGallery";
import SEOMeta from "../components/SEOMeta";
import { CheckCircle2, AlertTriangle, ShieldCheck, Award } from "lucide-react";

export default function Gallery() {
  return (
    <div className="space-y-16">
      <SEOMeta
        title="Case Studies & Operational Photo Gallery"
        description="Review successful logistics case studies from Arrowline Logistics. Highlights include heavy-lift ODC cargo moves, coastal transport loops, and customs brokerage approvals."
      />

      <section className="space-y-4">
        <nav className="text-xs text-slate-500 font-semibold tracking-wide flex items-center space-x-1.5 uppercase">
          <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="text-[#1E3A8A]">Case Studies & Gallery</span>
        </nav>
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
            Proven Performance
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight leading-tight">
            Our Shipping Case Studies & <span className="text-[#FF7A00]">Operations Yard</span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Arrowline Logistics backs performance promises with audited results. Review detailed challenge-to-result logs of over-dimensional cargo moves, bulk loops, and quick express dispatches across India.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-1 bg-[#FEF9F0] p-4 border-l-4 border-[#FF7A00] rounded-r-xl">
          <h2 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wider">
            Audited Logistical Case Studies
          </h2>
          <span className="text-[10.5px] text-slate-500 font-semibold">
            All records validated by our Mundra Port compliance agents
          </span>
        </div>

        <div className="space-y-10">
          {CASE_STUDIES.map((study) => (
            <div key={study.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm hover:shadow-lg transition-shadow">
              <div className="lg:col-span-4 bg-slate-100 relative min-h-[220px] aspect-[4/3] lg:aspect-auto">
                <img src={study.image} alt={study.title} loading="lazy"
                  className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white hidden lg:block" />

                <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 backdrop-blur rounded-lg p-3 text-left space-y-1 shadow-md">
                  <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none">Sector:</span>
                  <span className="block text-[11px] font-bold text-[#FF7A00] leading-tight">{study.clientSector}</span>
                </div>
              </div>

              <div className="lg:col-span-8 p-6 lg:p-8 space-y-5">
                <div className="space-y-1.5 border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-extrabold uppercase text-[#FF7A00] tracking-widest">
                    {study.service}
                  </span>
                  <h3 className="text-md sm:text-lg font-bold text-[#1E3A8A] uppercase tracking-wide">
                    {study.title}
                  </h3>
                  <span className="block text-[11px] text-slate-500">
                    <strong>Corridor:</strong> {study.location}
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  <strong className="text-[#1E3A8A]">Overview:</strong> {study.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-red-600 tracking-wider flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Challenge</span>
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{study.challenge}</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Solution</span>
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#FEF9F0] to-[#FFF4DC] border border-[#FF7A00]/30 rounded-xl flex items-center space-x-3.5">
                  <div className="w-10 h-10 bg-white border border-[#FF7A00]/40 rounded-lg flex items-center justify-center text-[#FF7A00] flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#FF7A00] tracking-widest">
                      Quantifiable Result
                    </span>
                    <p className="text-[11px] text-[#1E3A8A] leading-normal font-semibold">
                      {study.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-1.5 border-b border-slate-200 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
            Asset Catalog
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E3A8A] uppercase tracking-tight">
            Operational Photo Gallery
          </h2>
          <p className="text-xs text-slate-600 max-w-xl">
            Explore high-resolution photos of our coastal vessels, container trains, and custom operations yards.
          </p>
        </div>
        <MasonryGallery />
      </section>

      <div className="bg-gradient-to-br from-[#FEF9F0] to-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center border-2 border-[#FF7A00]/20 gap-6 text-center md:text-left shadow-sm">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide">
            Need similar secure logistics in India?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our planners compile route surveys, lashing certifications, and port clearance tailored to your industry.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-[#FF7A00]" />
            <span>Mundra Port Registered CHA</span>
          </span>
          <button
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_4px_15px_rgba(255,122,0,0.3)] transition-all"
          >
            Request Booking
          </button>
        </div>
      </div>
    </div>
  );
}
