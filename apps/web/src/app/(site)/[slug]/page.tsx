import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PortableText from "@/components/PortableText";
import { sanityFetch } from "@/lib/sanity/client";
import { pageBySlugQuery, pageSlugsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { CmsPage } from "@/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  const pages = await sanityFetch<Array<{ slug: string }>>(pageSlugsQuery);
  return (pages || []).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityFetch<CmsPage>(pageBySlugQuery, { slug });
  return buildMetadata({
    seo: page?.seo,
    fallbackTitle: page?.title || "Page",
    path: `/${slug}`,
  });
}

export default async function CmsPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await sanityFetch<CmsPage>(pageBySlugQuery, { slug });
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">{page.title}</h1>
      <div className="mt-6">
        <PortableText value={page.body} />
      </div>
    </article>
  );
}
