import type { Metadata } from "next";

import SmartImage from "@/components/SmartImage";
import { sanityFetch } from "@/lib/sanity/client";
import { galleryQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { GalleryItem } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ fallbackTitle: "Gallery", path: "/gallery" });
}

export default async function GalleryPage() {
  const items = await sanityFetch<GalleryItem[]>(galleryQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Gallery</h1>
      <p className="mt-4 max-w-3xl text-slate-600">
        A look at our fleet, terminals, container freight stations and project cargo operations across India.
      </p>

      {items && items.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <figure key={item._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-surface">
                <SmartImage
                  value={item.image}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {item.title && <figcaption className="p-3 text-xs font-semibold text-slate-600">{item.title}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500">Gallery images will appear here once published in the CMS.</p>
      )}
    </div>
  );
}
