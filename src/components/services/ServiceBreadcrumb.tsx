import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface ServiceBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function ServiceBreadcrumb({ items }: ServiceBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center flex-wrap gap-1.5 text-xs font-bold text-slate-300 mb-6 uppercase tracking-wider"
    >
      <a
        href="#/"
        className="flex items-center gap-1 hover:text-[#FF7A00] transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-[#FF6B1A]" />
        <span>Home</span>
      </a>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {item.isCurrent || !item.href ? (
            <span className="text-[#FF7A00] font-black truncate max-w-[240px] sm:max-w-none">
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              className="hover:text-[#FF7A00] transition-colors text-slate-300"
            >
              {item.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
