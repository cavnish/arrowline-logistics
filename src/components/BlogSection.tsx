import { BLOG_POSTS } from "../data/logisticsData";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";

interface BlogSectionProps {
  onOpenQuote: () => void;
}

export default function BlogSection({ onOpenQuote }: BlogSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#062B3A] tracking-widest uppercase shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>LOGISTICS INSIGHTS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
            Latest Supply Chain & <span className="text-[#FF6B1A]">Logistics News</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Expert perspectives on multimodal optimization, maritime port infrastructure, road transport regulations, and Indian supply chain economics.
          </p>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Pill */}
                <span className="absolute top-3.5 left-3.5 bg-[#062B3A]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#062B3A]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#062B3A]">
                    By {post.author}
                  </span>

                  <button
                    onClick={onOpenQuote}
                    className="text-xs font-black uppercase text-[#FF6B1A] group-hover:text-[#FF7A00] flex items-center space-x-1 cursor-pointer"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
