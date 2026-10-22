export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee overflow-hidden border-b border-ink bg-surface py-3 text-on-surface" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={`${copyIndex}-${item}`} className="label-lg flex items-center whitespace-nowrap">
                <span className="px-5 md:px-6">{item}</span>
                <span className="text-violet-soft">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
