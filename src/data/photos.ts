/**
 * Central photo registry.
 *
 * Every photograph on the site is declared here once and referenced by key, so
 * a picture can be swapped in a single place. Each entry is a real photograph
 * of the place it is used for — no generic stock scenery.
 *
 * Files live in `public/photos/` and are served from our own origin. They come
 * from Wikimedia Commons under CC BY / CC BY-SA licences; the required
 * attribution is in `public/photos/CREDITS.md` and is surfaced on the gallery
 * page. Keep both in sync when changing a photo.
 */

export type Photo = {
  /** Served path under `public/`. */
  src: string;
  /** Descriptive alt text — what the photo actually shows. */
  alt: string;
  /** `object-position` when the subject is not centred. */
  position?: string;
};

const photos = {
  /** Annapurna range panorama — used for the widest hero crops. */
  annapurnaPanorama: {
    src: "/photos/hero-annapurna.jpg",
    alt: "Panorama of the Annapurna range at sunrise from Poon Hill, Nepal",
    position: "center 55%",
  },
  manang: {
    src: "/photos/manang.jpg",
    alt: "Manang valley with Annapurna III and Gangapurna glacier above the village",
  },
  manangRoad: {
    src: "/photos/manang-road.jpg",
    alt: "Mountain road climbing the Marsyangdi valley on the way to Manang",
  },
  muktinath: {
    src: "/photos/muktinath.jpg",
    alt: "Muktinath Temple courtyard in Mustang, Nepal",
  },
  mustang: {
    src: "/photos/mustang.jpg",
    alt: "Arid high-desert cliffs and ochre rock formations of Upper Mustang",
  },
  kagbeni: {
    src: "/photos/kagbeni.jpg",
    alt: "Kagbeni village in the Kali Gandaki valley, Mustang",
  },
  kalinchowk: {
    src: "/photos/kalinchowk.jpg",
    alt: "Kalinchowk Bhagwati Temple on the ridge above Kuri village, Dolakha",
  },
  kuriVillage: {
    src: "/photos/kuri-village.jpg",
    alt: "Blue-roofed lodges of Kuri village below the Kalinchowk ridge",
  },
  sailung: {
    src: "/photos/sailung.jpg",
    alt: "Rolling grassland hillocks of Sailung in Ramechhap",
  },
  sailungHills: {
    src: "/photos/sailung-hills.jpg",
    alt: "Open ridgeline trail across the hundred hills of Sailung",
  },
  halesi: {
    src: "/photos/halesi.jpg",
    alt: "Halesi Mahadev temple complex in the hills of Khotang",
  },
  halesiCave: {
    src: "/photos/halesi-cave.jpg",
    alt: "Interior of the sacred limestone cave at Halesi Mahadev",
  },
  pathivara: {
    src: "/photos/pathivara.jpg",
    alt: "Pathibhara Devi Temple on the ridge in Taplejung, eastern Nepal",
  },
  pokhara: {
    src: "/photos/pokhara.jpg",
    alt: "Phewa Lake at Pokhara with the hills of the Annapurna foothills behind",
  },
  bandipur: {
    src: "/photos/bandipur.jpg",
    alt: "Hilltop Newari bazaar street in Bandipur, Tanahun",
  },
  kathmandu: {
    src: "/photos/kathmandu.jpg",
    alt: "Shiva Parvati Temple at Kathmandu Durbar Square",
  },
  boudhanath: {
    src: "/photos/boudhanath.jpg",
    alt: "Boudhanath Stupa in Kathmandu with prayer flags",
  },
  charDham: {
    src: "/photos/char-dham.jpg",
    alt: "Kedarnath Temple beneath the Himalayan peaks in Uttarakhand, India",
  },
  amaYangri: {
    src: "/photos/ama-yangri.jpg",
    alt: "Mountain landscape on the Ama Yangri trail in Helambu, Nepal",
  },
  gosaikunda: {
    src: "/photos/gosaikunda.jpg",
    alt: "Gosaikunda Lake surrounded by snowy Himalayan ridges in Langtang, Nepal",
  },
  dhorpatan: {
    src: "/photos/dhorpatan.jpg",
    alt: "Dhorpatan Hunting Reserve valley in the morning light, Nepal",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Every registered photo, keyed — the source for seeding the `photos` table. */
export const allPhotos: Record<PhotoKey, Photo> = photos;

/** Look up a registered photo. Keys are checked at compile time. */
export function photo(key: PhotoKey): Photo {
  return photos[key];
}

/** Attribution shown on the gallery page; full detail in public/photos/CREDITS.md. */
export const photoCredit =
  "Photographs of these destinations are used under CC BY / CC BY-SA licences from Wikimedia Commons.";
