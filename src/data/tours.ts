import { photo } from "./photos";

/** Each destination uses a photograph of that actual place — see src/data/photos.ts. */
const manangImg = photo("manang").src;
const muktinathImg = photo("muktinath").src;
const mustangImg = photo("mustang").src;
const kalinchowkImg = photo("kalinchowk").src;
const sailungImg = photo("sailung").src;
const halesiImg = photo("halesi").src;
const pathivaraImg = photo("pathivara").src;
const pokharaImg = photo("pokhara").src;
const bandipurImg = photo("bandipur").src;
const kathmanduImg = photo("kathmandu").src;
const charDhamImg = photo("charDham").src;
const amaYangriImg = photo("amaYangri").src;
const gosaikundaImg = photo("gosaikunda").src;
const dhorpatanImg = photo("dhorpatan").src;

export type PriceOption = {
  /** Vehicle / transport option exactly as quoted by Trip Zone. */
  transport: string;
  /** Price in NPR, per person. */
  price: number;
  /** Group size or occupancy note, when the quote specifies one. */
  note?: string;
};

export type ItineraryDay = {
  day: number;
  route: string;
};

export type Tour = {
  slug: string;
  name: string;
  region: string;
  duration: string;
  nights: number;
  days: number;
  type: "Pilgrimage" | "Mountain" | "Nature";
  summary: string;
  overview: string;
  image: string;
  prices: PriceOption[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  travelNotes?: string[];
};

export const tours: Tour[] = [
  {
    slug: "manang",
    name: "Manang Tour",
    region: "Manang, Gandaki",
    duration: "3 Nights / 4 Days",
    nights: 3,
    days: 4,
    type: "Mountain",
    summary:
      "A high Himalayan drive into Manang valley — glacial lakes, apple orchards, monasteries and Gurung and Tibetan village life.",
    overview:
      "Manang is one of Nepal's most striking high-altitude valleys, reached by a spectacular drive along the Marsyangdi river. Over four days you travel from Kathmandu to Dharapani, up into Manang valley for its glacial lakes and monasteries, and return through the hilltop town of Bandipur.",
    image: manangImg,
    prices: [
      { transport: "Scorpio", price: 17500, note: "For 7–8 people" },
      { transport: "Scorpio", price: 19500, note: "Single / couple" },
    ],
    highlights: [
      "Manang Valley",
      "Gangapurna Lake",
      "Green Lake",
      "Blue Lake",
      "Braga Monastery",
      "Bhratang Apple Farm",
      "Gurung and Tibetan culture",
      "Octopus Waterfall",
      "Bandipur views",
    ],
    itinerary: [
      { day: 1, route: "Kathmandu → Dharapani" },
      { day: 2, route: "Dharapani → Manang Valley" },
      { day: 3, route: "Manang → Bandipur" },
      { day: 4, route: "Bandipur → Kathmandu" },
    ],
    included: [
      "Scorpio Jeep transportation",
      "Breakfast (3)",
      "Lunch (4)",
      "Dinner (3)",
      "Hotel accommodation",
      "Professional driver (guide)",
    ],
    excluded: [
      "Mineral water, BBQ and drinks",
      "Extra meals or vehicle cost",
      "Entrance fees, TAX and VAT",
      "Natural delay or strikes cost",
    ],
  },
  {
    slug: "muktinath",
    name: "Muktinath Tour",
    region: "Mustang, Gandaki",
    duration: "3 Nights / 4 Days",
    nights: 3,
    days: 4,
    type: "Pilgrimage",
    summary:
      "A journey to the sacred temple of Muktinath through the Kali Gandaki valley and the high desert landscapes of Mustang.",
    overview:
      "Muktinath is among the most revered pilgrimage destinations for both Hindus and Buddhists. The route travels through Pokhara and the deep Kali Gandaki gorge into Mustang's arid high-desert landscape, with a choice of Jeep or EV Van transport.",
    image: muktinathImg,
    prices: [
      { transport: "Jeep", price: 12500 },
      { transport: "EV Van", price: 10500 },
    ],
    highlights: ["Muktinath Temple", "Mustang landscapes", "Kali Gandaki valley", "Pokhara"],
    itinerary: [
      { day: 1, route: "Kathmandu -> Kuirintar -> Kusma -> Beni" },
      {
        day: 2,
        route:
          "Beni -> Muktinath Darshan -> Kagbeni -> Dhumba Lake -> Jomsom -> Jerry Galli -> Marpha",
      },
      {
        day: 3,
        route:
          "Marpha -> Lete -> Rupse Jharna -> Tatopani -> Galeswor Mahadev -> Baglung Kalika Darshan -> Jholunge Pul -> Pokhara",
      },
      {
        day: 4,
        route:
          "Pokhara -> Tal Barahi Temple -> Shanti Stupa -> Pundikot Shiva Temple -> Devi's Fall -> Bindabasini Temple -> Mahendra Gupha -> Gupteshwor Mandir -> Kathmandu",
      },
    ],
    included: [
      "4 lunches",
      "3 dinners",
      "3 breakfasts",
      "Room accommodation (sharing basis)",
      "Transportation",
      "Sightseeing",
    ],
    excluded: [
      "Snacks and cuisines",
      "Beverages (beer and mineral water)",
      "Personal expenses",
      "Travel insurance",
      "Overstay due to natural calamities or strikes",
    ],
  },
  {
    slug: "pathivara",
    name: "Pathivara Tour",
    region: "Taplejung, Koshi",
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    type: "Pilgrimage",
    summary:
      "A five-day pilgrimage to the hilltop shrine of Pathivara Devi in eastern Nepal, through tea gardens and forested ridges.",
    overview:
      "Pathivara Devi temple sits high on a ridge in Taplejung, eastern Nepal, often above the clouds. This five-day journey covers the long drive east and the ascent to the shrine, with Car/Jeep or Bus/EV Van options.",
    image: pathivaraImg,
    prices: [
      { transport: "Car / Jeep", price: 16500 },
      { transport: "Bus / EV Van", price: 13500 },
    ],
    highlights: ["Pathivara Devi Temple", "Taplejung hills", "Eastern Nepal landscapes"],
    itinerary: [
      { day: 1, route: "Kathmandu -> Fikkal / Kanyam" },
      { day: 2, route: "Fikkal / Kanyam -> Thulophedi" },
      { day: 3, route: "Thulophedi -> Pathivara Darshan -> Tammor Koridor -> Vedetar -> Dharan" },
      {
        day: 4,
        route:
          "Dharan -> Budhasubba -> Dantakali Darshan -> Chatara Baraha Chhetra Dham -> Sindhuli -> Kathmandu",
      },
    ],
    included: [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Room accommodation (sharing basis)",
      "Transportation by Car, Jeep, Bus or EV Van",
    ],
    excluded: [
      "Snacks and beverages",
      "Personal expenses",
      "Travel insurance",
      "Extra costs due to natural calamities or strikes",
    ],
  },
  {
    slug: "halesi-mahadev",
    name: "Halesi Mahadev Darshan",
    region: "Khotang, Koshi",
    duration: "1 Night / 2 Days",
    nights: 1,
    days: 2,
    type: "Pilgrimage",
    summary:
      "A short pilgrimage to the sacred limestone caves of Halesi Mahadev, revered by Hindus and Buddhists alike.",
    overview:
      "Halesi Mahadev in Khotang is one of eastern Nepal's most important cave temples. This compact two-day darshan covers the drive from Kathmandu, the cave complex and the return, with Scorpio or Car transport.",
    image: halesiImg,
    prices: [
      { transport: "Scorpio", price: 6500 },
      { transport: "Car", price: 7000 },
    ],
    highlights: ["Halesi Mahadev caves", "Khotang hill scenery", "Cave darshan"],
    itinerary: [
      { day: 1, route: "Kathmandu -> Halesi" },
      { day: 2, route: "Halesi -> Kathmandu" },
    ],
    included: [
      "Lunch",
      "Dinner",
      "Breakfast",
      "Hotel room accommodation",
      "Transportation",
      "Sightseeing",
    ],
    excluded: [],
  },
  {
    slug: "sailung-kalinchowk",
    name: "Sailung & Kalinchowk",
    region: "Dolakha & Ramechhap",
    duration: "1 Night / 2 Days",
    nights: 1,
    days: 2,
    type: "Nature",
    summary:
      "Sunrise over the hundred hills of Sailung and the snow-dusted ridge of Kalinchowk in one short, scenic weekend.",
    overview:
      "A two-day escape from Kathmandu pairing Sailung's rolling grassland hillocks with the Kalinchowk Bhagwati ridge and its wide Himalayan panorama. Choose Bus, EV or Jeep transport.",
    image: kalinchowkImg,
    prices: [
      { transport: "Bus", price: 3500 },
      { transport: "EV", price: 4500 },
      { transport: "Jeep", price: 5500 },
    ],
    highlights: [
      "Sailung hundred hills",
      "Sunrise viewpoint",
      "Kalinchowk Bhagwati Temple",
      "Himalayan panorama",
    ],
    itinerary: [
      { day: 1, route: "Kathmandu -> Sailung -> Thumka -> Kuri Village" },
      { day: 2, route: "Kalinchowk -> Dolakha Bhimsen -> Sukute Beach -> Kathmandu" },
    ],
    included: [
      "Hotel accommodation at Kuri Village",
      "Dinner and overnight stay",
      "Breakfast",
      "Lunch",
      "Transportation",
      "Sightseeing",
    ],
    excluded: [],
  },
  {
    slug: "char-dham-pilgrimage-2026",
    name: "Char Dham Pilgrimage Tour 2026",
    region: "Uttarakhand, India & Nepal",
    duration: "14 Nights / 15 Days",
    nights: 14,
    days: 15,
    type: "Pilgrimage",
    summary:
      "A 15-day pilgrimage from Nepal through Haridwar and the four sacred Himalayan dhams of Yamunotri, Gangotri, Kedarnath and Badrinath.",
    overview:
      "This overland pilgrimage begins in Nepal and crosses into India for the Char Dham circuit in Uttarakhand. The journey includes Haridwar and Rishikesh, temple darshan at Yamunotri, Gangotri, Kedarnath and Badrinath, and a final holy bath at Devghat before returning home.",
    image: charDhamImg,
    prices: [{ transport: "Tourist Bus", price: 35000 }],
    highlights: [
      "Lumbini - birthplace of Lord Buddha",
      "Mahakali border crossing into India",
      "Haridwar - Har Ki Pauri, Kankhal, Mansa Devi, Chandi Devi and Ganga Aarti",
      "Rishikesh - Ram Jhula and Janaki Jhula",
      "Yamunotri - holy dip via Janaki Chatti",
      "Uttarkashi - spiritual river town",
      "Gangotri - origin of the River Ganga",
      "Guptkashi - gateway to Kedarnath",
      "Kedarnath - 18 km trek and evening Aarti",
      "Badrinath - sacred temple of Lord Vishnu",
      "Devghat - holy confluence in Nepal",
    ],
    itinerary: [
      { day: 1, route: "Depart from Kathmandu to Lumbini - approximately 12 hours" },
      { day: 2, route: "Lumbini to Mahendranagar - approximately 8 hours" },
      { day: 3, route: "Mahendranagar to Haridwar - approximately 8 hours" },
      { day: 4, route: "Full-day Haridwar sightseeing and evening Ganga Aarti" },
      { day: 5, route: "Haridwar to Barkot - approximately 8 hours" },
      {
        day: 6,
        route: "Barkot to Janaki Chatti, 5 km trek to Yamunotri, then return to Barkot",
      },
      {
        day: 7,
        route: "Barkot to Gangotri via Uttarkashi, overnight in Dharali - approximately 8 hours",
      },
      { day: 8, route: "Dharali to Sitapur - approximately 12 hours" },
      { day: 9, route: "18 km trek to Kedarnath and evening Aarti" },
      { day: 10, route: "Kedarnath darshan and return to Sitapur" },
      { day: 11, route: "Sitapur to Badrinath - approximately 8 hours" },
      { day: 12, route: "Badrinath darshan and departure for Ranikhet - approximately 8 hours" },
      { day: 13, route: "Ranikhet to Chisapani and Nepal entry - approximately 12 hours" },
      { day: 14, route: "Chisapani to Devghat - approximately 12 hours" },
      { day: 15, route: "Holy bath in Devghat and return home" },
    ],
    included: [
      "Pure vegetarian meals in the morning and evening",
      "Tourist-standard bus for the entire journey",
      "Hotel accommodation for overnight stays",
      "Drinking water supply",
      "First-aid and medical support",
      "Travel insurance",
      "Professional tour guide",
      "Dedicated photographer",
    ],
    excluded: [],
    travelNotes: [
      "Departure points: Kathmandu, Morang, Sunsari and Jhapa.",
      "Booking email: chamlingsubash55@gmail.com",
      "Confirm the 2026 departure date and seat availability before booking.",
    ],
  },
  {
    slug: "ama-yangri-trek",
    name: "Aama Yangri Trek",
    region: "Helambu, Sindhupalchok",
    duration: "1 Night / 2 Days",
    nights: 1,
    days: 2,
    type: "Mountain",
    summary:
      "A compact Helambu trek from Kathmandu to Aama Yangri Peak, with village scenery, ridge walking and wide Himalayan views.",
    overview:
      "This short trekking package travels from Kathmandu to Tarkeghyang or Chyoumonthang, then climbs to Aama Yangri Peak before returning to Kathmandu. Bus and Jeep options make it suitable for a weekend group departure.",
    image: amaYangriImg,
    prices: [
      { transport: "Bus", price: 4500 },
      { transport: "Scorpio / Jeep", price: 6000 },
    ],
    highlights: [
      "Aama Yangri Peak",
      "Helambu village landscapes",
      "Himalayan ridge views",
      "Short two-day trekking itinerary",
    ],
    itinerary: [
      { day: 1, route: "Kathmandu to Tarkeghyang / Chyoumonthang" },
      {
        day: 2,
        route: "Hike to Aama Yangri Peak, return to Tarkeghyang, then drive back to Kathmandu",
      },
    ],
    included: [
      "Lunch",
      "Breakfast",
      "Dinner",
      "Transportation by Scorpio or Jeep",
      "Room accommodation",
      "Guide team",
    ],
    excluded: [],
    travelNotes: [
      "Bring comfortable trekking or light clothing.",
      "Bring light trekking or sports shoes and a raincoat or umbrella.",
      "Pack warm clothes, thermals, a warm hat, muffler, gloves and thick trousers.",
      "Carry a cap, sunglasses, camera, torch and water bottle.",
      "Bring extra night clothes, your own towel, toothbrush and toothpaste.",
      "A hiking stick and dry food are optional.",
      "For groups of 25-30 people, departure and itinerary arrangements can be customized.",
    ],
  },
  {
    slug: "gosaikunda-trek",
    name: "Gosaikunda Trek",
    region: "Langtang, Rasuwa",
    duration: "3 Nights / 4 Days",
    nights: 3,
    days: 4,
    type: "Pilgrimage",
    summary:
      "A four-day spiritual trek to sacred Gosaikunda Lake through alpine forests, Sing Gompa and high Himalayan scenery.",
    overview:
      "Designed for travelers with limited time, this package combines the sacred waters of Gosaikunda with forest trails, mountain views and the cultural atmosphere of Sing Gompa. Meals, accommodation and transportation are included.",
    image: gosaikundaImg,
    prices: [{ transport: "Tour Package", price: 12500 }],
    highlights: [
      "Sacred Gosaikunda Lake",
      "Stunning Himalayan views",
      "Sing Gompa Monastery",
      "Traditional yak cheese tasting",
      "Alpine forests and fern trails",
      "Spiritual and cultural experience",
      "Ideal for time-constrained trekkers, spiritual seekers, nature lovers and photographers",
    ],
    itinerary: [
      { day: 1, route: "Kathmandu to Chandanbari - approximately 6-7 hours" },
      { day: 2, route: "Chandanbari to Gosaikunda Lake (4,380 m) - approximately 5-6 hours" },
      { day: 3, route: "Gosaikunda Lake to Chandanbari - approximately 5-6 hours" },
      { day: 4, route: "Chandanbari to Kathmandu - return journey" },
    ],
    included: ["Breakfast", "Lunch", "Dinner", "Hotel room accommodation", "Transportation"],
    excluded: [],
  },
  {
    slug: "dhorpatan-tour",
    name: "Dhorpatan Full Tour Package",
    region: "Dhorpatan, Baglung",
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    type: "Nature",
    summary:
      "A five-day road journey through Pokhara and Baglung to Dhorpatan Valley, its villages, reserve landscapes and Himalayan views.",
    overview:
      "Travel from Kathmandu through Pokhara and Baglung to explore the wide Dhorpatan Valley and the Dhorpatan Hunting Reserve area. The package includes meals, accommodation, local sightseeing and a tour coordinator throughout the journey.",
    image: dhorpatanImg,
    prices: [{ transport: "Tourist Bus / Jeep", price: 17500 }],
    highlights: [
      "Phewa Lake and Pokhara Lakeside",
      "Dhorpatan Valley",
      "Dhorpatan Hunting Reserve area",
      "Local village exploration",
      "Himalayan mountain views",
      "Campfire or local cultural experience",
    ],
    itinerary: [
      {
        day: 1,
        route:
          "Kathmandu to Pokhara: morning departure, lunch on the way, hotel check-in, Phewa Lake / Lakeside visit, dinner and overnight stay",
      },
      {
        day: 2,
        route:
          "Pokhara to Dhorpatan via Baglung: breakfast, scenic drive, lunch on the way, lodge check-in, evening exploration, dinner and overnight stay",
      },
      {
        day: 3,
        route:
          "Full-day Dhorpatan exploration: valley, reserve area, local villages, Himalayan views, picnic lunch, campfire or cultural experience, dinner and overnight stay",
      },
      {
        day: 4,
        route:
          "Dhorpatan to Baglung / Pokhara: breakfast, scenic return drive, lunch, hotel check-in, leisure time or Lakeside visit, dinner and overnight stay",
      },
      {
        day: 5,
        route: "Pokhara to Kathmandu: breakfast, departure, lunch on the way and tour conclusion",
      },
    ],
    included: [
      "Tourist bus or Jeep transportation",
      "Hotel and lodge accommodation",
      "Breakfast, lunch and dinner",
      "Dhorpatan local sightseeing",
      "Professional tour coordinator or guide",
      "Necessary travel arrangements",
      "Government taxes and service charges, where applicable",
    ],
    excluded: [
      "Personal expenses",
      "Shopping",
      "Beverages and alcoholic drinks",
      "Travel insurance",
      "Activities or services not mentioned in the package",
    ],
  },
];

export function getTour(slug: string) {
  return tours.find((t) => t.slug === slug);
}

export function startingPrice(tour: Tour) {
  return Math.min(...tour.prices.map((p) => p.price));
}

export function formatNpr(value: number) {
  return `NPR ${value.toLocaleString("en-US")}`;
}

export type Destination = {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Tour slug this destination is featured in, when applicable. */
  tour?: string;
};

export const destinations: Destination[] = [
  {
    slug: "manang",
    name: "Manang",
    description: "High Himalayan valley of glacial lakes, monasteries and apple orchards.",
    image: manangImg,
    tour: "manang",
  },
  {
    slug: "muktinath",
    name: "Muktinath",
    description: "Sacred temple in Mustang, revered by Hindu and Buddhist pilgrims.",
    image: muktinathImg,
    tour: "muktinath",
  },
  {
    slug: "mustang",
    name: "Mustang",
    description: "Nepal's high desert of ochre cliffs and Tibetan-influenced villages.",
    image: mustangImg,
    tour: "muktinath",
  },
  {
    slug: "kalinchowk",
    name: "Kalinchowk",
    description: "Snow-dusted ridge in Dolakha with a wide Himalayan skyline.",
    image: kalinchowkImg,
    tour: "sailung-kalinchowk",
  },
  {
    slug: "sailung",
    name: "Sailung",
    description: "Rolling grassland hillocks famous for sunrise above the clouds.",
    image: sailungImg,
    tour: "sailung-kalinchowk",
  },
  {
    slug: "halesi",
    name: "Halesi",
    description: "Sacred limestone cave temple in the hills of Khotang.",
    image: halesiImg,
    tour: "halesi-mahadev",
  },
  {
    slug: "pathivara",
    name: "Pathivara",
    description: "Hilltop shrine in Taplejung, often standing above a sea of cloud.",
    image: pathivaraImg,
    tour: "pathivara",
  },
  {
    slug: "pokhara",
    name: "Pokhara",
    description: "Lakeside city beneath the Annapurna range and Machhapuchhre.",
    image: pokharaImg,
  },
  {
    slug: "bandipur",
    name: "Bandipur",
    description: "Hilltop Newari town with a preserved bazaar and mountain views.",
    image: bandipurImg,
    tour: "manang",
  },
  {
    slug: "kathmandu",
    name: "Kathmandu",
    description: "Nepal's capital, where every Trip Zone journey begins and ends.",
    image: kathmanduImg,
  },
];

export const faqs = [
  {
    q: "How can I book a tour?",
    a: "Call or message us on 9861509342 or 9813844496, or send an inquiry through the contact form. We confirm your dates, transport option and group size, then share the booking details.",
  },
  {
    q: "Can I book through WhatsApp?",
    a: "Yes. WhatsApp is the fastest way to reach us. Tap any WhatsApp button on this site and your message opens with our team directly.",
  },
  {
    q: "What transportation options are available?",
    a: "Depending on the package we operate Jeep, Scorpio, Car, Bus and EV Van. Each package page lists the transport options available and their per-person price.",
  },
  {
    q: "Are meals included?",
    a: "Breakfast, lunch and dinner are included in our listed packages. Drinks and mineral water are not included.",
  },
  {
    q: "Is hotel accommodation included?",
    a: "Yes, hotel accommodation is included for the nights stated in the package duration.",
  },
  {
    q: "Can I book a private vehicle?",
    a: "Yes. Private vehicle arrangements are available for couples, families and groups. Per-person pricing varies with the vehicle and group size, as shown on each package.",
  },
  {
    q: "Can group tours be customized?",
    a: "Yes. Itineraries, departure dates and vehicle choices can be adjusted for groups, couples and families. Contact us with what you have in mind.",
  },
  {
    q: "What happens if there is a natural disaster or strike?",
    a: "Extra costs caused by natural calamities or strikes are not included in the package price. We will work with you to adjust the plan as safely as possible.",
  },
  {
    q: "What expenses are not included?",
    a: "Mineral water, drinks, personal expenses, entrance fees where applicable, travel insurance where specified, and any extra costs caused by natural calamities or strikes.",
  },
];

/**
 * Placeholder testimonials for development.
 * Replace these entries with real, permitted customer reviews.
 */
export const testimonials = [
  {
    name: "Sample Traveller",
    location: "Kathmandu",
    tour: "Manang Tour",
    quote:
      "Placeholder review text. Replace with a real customer review once collected — the layout supports two to four sentences comfortably.",
  },
  {
    name: "Sample Traveller",
    location: "Lalitpur",
    tour: "Muktinath Tour",
    quote:
      "Placeholder review text. This card is structured so actual reviews can be inserted without changing the design.",
  },
  {
    name: "Sample Traveller",
    location: "Bhaktapur",
    tour: "Sailung & Kalinchowk",
    quote:
      "Placeholder review text. Keep reviews specific about the route, vehicle and hospitality for the strongest effect.",
  },
];
