import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PortableText from "@/components/PortableText";
import SmartImage from "@/components/SmartImage";
import { sanityFetch } from "@/lib/sanity/client";
import { blogPostBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { BlogPostSummary, SeoFields } from "@/lib/types";

export const revalidate = 300;

interface BlogPostDetail extends BlogPostSummary {
  body?: unknown[] | null;
  seo?: SeoFields | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<BlogPostDetail>(blogPostBySlugQuery, { slug });
  return buildMetadata({
    seo: post?.seo,
    fallbackTitle: post?.title || "Article",
    fallbackDescription: post?.excerpt || undefined,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<BlogPostDetail>(blogPostBySlugQuery, { slug });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {post.category?.title && (
        <span className="text-xs font-bold uppercase tracking-wide text-orange">{post.category.title}</span>
      )}
      <h1 className="mt-2 text-3xl font-black tracking-tight text-navy sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {post.author && <span>{post.author}</span>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        )}
      </div>

      {post.coverImage && (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <SmartImage value={post.coverImage} width={1200} height={675} className="h-auto w-full" priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      <div className="mt-8">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
