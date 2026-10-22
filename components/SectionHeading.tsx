export function SectionHeading({
  number,
  title,
  intro,
}: {
  number: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="border-b border-ink px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-[96px_minmax(0,1fr)] md:gap-8">
        <span className="label-lg text-violet md:pt-2">{number}</span>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-end md:gap-10">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.8rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">
            {title}
          </h2>
          <p className="max-w-[46ch] text-base leading-relaxed text-ink/75 md:pb-1">{intro}</p>
        </div>
      </div>
    </div>
  );
}
