import Image from "next/image";
import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";

export function Portrait({ lang }: { lang: Lang }) {
  const t = copy[lang].about.portrait;

  return (
    <figure className="m-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-ink bg-surface">
        <Image
          src="/portrait.jpg"
          alt={t.alt}
          fill
          sizes="(min-width: 768px) 440px, 100vw"
          className="object-cover object-center"
        />

        <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-on-surface/60" />
        <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-on-surface/60" />
        <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-on-surface/60" />
        <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-on-surface/60" />
      </div>

      <figcaption className="label mt-2 flex items-center justify-between text-concrete">
        <span>{t.label}</span>
        <span>{t.sub}</span>
      </figcaption>
    </figure>
  );
}
