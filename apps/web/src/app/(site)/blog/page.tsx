import type { Metadata } from "next";
import Link from "next/link";

import SmartImage from "@/components/SmartImage";
import { sanityFetch } from "@/lib/sanity/client";
import { blogPostsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { BlogPostSummary } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ fallbackTitle: "Insights & News", path: "/blog" });
}

export default async function BlogPage() {
  const posts = await sanityFetch<BlogPostSummary[]>(blogPostsQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Insights & News</h1>
      <p className="mt-4 max-w-3xl text-slate-600">
        Updates on Indian logistics, EXIM trade, port operations and the multimodal corridors we operate on.
      </p>

      {posts && posts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] bg-surface">
                <SmartImage value={post.coverImage} width={800} height={500} className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                {post.category?.title && (
                  <span className="text-xs font-bold uppercase tracking-wide text-orange">{post.category.title}</span>
                )}
                <h2 className="mt-1 text-lg font-black text-navy">{post.title}</h2>
                {post.excerpt && <p className="mt-2 flex-1 text-sm text-slate-600">{post.excerpt}</p>}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="mt-3 text-xs text-slate-400">
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500">Articles will appear here once published in the CMS.</p>
      )}
    </div>
  );
}
