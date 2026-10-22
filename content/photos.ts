import type { Lang } from "@/lib/i18n";

export type Photo = {
  slug: string;
  src: string;
  href: string;
  date: string;
  copy: Record<Lang, { alt: string; caption: string }>;
};

export const photos: Photo[] = [
  {
    slug: "last-light",
    src: "/photos/erru-01.jpg",
    href: "https://www.instagram.com/p/DTtD9kFiN5W/",
    date: "2026.01",
    copy: {
      en: {
        alt: "A cat sitting on a concrete wall at sunset, backlit by the last light",
        caption: "Last light",
      },
      it: {
        alt: "Un gatto seduto su un muro di cemento al tramonto, in controluce nell’ultima luce",
        caption: "Ultima luce",
      },
    },
  },
  {
    slug: "stone-and-sky",
    src: "/photos/erru-02.jpg",
    href: "https://www.instagram.com/p/DS5GNZRiKaB/",
    date: "2025.12",
    copy: {
      en: {
        alt: "The rose window of a stone church against a deep blue sky, framed by bare branches",
        caption: "Stone and sky",
      },
      it: {
        alt: "Il rosone di una chiesa in pietra contro un cielo blu profondo, incorniciato da rami spogli",
        caption: "Pietra e cielo",
      },
    },
  },
];
