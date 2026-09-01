import { useState } from "react";
import { REGIONAL_HUBS, HubDetail } from "../data/logisticsData";
import { MapPin, Globe, ArrowRight, Anchor, Truck, Train, Plane } from "lucide-react";
import { cn } from "../utils/cn";
import { useSiteContent } from "../hooks/useSiteContent";

export default function InteractiveMap() {
  const content = useSiteContent();
  const [selectedHub, setSelectedHub] = useState<HubDetail>(REGIONAL_HUBS[0]);
  const [hoveredHub, setHoveredHub] = useState<HubDetail | null>(null);

  const getHubIcon = (type: string) => {
    switch (type) {
      case "Port Hub": return <Anchor className="w-4 h-4 text-white" />;
      case "Inland Depot": return <Train className="w-4 h-4 text-white" />;
      case "Multimodal Terminal": return <Plane className="w-4 h-4 text-white" />;
      default: return <Truck className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-10 relative overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-full text-xs font-bold text-[#062B3A] tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5 text-[#FF6B1A] animate-spin-slow" />
              <span>Pan-India Connectivity Map</span>
            </span>
            <h3 className="text-2xl lg:text-3xl font-black text-[#062B3A] tracking-tight leading-tight">
              Strategic Hubs & <span className="text-[#FF6B1A]">Multimodal Links</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Arrowline coordinates containerized freight, FTL fleets, and customs-cleared cargo from <strong className="text-[#062B3A]">Mundra Port, Gujarat</strong> directly to industrial zones nationwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {REGIONAL_HUBS.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                className={cn(
                  "p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center space-x-2.5",
                  selectedHub.id === hub.id
                    ? "bg-[#EAF3F6] border-[#FF6B1A] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-[#F5F8FA]"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  selectedHub.id === hub.id ? "bg-[#FF6B1A] scale-105" : "bg-[#062B3A]"
                )}>
                  {getHubIcon(hub.type)}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#062B3A] truncate">{hub.name.split(" ")[0]}</span>
                  <span className="block text-[10px] text-slate-500 truncate">{hub.state}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-5 bg-gradient-to-br from-[#F5F8FA] to-white border border-[#FF6B1A]/20 rounded-2xl space-y-3.5 relative overflow-hidden shadow-inner">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-[#FF6B1A] opacity-10 rounded-full blur-xl" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6B1A]">
                  {selectedHub.type}
                </span>
                <h4 className="text-lg font-black text-[#062B3A] flex items-center space-x-2 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#FF6B1A]" />
                  <span>{selectedHub.name}</span>
                </h4>
              </div>
              <span className="px-2.5 py-0.5 bg-[#062B3A] text-white text-[10px] font-bold rounded-full">
                {selectedHub.state}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-700 leading-relaxed text-[11.5px]">{selectedHub.details}</p>
              <div className="pt-2 border-t border-slate-200">
                <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Connectivity:</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{selectedHub.connectivity}</p>
              </div>
            </div>

            {selectedHub.id !== "hub-mundra" && (
              <div className="pt-2 flex items-center space-x-1.5 text-xs text-[#FF6B1A] font-bold">
                <span>Direct Freight Corridor from Mundra HQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="px-1.5 py-0.5 bg-[#FF6B1A]/10 rounded text-[10px]">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Map */}
        <div className="lg:col-span-7 flex justify-center relative p-2">
          <div className="relative w-full max-w-[500px] aspect-[4/5] bg-gradient-to-br from-[#F5F8FA] via-white to-[#EAF3F6] rounded-3xl border border-slate-200 p-4 flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 bg-grid-pattern opacity-60 rounded-3xl pointer-events-none" />

            <img
              src={content("coverage_map_image", "/images/india-map.svg")}
              alt="Map of India showing Arrowline logistics hubs"
              className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] object-contain opacity-25 drop-shadow-lg map-sway"
            />
            <svg viewBox="0 0 350 400" className="relative z-10 w-full h-full max-h-[440px] select-none" xmlns="http://www.w3.org/2000/svg">

              {REGIONAL_HUBS.map((hub) => {
                if (hub.id === "hub-mundra") return null;
                const startX = 80.5;
                const startY = 208;
                const targetX = (hub.coordinates.x / 100) * 350;
                const targetY = (hub.coordinates.y / 100) * 400;
                const isTargetSelected = selectedHub.id === hub.id;
                const isTargetHovered = hoveredHub?.id === hub.id;

                return (
                  <g key={`line-${hub.id}`}>
                    <line
                      className="animate-route-draw"
                      x1={startX} y1={startY} x2={targetX} y2={targetY}
                      stroke={isTargetSelected || isTargetHovered ? "#FF6B1A" : "#94A3B8"}
                      strokeWidth={isTargetSelected || isTargetHovered ? "2.5" : "1.2"}
                      strokeDasharray="4,4"
                    />
                    <circle r="3" fill="#FF6B1A" className="opacity-90">
                      <animateMotion path={`M ${startX} ${startY} L ${targetX} ${targetY}`} dur="3.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}

              {REGIONAL_HUBS.map((hub) => {
                const mapX = (hub.coordinates.x / 100) * 350;
                const mapY = (hub.coordinates.y / 100) * 400;
                const isSelected = selectedHub.id === hub.id;
                const isHovered = hoveredHub?.id === hub.id;
                const isMundra = hub.id === "hub-mundra";

                return (
                  <g key={`marker-${hub.id}`} transform={`translate(${mapX}, ${mapY})`}
                     className="cursor-pointer group"
                     onClick={() => setSelectedHub(hub)}
                     onMouseEnter={() => setHoveredHub(hub)}
                     onMouseLeave={() => setHoveredHub(null)}>
                    <circle r={isMundra ? "16" : "12"}
                      className={cn("fill-none stroke-2 transition-all duration-300",
                        isSelected || isHovered ? "stroke-[#FF6B1A] opacity-90" : isMundra ? "stroke-[#FF6B1A] opacity-60 animate-ping" : "stroke-[#062B3A] opacity-40")} />
                    <circle r={isMundra ? "7" : "5"}
                      className={cn("transition-all duration-200",
                        isMundra ? "fill-[#FF6B1A]" : isSelected || isHovered ? "fill-[#FF6B1A]" : "fill-[#062B3A]")} />
                  </g>
                );
              })}
            </svg>

            {hoveredHub && (
              <div className="absolute z-20 pointer-events-none bg-[#03212D] border border-[#FF6B1A] rounded-xl px-3 py-1.5 shadow-2xl text-center"
                style={{ left: `${hoveredHub.coordinates.x}%`, top: `${hoveredHub.coordinates.y - 12}%`, transform: 'translate(-50%, -100%)' }}>
                <span className="block text-[11px] font-black text-white whitespace-nowrap">{hoveredHub.name}</span>
                <span className="block text-[9px] text-[#FF7A00] font-bold uppercase whitespace-nowrap tracking-wide">{hoveredHub.type}</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 bg-white/95 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[10px] text-slate-600 backdrop-blur shadow-sm">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A] inline-block animate-pulse" />
                  <span className="text-[#062B3A] font-bold">Mundra Port HQ</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#062B3A] inline-block" />
                  <span>Regional Terminal</span>
                </span>
              </div>
              <span className="text-slate-400 italic hidden sm:inline">Click nodes for route info</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
