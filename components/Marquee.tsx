export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="border-b border-ink bg-surface py-3 text-on-surface">
      <ul className="mx-auto flex max-w-[1440px] flex-wrap gap-x-6 gap-y-2 px-5 md:px-8">
        {items.map((item) => (
          <li key={item} className="label-lg flex items-center gap-2.5 whitespace-nowrap">
            <span aria-hidden className="text-violet-soft">
              ✦
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
