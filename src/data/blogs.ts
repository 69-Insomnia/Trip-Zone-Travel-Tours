import { photo } from "./photos";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  location: string;
  image: string;
  publishedAt: string;
  readTime: string;
  introduction: string;
  sections: BlogSection[];
};

export const blogs: BlogPost[] = [
  {
    slug: "manang-road-trip-guide",
    title: "Manang Road Trip Guide: Route, Altitude and What to Expect",
    excerpt:
      "A practical guide to the drive into Manang, including road conditions, altitude, key stops and packing advice.",
    category: "Mountain journeys",
    location: "Manang",
    image: photo("manangRoad").src,
    publishedAt: "August 24, 2026",
    readTime: "7 min read",
    introduction:
      "Manang is not simply a destination. The road itself is the experience, following the Marsyangdi River from green middle hills into a wide Himalayan valley shaped by cliffs, glaciers and Tibetan-influenced villages.",
    sections: [
      {
        heading: "Why travel to Manang by road?",
        paragraphs: [
          "The overland route reveals Nepal's changing geography one valley at a time. Waterfalls, suspension bridges, apple farms and high mountain walls make the journey feel dramatically different from a quick flight.",
          "A road trip also gives your body more time to adjust to altitude, although every traveller should still take acclimatisation seriously.",
        ],
      },
      {
        heading: "Best time to visit",
        paragraphs: [
          "March to May and late September to November usually offer the clearest views and most comfortable conditions. Spring brings warmer days, while autumn is known for crisp skies.",
          "The monsoon can make sections of the road difficult, and winter snow may affect access beyond the lower valley.",
        ],
      },
      {
        heading: "Key stops on the route",
        paragraphs: [
          "A well-paced itinerary makes room for the places between Kathmandu and Manang.",
        ],
        bullets: [
          "Dharapani for the first overnight stop",
          "Bhratang for apple products and mountain scenery",
          "Braga Monastery for history and valley views",
          "Gangapurna Lake near Manang village",
          "Bandipur as a relaxed stop on the return journey",
        ],
      },
      {
        heading: "Altitude and packing advice",
        paragraphs: [
          "Manang village sits above 3,500 metres. Drink water regularly, avoid rushing, and tell your guide or driver immediately if you develop a persistent headache, nausea or unusual fatigue.",
        ],
        bullets: [
          "Warm layers and a windproof outer jacket",
          "Sun protection, sunglasses and lip balm",
          "Personal medication and a small first-aid kit",
          "Power bank and offline maps",
          "Comfortable shoes with reliable grip",
        ],
      },
    ],
  },
  {
    slug: "muktinath-pilgrimage-travel-guide",
    title: "Muktinath Pilgrimage Guide: Temples, Roads and Travel Tips",
    excerpt:
      "Plan a respectful and comfortable Muktinath journey through Pokhara, Jomsom, Kagbeni and the Kali Gandaki valley.",
    category: "Pilgrimage",
    location: "Mustang",
    image: photo("muktinath").src,
    publishedAt: "August 18, 2026",
    readTime: "6 min read",
    introduction:
      "Muktinath is sacred to both Hindus and Buddhists. Set beneath the Thorong La mountain pass, the temple complex combines spiritual importance with the extraordinary high-desert landscape of Mustang.",
    sections: [
      {
        heading: "Understanding the journey",
        paragraphs: [
          "Most road itineraries travel from Kathmandu to Pokhara or Beni before continuing through the Kali Gandaki corridor. The route is long, so a multi-day plan is more comfortable than trying to rush the darshan.",
        ],
      },
      {
        heading: "When to go",
        paragraphs: [
          "March to May and September to November are generally the most dependable seasons. Mustang lies in a rain shadow, but road conditions lower in the valley can still be affected during the monsoon.",
          "Early mornings can be cold throughout the year, particularly at the temple elevation of approximately 3,800 metres.",
        ],
      },
      {
        heading: "Places worth including",
        paragraphs: [
          "The pilgrimage is richer when the itinerary includes nearby cultural and natural sites.",
        ],
        bullets: [
          "Kagbeni at the meeting point of the Kali Gandaki and Jhong rivers",
          "Jomsom for an overnight stop and mountain views",
          "Marpha for stone lanes and apple orchards",
          "Rupse Waterfall and Tatopani on the lower route",
          "Pokhara temples and viewpoints on the return",
        ],
      },
      {
        heading: "Respectful travel tips",
        paragraphs: [
          "Dress modestly inside religious areas, follow local instructions and allow elderly pilgrims enough time at steps and bathing areas. Carry cash for small purchases because digital payments can be unreliable in remote sections.",
        ],
      },
    ],
  },
  {
    slug: "kalinchowk-sailung-weekend-guide",
    title: "Kalinchowk and Sailung: A Two-Day Escape from Kathmandu",
    excerpt:
      "How to combine Sailung's rolling hills with Kalinchowk's ridge-top temple in one scenic weekend.",
    category: "Short escapes",
    location: "Dolakha and Ramechhap",
    image: photo("kalinchowk").src,
    publishedAt: "August 10, 2026",
    readTime: "5 min read",
    introduction:
      "Sailung and Kalinchowk offer two very different mountain experiences within reach of Kathmandu: open grassland hills at Sailung and a lively pilgrimage ridge above Kuri village at Kalinchowk.",
    sections: [
      {
        heading: "Why combine both destinations?",
        paragraphs: [
          "Sailung is spacious and quiet, with rounded hilltops that catch the first light. Kalinchowk adds village energy, a temple visit and a broad Himalayan panorama. Together they make a varied short trip.",
        ],
      },
      {
        heading: "A practical two-day plan",
        paragraphs: [
          "Leave Kathmandu early, visit Sailung and continue to Kuri village for dinner and an overnight stay. The following morning, travel or walk to Kalinchowk Bhagwati Temple before returning through Dolakha and Sukute.",
        ],
      },
      {
        heading: "Seasonal conditions",
        paragraphs: [
          "October to December often brings clear mountain views. Winter visitors may see snow around Kalinchowk, but should expect colder roads and changing vehicle access. Spring is greener and generally more comfortable for walking.",
        ],
      },
      {
        heading: "What to carry",
        paragraphs: ["Pack lightly, but prepare for fast weather changes on exposed ridges."],
        bullets: [
          "Warm jacket, gloves and cap in winter",
          "Walking shoes and a small day bag",
          "Water and personal snacks",
          "Sun protection",
          "Cash for local meals and temple offerings",
        ],
      },
    ],
  },
];

export function getBlog(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}
