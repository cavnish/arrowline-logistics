import SmartImage from "@/components/SmartImage";
import type { ServiceDetail } from "@/lib/types";

/**
 * The content-rich body of a service page (about, benefits, process, showcase,
 * cargo applications). Shared by main-service and sub-service routes so both
 * render the migrated Sanity content identically.
 */
export default function ServiceSections({ service }: { service: ServiceDetail }) {
  const benefits = service.benefits || [];
  const steps = service.processSteps || [];
  const showcase = service.showcase || [];
  const cargo = service.cargoApplications || [];

  return (
    <>
      {(service.aboutHeading || service.aboutBody || service.aboutImage) && (
        <section className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            {service.aboutHeading && <h2 className="text-xl font-black text-navy">{service.aboutHeading}</h2>}
            {service.aboutBody && <p className="mt-3 leading-relaxed text-slate-700">{service.aboutBody}</p>}
          </div>
          {service.aboutImage && (
            <div className="overflow-hidden rounded-2xl">
              <SmartImage value={service.aboutImage} width={1000} height={700} className="h-auto w-full" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          )}
        </section>
      )}

      {(service.capabilities?.length || benefits.length > 0) && (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {service.capabilities && service.capabilities.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-navy">Capabilities</h2>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-700">
                {service.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
            </div>
          )}
          {benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-navy">Benefits</h2>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-700">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {steps.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-black text-navy">How we work</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title || index} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="text-sm font-black text-orange">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-lg font-bold text-navy">{step.title}</h3>
                {step.subtitle && <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{step.subtitle}</p>}
                {step.description && <p className="mt-2 text-sm text-slate-600">{step.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {showcase.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-black text-navy">{service.showcaseHeading || "Visual showcase"}</h2>
          {service.showcaseDescription && <p className="mt-2 max-w-3xl text-slate-600">{service.showcaseDescription}</p>}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((item, index) => (
              <figure key={item.title || index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] bg-surface">
                  <SmartImage value={item.image} width={700} height={525} className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                {(item.title || item.caption) && (
                  <figcaption className="p-4">
                    {item.title && <p className="text-sm font-bold text-navy">{item.title}</p>}
                    {item.caption && <p className="text-xs text-slate-500">{item.caption}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {cargo.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-black text-navy">{service.cargoHeading || "Cargo & applications"}</h2>
          {service.cargoDescription && <p className="mt-2 max-w-3xl text-slate-600">{service.cargoDescription}</p>}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {cargo.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {item.image && (
                  <div className="relative aspect-[16/9] bg-surface">
                    <SmartImage value={item.image} width={800} height={450} className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
