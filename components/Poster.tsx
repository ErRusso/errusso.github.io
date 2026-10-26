import type { CSSProperties } from "react";
import { copy } from "@/content/copy";
import type { Project } from "@/content/projects";
import type { Lang } from "@/lib/i18n";

const BAR_HEIGHTS = [
  34, 58, 46, 72, 40, 88, 52, 64, 30, 78, 44, 92, 38, 60, 48, 84, 36, 70, 54, 96, 42, 66, 32, 80, 50,
  74, 40, 90, 46, 62, 34, 86, 56, 68, 38, 82, 48, 76, 44, 94, 36, 64, 52, 72,
];

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

function WaveArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 448 300" preserveAspectRatio="none" className="h-full w-full">
      <line x1="0" y1="150" x2="448" y2="150" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      {BAR_HEIGHTS.map((height, index) => (
        <rect
          key={`${id}-${index}`}
          className="poster-wave-bar"
          style={stagger(index)}
          x={6 + index * 10}
          y={150 - height / 2}
          width="4"
          height={height}
          fill={index % 9 === 4 ? "var(--color-violet-soft)" : "var(--color-violet)"}
        />
      ))}
    </svg>
  );
}

function ZigArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 448 300" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <pattern id={`diag-${id}`} width="18" height="18" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="18" stroke="var(--color-violet)" strokeOpacity="0.35" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="448" height="300" fill={`url(#diag-${id})`} />
      <path d="M-10 232 L100 122 L210 232 L320 122 L458 232" fill="none" stroke="var(--color-violet)" strokeWidth="3" />
      <path
        className="poster-zig-pulse"
        d="M-10 232 L100 122 L210 232 L320 122 L458 232"
        fill="none"
        stroke="var(--color-violet-soft)"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <path d="M-10 276 L100 166 L210 276 L320 166 L458 276" fill="none" stroke="var(--color-on-surface)" strokeOpacity="0.28" strokeWidth="1" />
      <path d="M-10 188 L100 78 L210 188 L320 78 L458 188" fill="none" stroke="var(--color-on-surface)" strokeOpacity="0.14" strokeWidth="1" />
    </svg>
  );
}

function WindowArt() {
  return (
    <svg viewBox="0 0 448 300" preserveAspectRatio="none" className="h-full w-full">
      <rect x="48" y="28" width="352" height="184" fill="var(--color-paper)" stroke="var(--color-ink)" />
      <rect x="48" y="28" width="352" height="24" fill="var(--color-ink)" />
      <rect x="60" y="37" width="7" height="7" fill="var(--color-paper)" />
      <rect x="72" y="37" width="7" height="7" fill="var(--color-paper)" opacity="0.6" />
      <rect x="84" y="37" width="7" height="7" fill="var(--color-paper)" opacity="0.3" />
      <g className="poster-wire" style={stagger(0)}>
        <rect x="68" y="72" width="150" height="16" fill="var(--color-violet)" />
      </g>
      <g className="poster-wire" style={stagger(1)}>
        <rect x="68" y="98" width="240" height="6" fill="var(--color-ink)" opacity="0.35" />
      </g>
      <g className="poster-wire" style={stagger(2)}>
        <rect x="68" y="111" width="196" height="6" fill="var(--color-ink)" opacity="0.2" />
      </g>
      <g className="poster-wire" style={stagger(3)}>
        <rect x="68" y="136" width="90" height="46" fill="var(--color-ink)" opacity="0.08" stroke="var(--color-ink)" />
      </g>
      <g className="poster-wire" style={stagger(4)}>
        <rect x="170" y="136" width="90" height="46" fill="var(--color-violet)" opacity="0.16" stroke="var(--color-ink)" />
      </g>
      <g className="poster-wire" style={stagger(5)}>
        <rect x="272" y="136" width="90" height="46" fill="var(--color-ink)" opacity="0.08" stroke="var(--color-ink)" />
      </g>
      <g className="poster-wire" style={stagger(6)}>
        <rect x="68" y="192" width="58" height="10" fill="var(--color-violet)" opacity="0.9" />
      </g>
    </svg>
  );
}

export function Poster({
  project,
  lang,
  size = "card",
}: {
  project: Project;
  lang: Lang;
  size?: "card" | "hero";
}) {
  const isDark = project.cover !== "window";
  const isHero = size === "hero";
  const aspect = isHero ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/3]";

  return (
    <div className={`poster relative ${aspect} w-full overflow-hidden border border-ink ${isDark ? "bg-surface" : "bg-paper-dim"}`}>
      <div aria-hidden className="absolute inset-0">
        {project.cover === "wave" && <WaveArt id={project.slug} />}
        {project.cover === "zig" && <ZigArt id={project.slug} />}
        {project.cover === "window" && <WindowArt />}
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 md:p-5 ${
          isDark ? "text-on-surface" : "text-ink"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`label ${isDark ? "text-on-surface/60" : "text-ink/60"}`}>{project.kicker[lang]}</span>
          <span className={`label ${isDark ? "text-on-surface/60" : "text-ink/60"}`}>{project.year}</span>
        </div>

        {isHero ? (
          <span className={`label ${isDark ? "text-on-surface/60" : "text-ink/60"}`}>
            {project.stack.slice(0, 3).join(" · ")}
          </span>
        ) : (
          <span className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] font-black uppercase leading-[0.88] tracking-[-0.035em]">
            {project.name[lang]}
            <span aria-hidden className="cursor-block text-violet-soft">▮</span>
          </span>
        )}
      </div>
    </div>
  );
}
