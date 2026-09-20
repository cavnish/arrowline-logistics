/* Shared Home-matched button + card style tokens for the service pages.

   These class strings mirror the Arrowline HOME page design system exactly
   (see src/components/HeroSection.tsx + src/components/ServicesSection.tsx):
   moderate rounded-xl buttons, brand orange gradient, soft orange shadow,
   hover lift + arrow drift; rounded-lg cards with subtle shadow/border. */

export const AL_BTN_PRIMARY =
  "group relative inline-flex h-[50px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#FF7A2F] to-[#FF6B1A] px-7 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,107,26,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#E55A0D] hover:to-[#FF7A00] hover:shadow-[0_16px_38px_-10px_rgba(255,107,26,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB27D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03212D] active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px] motion-reduce:transform-none motion-reduce:transition-none";

/* Same as AL_BTN_PRIMARY but with a light focus ring offset for use on
   light (white / #F5F8FA) section backgrounds. */
export const AL_BTN_PRIMARY_LIGHT =
  "group relative inline-flex h-[50px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#FF7A2F] to-[#FF6B1A] px-7 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,107,26,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#E55A0D] hover:to-[#FF7A00] hover:shadow-[0_16px_38px_-10px_rgba(255,107,26,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB27D] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px] motion-reduce:transform-none motion-reduce:transition-none";

/* Ghosted secondary button for dark sections (matches Home hero). */
export const AL_BTN_SECONDARY =
  "group inline-flex h-[50px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03212D] active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px] motion-reduce:transform-none motion-reduce:transition-none";

/* Outlined secondary button for light sections (navy border, white fill). */
export const AL_BTN_SECONDARY_LIGHT =
  "group inline-flex h-[50px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#062B3A]/20 bg-white px-7 text-sm font-bold text-[#062B3A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF6B1A]/50 hover:bg-[#F5F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px] motion-reduce:transform-none motion-reduce:transition-none";

/* Premium card shell matching the Home services grid. */
export const AL_CARD =
  "group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B1A]/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]";

/* Uniform 16:9 image frame used by all service cards. */
export const AL_CARD_IMAGE = "relative aspect-video overflow-hidden bg-slate-100";

/* Sheen sweep element used on primary buttons (matches Home hero). */
export function BtnSheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.22),transparent)] translate-x-[-140%] transition-transform duration-700 group-hover:translate-x-[160%]"
    />
  );
}