import SmartImage from "../ui/SmartImage";

interface ServiceCardProps {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  image?: string;
  imageAlt?: string;
  title: string;
  description: string;
}

const cardClasses =
  "group relative flex w-full aspect-square flex-col overflow-hidden rounded-[22px] bg-white border border-slate-100 shadow-[0_8px_30px_rgba(6,43,58,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(6,43,58,0.15)] hover:border-[#FF6B1A]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2";

export default function ServiceCard({
  href,
  onClick,
  image,
  imageAlt,
  title,
  description,
}: ServiceCardProps) {
  const body = (
    <>
      <div className="relative h-[56%] shrink-0 overflow-hidden bg-slate-100">
        <SmartImage
          src={image}
          alt={imageAlt || title}
          width={800}
          height={800}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/35 via-transparent to-transparent" />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-4 py-3.5 sm:px-5 sm:py-4 min-h-0">
        <h3 className="line-clamp-2 text-sm sm:text-base lg:text-lg font-bold leading-snug text-[#062B3A] transition-colors duration-300 group-hover:text-[#FF6B1A]">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-slate-600">
            {description}
          </p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} aria-label={title} className={cardClasses}>
        {body}
      </a>
    );
  }

  return <article className={cardClasses}>{body}</article>;
}