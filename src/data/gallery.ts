/**
 * Gallery images.
 *
 * This is the seed snapshot — the live gallery reads `gallery_items` from the
 * database, and falls back to this list if the database cannot be reached.
 */

export type GalleryItem = {
  title: string;
  place: string;
  category: string;
  image: string;
  imageAlt?: string;
  credit?: string;
  creditUrl?: string;
  /** Optional Tailwind span classes for the masonry layout. */
  size?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    title: "Above the tree line",
    place: "Manang Valley",
    category: "Mountain",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=88",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Desert light",
    place: "Mustang",
    category: "Landscape",
    image:
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Morning over the hills",
    place: "Sailung",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "The long road north",
    place: "Annapurna region",
    category: "Road trip",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Snowline shrine",
    place: "Kalinchowk",
    category: "Pilgrimage",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Blue hour in the valley",
    place: "Pokhara",
    category: "Slow travel",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Sacred mountain air",
    place: "Muktinath",
    category: "Pilgrimage",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "A city of courtyards",
    place: "Kathmandu",
    category: "Culture",
    image:
      "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1600&q=88",
  },
];
