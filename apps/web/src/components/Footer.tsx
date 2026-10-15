import Link from "next/link";

import type { Navigation, SiteSettings } from "@/lib/types";

const FALLBACK_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Road Transportation", href: "/services/road-transportation" },
      { label: "Rail Transportation", href: "/services/rail-transportation" },
      { label: "Project Cargo", href: "/services/project-cargo-transportation" },
      { label: "Warehousing & Storage", href: "/services/warehousing-storage" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Industries", href: "/industries" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer({
  navigation,
  settings,
}: {
  navigation: Navigation | null;
  settings: SiteSettings | null;
}) {
  const columns =
    navigation?.footerColumns && navigation.footerColumns.length > 0
      ? navigation.footerColumns
      : FALLBACK_COLUMNS;
  const legal = navigation?.legalLinks || [];

  return (
    <footer className="bg-navy-dark text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">ARROWLINE</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange">Logistics</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            {settings?.tagline || "Cargo in Motion. Trust on Track."}
          </p>
          <address className="mt-4 space-y-1 text-sm not-italic text-slate-300">
            {settings?.address && <p>{settings.address}</p>}
            {settings?.phone && (
              <p>
                <a className="hover:text-orange" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                  {settings.phone}
                </a>
              </p>
            )}
            {settings?.email && (
              <p>
                <a className="hover:text-orange" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </p>
            )}
          </address>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {(column.links || []).map((link) => (
                <li key={link.href || link.label}>
                  <Link href={link.href || "/"} className="text-sm text-slate-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-400 sm:px-6 lg:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Arrowline Logistics Pvt Ltd. All rights reserved.</p>
          {legal.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {legal.map((link) => (
                <li key={link.href || link.label}>
                  <Link href={link.href || "/"} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
