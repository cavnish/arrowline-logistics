"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

import type { Navigation, SiteSettings } from "@/lib/types";

const FALLBACK_NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Transit Estimator", href: "/transit-time-estimator" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header({
  navigation,
  settings,
}: {
  navigation: Navigation | null;
  settings: SiteSettings | null;
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const nav =
    navigation?.header && navigation.header.length > 0
      ? navigation.header.map((item) => ({ label: item.label, href: item.href || "/", children: item.children }))
      : FALLBACK_NAV.map((item) => ({ ...item, children: undefined }));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Arrowline Logistics — home">
          <span className="text-lg font-black tracking-tight text-navy">ARROWLINE</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange">Logistics</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) =>
            item.children && item.children.length > 0 ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-cream"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href || child.label}
                        href={child.href || "/"}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-surface"
                        onClick={() => setServicesOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href || item.label}
                href={item.href || "/"}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-cream"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${(settings?.phone || "+919922204446").replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 text-sm font-semibold text-navy"
          >
            <Phone className="h-4 w-4 text-orange" aria-hidden />
            {settings?.phone || "+91 99222 04446"}
          </a>
          <Link
            href="/contact"
            className="rounded-xl bg-orange px-4 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-bright"
          >
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-navy lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href || item.label}
                href={item.href || "/"}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 block rounded-xl bg-orange px-4 py-2.5 text-center text-sm font-black uppercase tracking-wide text-white"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
