import { PortableText as PortableTextRenderer, type PortableTextComponents } from "@portabletext/react";

import SmartImage from "@/components/SmartImage";

const components: PortableTextComponents = {
  types: {
    mediaImage: ({ value }) => (
      <div className="my-6 overflow-hidden rounded-2xl">
        <SmartImage value={value} width={1200} height={800} className="h-auto w-full" sizes="(max-width: 768px) 100vw, 800px" />
      </div>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-black text-navy">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-bold text-navy">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-slate-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-orange bg-cream px-4 py-2 italic text-slate-700">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="font-semibold text-orange underline" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default function PortableText({ value }: { value?: unknown[] | null }) {
  if (!value || value.length === 0) return null;
  return <PortableTextRenderer value={value as never} components={components} />;
}
