import { useState } from "react";
import { GALLERY_ITEMS } from "../data/logisticsData";
import { X, ChevronLeft, ChevronRight, Play, Heart, MessageCircle, Share2, Filter, Grid, Film, Star } from "lucide-react";
import { cn } from "../utils/cn";

export default function MasonryGallery() {
  const [activeTab, setActiveTab] = useState<"photos" | "social">("photos");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = selectedFilter === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedFilter);

  const categories = ["All", "Mundra Port", "Road Fleet", "Rail Freight", "ODC Cargo", "Customs"];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  const mockSocialFeeds = [
    {
      id: "social-1",
      platform: "LinkedIn",
      title: "Executing High-Volume FTL Logistics from Mundra to Delhi NCR",
      author: "Vinay Kumar • Director Operations",
      time: "2 days ago",
      views: "14,230 views",
      likes: 428,
      comments: 65,
      videoThumbnail: "/images/road-transport.jpg",
      videoUrl: "https://www.linkedin.com/feed/update/urn:li:activity:arrowline_1",
      description: "Incredibly proud of our highway fleet planning team! Yesterday we flagged off 25 high-cube trailers simultaneously from Mundra Port, Gujarat directly to Delhi NCR industrial warehouses. With live GPS tracking, our clients received delivery within 24 hours. #MundraPort #LogisticsIndia",
    },
    {
      id: "social-2",
      platform: "Instagram Reels",
      title: "Heavy Lift Project Cargo: 85-Ton ODC Trailer in Action!",
      author: "@arrowline_logistics",
      time: "1 week ago",
      views: "48.5K plays",
      likes: "2.4K",
      comments: 110,
      videoThumbnail: "/images/project-cargo.jpg",
      videoUrl: "https://www.instagram.com/reel/arrowline_odc",
      description: "Precision, safety, and power. 🏗️ Watch our 85-ton modular trailer navigate a tight bypass structure on the national corridor. Pre-surveyed by our project planning division. #ODC #HeavyLift #IndiaInfrastructure",
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex items-center space-x-1 shadow-sm">
          <button
            onClick={() => setActiveTab("photos")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-2",
              activeTab === "photos" ? "bg-[#FF7A00] text-white shadow-md" : "text-slate-500 hover:text-[#1E3A8A]"
            )}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Operational Photos</span>
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-2",
              activeTab === "social" ? "bg-[#FF7A00] text-white shadow-md" : "text-slate-500 hover:text-[#1E3A8A]"
            )}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Live Social Feed</span>
          </button>
        </div>
      </div>

      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 border",
                  selectedFilter === cat
                    ? "bg-[#FF7A00] border-[#FF7A00] text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:text-[#1E3A8A] hover:border-slate-300"
                )}
              >
                <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[#FF7A00]/40 hover:-translate-y-1 transition-all duration-300 relative shadow-sm hover:shadow-lg"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img src={item.image} alt={item.alt} loading="lazy"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-slate-200 text-[#FF7A00] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                  <div className="absolute inset-0 bg-[#1E3A8A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#FF7A00] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                      Open Lightbox
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#1E3A8A] group-hover:text-[#FF7A00] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500">No photos matching category.</span>
            </div>
          )}
        </div>
      )}

      {activeTab === "social" && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center max-w-md mx-auto space-y-1">
            <span className="inline-flex items-center space-x-1 text-xs text-[#FF7A00] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#FF7A00]" />
              <span>Real-Time Logistics Operations on Video</span>
            </span>
            <p className="text-xs text-slate-600">
              Interactive simulator showcasing updates published by our coordinators from Mundra terminal.
            </p>
          </div>

          {mockSocialFeeds.map((feed) => (
            <div key={feed.id} className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-full border border-slate-200 flex items-center justify-center font-bold text-white text-xs">
                    AL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E3A8A]">{feed.author}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span>{feed.time}</span>
                      <span>·</span>
                      <span className="text-[#FF7A00] font-semibold">{feed.platform}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FEF9F0] rounded text-slate-600">
                  {feed.views}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{feed.description}</p>

              <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-xl overflow-hidden group border border-slate-200">
                <img src={feed.videoThumbnail} alt={feed.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                  <button
                    onClick={() => alert(`Simulating Video Playback of: "${feed.title}".`)}
                    className="w-14 h-14 bg-[#FF7A00] hover:bg-[#E56D00] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Play video"
                  >
                    <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-[#1E3A8A]/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                    Click to Play
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                  <span className="font-bold truncate max-w-[70%]">{feed.title}</span>
                  <span className="bg-red-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase animate-pulse">
                    Live
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-600">
                <button className="flex items-center space-x-1.5 hover:text-[#FF7A00] transition-colors">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span>{feed.likes} Likes</span>
                </button>
                <span className="flex items-center space-x-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{feed.comments} Comments</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(feed.videoUrl);
                    alert("Link copied!");
                  }}
                  className="flex items-center space-x-1.5 hover:text-[#1E3A8A] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-[#1E3A8A]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
             onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white bg-white/10 border border-white/30 p-2 rounded-xl hover:bg-white/20 transition-all z-50"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>

          <button onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 border border-white/30 p-3 rounded-xl transition-all z-40"
            aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl w-full flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="w-full md:w-3/5 bg-slate-100 flex items-center justify-center aspect-[4/3] md:aspect-auto md:h-[500px]">
              <img src={filteredPhotos[lightboxIndex].image} alt={filteredPhotos[lightboxIndex].alt}
                className="object-contain w-full h-full max-h-[500px]" />
            </div>

            <div className="w-full md:w-2/5 p-6 lg:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="px-3 py-0.5 bg-[#FEF9F0] border border-[#FF7A00]/40 rounded-full text-[#FF7A00] text-[9px] font-black uppercase tracking-widest">
                    {filteredPhotos[lightboxIndex].category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {lightboxIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-[#1E3A8A] leading-tight">
                    {filteredPhotos[lightboxIndex].title}
                  </h3>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    {filteredPhotos[lightboxIndex].caption}
                  </p>
                </div>

                <div className="bg-[#FEF9F0] rounded-xl p-3.5 border border-slate-200 space-y-2 text-[10px] text-slate-600">
                  <span className="block font-bold text-[#1E3A8A] uppercase tracking-wide">SEO Details:</span>
                  <div className="grid grid-cols-2 gap-1 font-mono">
                    <span>ALT:</span>
                    <span className="text-[#1E3A8A] truncate">{filteredPhotos[lightboxIndex].alt}</span>
                    <span>Origin:</span>
                    <span className="text-[#1E3A8A]">Mundra Port</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <span className="block text-[9px] font-black uppercase text-slate-500 tracking-wider text-center">
                  Need similar shipping execution?
                </span>
                <button
                  onClick={() => {
                    setLightboxIndex(null);
                    const element = document.getElementById("contact");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_4px_15px_rgba(255,122,0,0.3)] transition-all"
                >
                  Request Cargo Booking
                </button>
              </div>
            </div>
          </div>

          <button onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 border border-white/30 p-3 rounded-xl transition-all z-40"
            aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
