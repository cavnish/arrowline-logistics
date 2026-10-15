import type { Faq } from "@/lib/types";

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details key={faq._id} className="group rounded-2xl border border-slate-200 bg-white p-4 open:border-orange">
          <summary className="cursor-pointer list-none text-sm font-bold text-navy marker:hidden">
            {faq.question}
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
