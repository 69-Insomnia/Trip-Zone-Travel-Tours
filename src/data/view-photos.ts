/**
 * A photograph of the actual place behind every entry in the "Places & mountain
 * views" grid.
 *
 * Generated — do not edit by hand. `npm run media:view-photos` searches
 * Wikimedia Commons for each viewpoint, keeps only freely licensed photographs,
 * downloads them into `public/photos/views/` and rewrites this file. The
 * attribution travels with the photograph because most of these are CC BY-SA:
 * the tour page prints `credit` and links it to `creditUrl`.
 */

export type ViewPhoto = {
  /** Path under `public/`, or a URL for a file uploaded in /admin. */
  image: string;
  alt: string;
  /** Photographer and licence, ready to print. */
  credit: string;
  /** The Wikimedia Commons page the photograph came from. */
  creditUrl: string;
};

/** Keyed by `viewPhotoKey(place, title)` from src/data/tour-views.ts. */
export const viewPhotos: Record<string, ViewPhoto> = {
  "aama-yangri-peak--summit-prayer-flags": {
    image: "/photos/views/amayangri-helambu-langtang-sunrise-20250503.jpg",
    alt: "Summit prayer flags at Aama Yangri Peak",
    credit: "\"Amayangri Helambu Langtang Sunrise 20250503\" by Pratapbaniya, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Amayangri_Helambu_Langtang_Sunrise_20250503.jpg",
  },
  "aama-yangri-trail--rhododendron-forest": {
    image: "/photos/views/himalayas-langtang.jpg",
    alt: "Rhododendron forest at Aama Yangri trail",
    credit: "\"Himalayas Langtang\" by Sergey Pesterev, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Himalayas_Langtang.jpg",
  },
  "aama-yangri-viewpoint--langtang-panorama": {
    image: "/photos/views/amayangri-helambu-langtang-1-20250503.jpg",
    alt: "Langtang panorama at Aama Yangri viewpoint",
    credit: "\"Amayangri Helambu Langtang 1 20250503\" by Pratapbaniya, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Amayangri_Helambu_Langtang_1_20250503.jpg",
  },
  "badrinath--alpine-temple-town": {
    image: "/photos/views/badrinath-temple-uttarakhand-india-2012-15.jpg",
    alt: "Alpine temple town at Badrinath",
    credit: "\"Badrinath Temple, Uttarakhand, India (2012) 15\" by Guptaele, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Badrinath_Temple,_Uttarakhand,_India_(2012)_15.jpg",
  },
  "baglung--baglung-terraces": {
    image: "/photos/views/baglung.jpg",
    alt: "Baglung terraces at Baglung",
    credit: "\"Baglung\" by The original uploader was Sudip khadka at English Wikipedia ., Public domain, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Baglung.jpg",
  },
  "bandipur--hilltop-sunset": {
    image: "/photos/views/bandipur-city.jpg",
    alt: "Hilltop sunset at Bandipur",
    credit: "\"Bandipur City\" by Rajiv Timalsina, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bandipur_City.JPG",
  },
  "bhratang--apple-orchards": {
    image: "/photos/views/bhratang-marsynagdi-bridge.jpg",
    alt: "Apple orchards at Bhratang",
    credit: "\"Bhratang Marsynagdi Bridge\" by Kondephy, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bhratang_Marsynagdi_Bridge.jpg",
  },
  "bohora-gaun--village-and-pasture": {
    image: "/photos/views/mt-dhaulagiri-and-baglung.jpg",
    alt: "Village and pasture at Bohora Gaun",
    credit: "\"Mt. Dhaulagiri and Baglung\" by Samrat Shrestha, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mt._Dhaulagiri_and_Baglung.jpg",
  },
  "braga--monastery-and-mountain-light": {
    image: "/photos/views/annapurna-massif-panorama.jpg",
    alt: "Monastery and mountain light at Braga",
    credit: "\"Annapurna Massif Panorama\" by Dmitry A. Mottl, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Annapurna_Massif_Panorama.jpg",
  },
  "budhasubba--sacred-grove": {
    image: "/photos/views/budhasubba-dharan2.jpg",
    alt: "Sacred grove at Budhasubba",
    credit: "\"Budhasubba Dharan2\" by Janak Bhatta, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Budhasubba_Dharan2.jpg",
  },
  "chandanbari--laurel-and-rhododendron": {
    image: "/photos/views/ganesh-mountain-range-seen-from-chandanbari-rasuwa-by-saroj-.jpg",
    alt: "Laurel and rhododendron at Chandanbari",
    credit: "\"Ganesh Mountain range seen from Chandanbari, Rasuwa. (By Saroj Pandey)\" by Saroj Pandey, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ganesh_Mountain_range_seen_from_Chandanbari,_Rasuwa._(By_Saroj_Pandey).jpg",
  },
  "chyoumonthang--village-rooftops": {
    image: "/photos/views/langtang-lirung.jpg",
    alt: "Village rooftops at Chyoumonthang",
    credit: "\"Langtang Lirung\" by John C Sill, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Langtang_Lirung.jpg",
  },
  "dantakali--temple-and-hill-country": {
    image: "/photos/views/dantakali-temple-of-dharan.jpg",
    alt: "Temple and hill country at Dantakali",
    credit: "\"Dantakali temple of dharan\" by Npboe, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dantakali_temple_of_dharan.jpg",
  },
  "devghat--holy-confluence": {
    image: "/photos/views/sangam-devghat.jpg",
    alt: "Holy confluence at Devghat",
    credit: "\"Sangam Devghat\" by Rajivkilanashrestha, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Sangam_Devghat.jpg",
  },
  "dharan--return-to-the-plains": {
    image: "/photos/views/dharan-bazaar.jpg",
    alt: "Return to the plains at Dharan",
    credit: "\"Dharan bazaar\" by Suryakedem555, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dharan_bazaar.jpg",
  },
  "dharapani--marsyangdi-valley-road": {
    image: "/photos/views/the-marsyangdi-river-at-dharapani-annapurna-circuit-nepal-pa.jpg",
    alt: "Marsyangdi valley road at Dharapani",
    credit: "\"The Marsyangdi river at Dharapani - Annapurna Circuit, Nepal - panoramio\" by Sergey Ashmarin, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:The_Marsyangdi_river_at_Dharapani_-_Annapurna_Circuit,_Nepal_-_panoramio.jpg",
  },
  "dhorpatan--high-valley-arrival": {
    image: "/photos/views/dhorpatan1.jpg",
    alt: "High valley arrival at Dhorpatan",
    credit: "\"Dhorpatan1\" by Lakshmanbasnet, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dhorpatan1.jpg",
  },
  "dhorpatan-hunting-reserve--reserve-landscape": {
    image: "/photos/views/dhorpatan-dhorpatan-hunting-reserve-before-sun-rise.jpg",
    alt: "Reserve landscape at Dhorpatan Hunting Reserve",
    credit: "\"Dhorpatan,Dhorpatan Hunting Reserve before Sun Rise\" by Ratish Jung Subedi, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dhorpatan,Dhorpatan_Hunting_Reserve_before_Sun_Rise.jpg",
  },
  "dhorpatan-meadow--morning-reserve-light": {
    image: "/photos/views/iss064-e-12604-view-of-nepal-dhaulagiri-himal-west-gurcha-hi.jpg",
    alt: "Morning reserve light at Dhorpatan meadow",
    credit: "\"ISS064-E-12604 - View of Nepal - Dhaulagiri Himal West - Gurcha Himal - Churen Himal - Putha Hiunchuli - Hiuchuli - Thuli Bheri (Thuibheri) Valley - Gumbatara mountains (cropped)\" by Earth Science and Remote Sensing Unit, NASA Johnson Space Center, Public domain, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:ISS064-E-12604_-_View_of_Nepal_-_Dhaulagiri_Himal_West_-_Gurcha_Himal_-_Churen_Himal_-_Putha_Hiunchuli_-_Hiuchuli_-_Thuli_Bheri_(Thuibheri)_Valley_-_Gumbatara_mountains_(cropped).jpg",
  },
  "dhorpatan-ridge--gurja-himal-view": {
    image: "/photos/views/gurja-himal.jpg",
    alt: "Gurja Himal view at Dhorpatan ridge",
    credit: "\"Gurja Himal\" by Stefan, CC BY 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gurja_Himal.jpg",
  },
  "dhorpatan-village--cultural-evening": {
    image: "/photos/views/green-morning-from-dhorpatan.jpg",
    alt: "Cultural evening at Dhorpatan village",
    credit: "\"Green morning from Dhorpatan\" by Chillionaire rohit, CC0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Green_morning_from_Dhorpatan.jpg",
  },
  "dhunche--forest-trail": {
    image: "/photos/views/highway-to-dhunche-rasuwa.jpg",
    alt: "Forest trail at Dhunche",
    credit: "\"Highway to Dhunche, Rasuwa\" by Kapilkhatri19, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Highway_to_Dhunche,_Rasuwa.JPG",
  },
  "diktel-road--terraced-hillside": {
    image: "/photos/views/diktel-bazaar-2018-05-12.jpg",
    alt: "Terraced hillside at Diktel road",
    credit: "\"Diktel bazaar 2018-05-12\" by Christopher J. Fynn, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Diktel_bazaar_2018-05-12.jpg",
  },
  "dolakha-bhimsen--historic-shrine-town": {
    image: "/photos/views/dolakha-bhimsen-temple.jpg",
    alt: "Historic shrine town at Dolakha Bhimsen",
    credit: "\"Dolakha bhimsen Temple\" by Krish Dulal, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dolakha_bhimsen_Temple.jpg",
  },
  "dudh-koshi-corridor--river-valley-crossing": {
    image: "/photos/views/dudhkosi2woodenbridge.jpg",
    alt: "River valley crossing at Dudh Koshi corridor",
    credit: "\"DudhKosi2WoodenBridge\" by Albert Backer, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:DudhKosi2WoodenBridge.jpg",
  },
  "fikkal--eastern-hill-road": {
    image: "/photos/views/radio-fikkal-3.jpg",
    alt: "Eastern hill road at Fikkal",
    credit: "\"RADIO FIKKAL (3)\" by Rejinarai, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:RADIO_FIKKAL_(3).JPG",
  },
  "gangapurna-lake--glacial-blue-water": {
    image: "/photos/views/gangapurna-glacier-and-lake.jpg",
    alt: "Glacial blue water at Gangapurna Lake",
    credit: "\"Gangapurna glacier and lake\" by Roman Yahodka, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gangapurna_glacier_and_lake.jpg",
  },
  "gangotri--origin-of-the-ganga": {
    image: "/photos/views/gangotri-47.jpg",
    alt: "Origin of the Ganga at Gangotri",
    credit: "\"Gangotri 47\" by Guptaele, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gangotri_47.JPG",
  },
  "gaurikund--kedarnath-approach": {
    image: "/photos/views/gaurikund-kedarnath-trail.jpg",
    alt: "Kedarnath approach at Gaurikund",
    credit: "\"Gaurikund- kedarnath trail\" by Prateek as a traveller, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gaurikund-_kedarnath_trail.jpg",
  },
  "gosaikunda--sacred-lake": {
    image: "/photos/views/gosaikunda-lake-nepal-u5a3309-pano.jpg",
    alt: "Sacred lake at Gosaikunda",
    credit: "\"Gosaikunda lake, Nepal U5A3309-Pano\" by Nrik kiran, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gosaikunda_lake,_Nepal_U5A3309-Pano.jpg",
  },
  "gosaikunda-route--mountain-trail-descent": {
    image: "/photos/views/gosaikunda-langtang-trekking.jpg",
    alt: "Mountain trail descent at Gosaikunda route",
    credit: "\"Gosaikunda Langtang trekking\" by Gauravnepaal, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Gosaikunda_Langtang_trekking.jpg",
  },
  "gosaikunda-shore--alpine-camp-light": {
    image: "/photos/views/manaslu-from-base-camp-trip.jpg",
    alt: "Alpine camp light at Gosaikunda shore",
    credit: "\"Manaslu, from base camp trip\" by Ben Tubby, CC BY 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Manaslu,_from_base_camp_trip.jpg",
  },
  "green-lake--quiet-alpine-water": {
    image: "/photos/views/tilicho-lake-world-s-highest-lake.jpg",
    alt: "Quiet alpine water at Green Lake",
    credit: "\"Tilicho lake, World's Highest Lake\" by Prabeshsdev, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Tilicho_lake,_World%27s_Highest_Lake.jpg",
  },
  "halesi-bazaar--temple-courtyard": {
    image: "/photos/views/khotang-halesi-temple-and-cave.jpg",
    alt: "Temple courtyard at Halesi bazaar",
    credit: "\"Khotang Halesi Temple and Cave\" by Sobertramp, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Khotang_Halesi_Temple_and_Cave.jpg",
  },
  "halesi-hill--limestone-landscape": {
    image: "/photos/views/halesi-mahadev-temple-cave.jpg",
    alt: "Limestone landscape at Halesi hill",
    credit: "\"Halesi Mahadev Temple Cave\" by Roshan Raj Adhikari, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Halesi_Mahadev_Temple_Cave.jpg",
  },
  "halesi-mahadev--cave-temple-entrance": {
    image: "/photos/views/halesi-mahadev-temple.jpg",
    alt: "Cave temple entrance at Halesi Mahadev",
    credit: "\"Halesi Mahadev Temple\" by Roshan Raj Adhikari, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Halesi_Mahadev_Temple.jpg",
  },
  "har-ki-pauri--ganga-aarti": {
    image: "/photos/views/aarti-at-har-ki-pauri-haridwar.jpg",
    alt: "Ganga Aarti at Har Ki Pauri",
    credit: "\"Aarti at Har-ki-Pauri, Haridwar\" by NID chick, CC BY 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Aarti_at_Har-ki-Pauri,_Haridwar.jpg",
  },
  "helambu--mountain-weather": {
    image: "/photos/views/sunset-view-from-helambu-0.jpg",
    alt: "Mountain weather at Helambu",
    credit: "\"Sunset view from Helambu 0\" by Sudan Shrestha, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Sunset_view_from_Helambu_0.JPG",
  },
  "helambu-ridge--forest-descent": {
    image: "/photos/views/helambu-ridge-nepal.jpg",
    alt: "Forest descent at Helambu ridge",
    credit: "\"Helambu ridge, Nepal\" by BusyBeaver-de, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Helambu_ridge,_Nepal.jpg",
  },
  "jomsom--windy-mountain-town": {
    image: "/photos/views/jomsom-from-view-tower.jpg",
    alt: "Windy mountain town at Jomsom",
    credit: "\"Jomsom from View Tower\" by Saddam19, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Jomsom_from_View_Tower.jpg",
  },
  "kagbeni--gateway-village": {
    image: "/photos/views/kagbeni-mustang-wlv-0741.jpg",
    alt: "Gateway village at Kagbeni",
    credit: "\"Kagbeni Mustang-WLV-0741\" by Bijay Chaurasia, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kagbeni_Mustang-WLV-0741.jpg",
  },
  "kali-gandaki--river-of-black-stones": {
    image: "/photos/views/kali-gandaki-valley01-nepal.jpg",
    alt: "River of black stones at Kali Gandaki",
    credit: "\"Kali Gandaki Valley01, Nepal\" by Sundar1, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kali_Gandaki_Valley01,_Nepal.JPG",
  },
  "kalinchowk--cable-car-ridge": {
    image: "/photos/views/kalinchowk-bhagwati-temple-or-kalinchok-mai-suippa-village-k.jpg",
    alt: "Cable-car ridge at Kalinchowk",
    credit: "\"Kalinchowk Bhagwati Temple or Kalinchok Mai Suippa Village Kuri Village Kalinchowk Dolakha Nepal Rajesh Dhungana (51)\" by Rajesh Dhungana, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kalinchowk_Bhagwati_Temple_or_Kalinchok_Mai_Suippa_Village_Kuri_Village_Kalinchowk_Dolakha_Nepal_Rajesh_Dhungana_(51).jpg",
  },
  "kalinchowk-bhagwati--temple-above-the-clouds": {
    image: "/photos/views/kalinchowk-bhagwati-temple-or-kalinchok-mai-suippa-village-k.jpg",
    alt: "Temple above the clouds at Kalinchowk Bhagwati",
    credit: "\"Kalinchowk Bhagwati Temple or Kalinchok Mai Suippa Village Kuri Village Kalinchowk Dolakha Nepal Rajesh Dhungana (52)\" by Rajesh Dhungana, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kalinchowk_Bhagwati_Temple_or_Kalinchok_Mai_Suippa_Village_Kuri_Village_Kalinchowk_Dolakha_Nepal_Rajesh_Dhungana_(52).jpg",
  },
  "kanyam--tea-garden-sunrise": {
    image: "/photos/views/kanyam-tea-garden-illam.jpg",
    alt: "Tea garden sunrise at Kanyam",
    credit: "\"Kanyam Tea Garden, Illam\" by Robic Upadhayay, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kanyam_Tea_Garden,_Illam.jpg",
  },
  "kedarnath--high-shrine-valley": {
    image: "/photos/views/kedarnath-temple.jpg",
    alt: "High shrine valley at Kedarnath",
    credit: "\"Kedarnath Temple\" by Shaq774 at en.wikipedia, Public domain, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kedarnath_Temple.jpg",
  },
  "khotang--hill-road-approach": {
    image: "/photos/views/from-tyamke-peak-3010mtrs-khotang-bhojpur.jpg",
    alt: "Hill road approach at Khotang",
    credit: "\"From Tyamke Peak 3010mtrs Khotang Bhojpur\" by Raishreekumar, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:From_Tyamke_Peak_3010mtrs_Khotang_Bhojpur.JPG",
  },
  "khotang-viewpoint--sunrise-over-the-hills": {
    image: "/photos/views/tyamke-peak-3010mtrs-khotang-bhojpur.jpg",
    alt: "Sunrise over the hills at Khotang viewpoint",
    credit: "\"Tyamke Peak 3010mtrs Khotang Bhojpur\" by Raishreekumar, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Tyamke_Peak_3010mtrs_Khotang_Bhojpur.jpg",
  },
  "kuri-trail--forest-to-ridge-trail": {
    image: "/photos/views/view-from-kuri.jpg",
    alt: "Forest-to-ridge trail at Kuri trail",
    credit: "\"View from kuri\" by Sishir Panthi, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:View_from_kuri.jpg",
  },
  "kuri-village--kuri-village-lights": {
    image: "/photos/views/kalinchowk-bhagwati-temple-or-kalinchok-mai-suippa-village-k.jpg",
    alt: "Kuri village lights at Kuri Village",
    credit: "\"Kalinchowk Bhagwati Temple or Kalinchok Mai Suippa Village Kuri Village Kalinchowk Dolakha Nepal Rajesh Dhungana (49)\" by Rajesh Dhungana, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kalinchowk_Bhagwati_Temple_or_Kalinchok_Mai_Suippa_Village_Kuri_Village_Kalinchowk_Dolakha_Nepal_Rajesh_Dhungana_(49).jpg",
  },
  "lauribina--high-pass-viewpoint": {
    image: "/photos/views/paints-of-sunrise-on-langtang-national-park.jpg",
    alt: "High pass viewpoint at Lauribina",
    credit: "\"Paints of sunrise on Langtang National Park\" by Q-lieb-in, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Paints_of_sunrise_on_Langtang_National_Park.jpg",
  },
  "mahadev-courtyard--evening-prayer": {
    image: "/photos/views/indreshwor-mahadev-temple-courtyard-panauti-kavrepalanchowk.jpg",
    alt: "Evening prayer at Mahadev courtyard",
    credit: "\"Indreshwor Mahadev Temple (श्री इन्द्रेश्वोर महादेव मन्दिर) courtyard, Panauti, Kavrepalanchowk\" by Shadow Ayush, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Indreshwor_Mahadev_Temple_(%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80_%E0%A4%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0%E0%A5%87%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A5%8B%E0%A4%B0_%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%A6%E0%A5%87%E0%A4%B5_%E0%A4%AE%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%BF%E0%A4%B0)_courtyard,_Panauti,_Kavrepalanchowk.jpg",
  },
  "manang-village--high-valley-panorama": {
    image: "/photos/views/manang-annapurna3-gangapurna.jpg",
    alt: "High valley panorama at Manang village",
    credit: "\"Manang Annapurna3 Gangapurna\" by Solundir, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Manang_Annapurna3_Gangapurna.jpg",
  },
  "maratika-cave--inside-the-sacred-cave": {
    image: "/photos/views/halesi-maratika-cave.jpg",
    alt: "Inside the sacred cave at Maratika cave",
    credit: "\"Halesi Maratika Cave\" by TseRigs, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Halesi_Maratika_Cave.jpg",
  },
  "marpha--apple-capital": {
    image: "/photos/views/mustang-marpha-08-schranktransport-2015-gje.jpg",
    alt: "Apple capital at Marpha",
    credit: "\"Mustang-Marpha-08-Schranktransport-2015-gje\" by Gerd Eichmann, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mustang-Marpha-08-Schranktransport-2015-gje.jpg",
  },
  "marsyangdi-corridor--return-road-viewpoint": {
    image: "/photos/views/manaslu-range.jpg",
    alt: "Return road viewpoint at Marsyangdi corridor",
    credit: "\"Manaslu range\" by Samdesherpa, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Manaslu_range.jpg",
  },
  "muktinath-temple--sacred-flame-and-snow": {
    image: "/photos/views/muktinath-temple-mustang.jpg",
    alt: "Sacred flame and snow at Muktinath Temple",
    credit: "\"Muktinath Temple, Mustang\" by Peaceincharm, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Muktinath_Temple,_Mustang.JPG",
  },
  "mustang--red-cliffs-and-dry-valleys": {
    image: "/photos/views/acap-upper-mustang-tangye.jpg",
    alt: "Red cliffs and dry valleys at Mustang",
    credit: "\"ACAP Upper Mustang Tangye\" by Patricia Sauer, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:ACAP_Upper_Mustang_Tangye.jpg",
  },
  "myagdi-highlands--forest-road": {
    image: "/photos/views/panorama-from-poonhill-2019-bj.jpg",
    alt: "Forest road at Myagdi highlands",
    credit: "\"Panorama from poonhill-2019-BJ\" by Bijay Chaurasia, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Panorama_from_poonhill-2019-BJ.jpg",
  },
  "nepal-hill-country--return-through-the-hills": {
    image: "/photos/views/langtang-range-24.jpg",
    alt: "Return through the hills at Nepal hill country",
    credit: "\"Langtang range (24)\" by Sudan Shrestha, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Langtang_range_(24).JPG",
  },
  "octopus-waterfall--waterfall-stop": {
    image: "/photos/views/waterfall-and-bridge-annapurna-circuit.jpg",
    alt: "Waterfall stop at Octopus Waterfall",
    credit: "\"Waterfall and bridge, Annapurna Circuit\" by Greg Willis, CC BY-SA 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Waterfall_and_bridge,_Annapurna_Circuit.jpg",
  },
  "pathivara-devi--pathibhara-ridge": {
    image: "/photos/views/power-of-goddess-pathivara-devi.jpg",
    alt: "Pathibhara ridge at Pathivara Devi",
    credit: "\"Power of Goddess \"Pathivara Devi\"\" by Bandana kc, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Power_of_Goddess_%22Pathivara_Devi%22.JPG",
  },
  "pathivara-trail--cloud-sea-viewpoint": {
    image: "/photos/views/mt-kanchanjunga-from-pathibhara-devi-temple.jpg",
    alt: "Cloud sea viewpoint at Pathivara trail",
    credit: "\"Mt.Kanchanjunga from Pathibhara Devi Temple\" by CHIRONEX XEN, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mt.Kanchanjunga_from_Pathibhara_Devi_Temple.jpg",
  },
  "pisang--village-rooftops": {
    image: "/photos/views/pisang-village-in-nepal.jpg",
    alt: "Village rooftops at Pisang",
    credit: "\"Pisang village in Nepal\" by Solundir, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Pisang_village_in_Nepal.jpg",
  },
  "pokhara--lake-and-mountain-reflections": {
    image: "/photos/views/phewa-lake-in-pokhara-15715573565.jpg",
    alt: "Lake and mountain reflections at Pokhara",
    credit: "\"Phewa Lake in Pokhara (15715573565)\" by Jean-Marie Hullot from France, CC BY 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Phewa_Lake_in_Pokhara_(15715573565).jpg",
  },
  "pokhara--lakeside-opening": {
    image: "/photos/views/cloudy-sunrise-from-pokhara.jpg",
    alt: "Lakeside opening at Pokhara",
    credit: "\"Cloudy Sunrise from Pokhara\" by Arjun Gurung Pokhara, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cloudy_Sunrise_from_Pokhara.jpg",
  },
  "pokhara-return--final-mountain-horizon": {
    image: "/photos/views/the-annapurna-range-from-pokhara.jpg",
    alt: "Final mountain horizon at Pokhara return",
    credit: "\"The Annapurna range from Pokhara\" by Jmhullot, CC BY 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:The_Annapurna_range_from_Pokhara.jpg",
  },
  "ranikhet--mountain-river-road": {
    image: "/photos/views/golu-devta-udepur-binta-ranikhet.jpg",
    alt: "Mountain river road at Ranikhet",
    credit: "\"Golu Devta Udepur, Binta, Ranikhet.\" by Enjoymusic nainital, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Golu_Devta_Udepur,_Binta,_Ranikhet..JPG",
  },
  "rasuwa--ridge-road-home": {
    image: "/photos/views/lauribinayak-rasuwa.jpg",
    alt: "Ridge road home at Rasuwa",
    credit: "\"Lauribinayak, Rasuwa\" by Santosh R. Pathak, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Lauribinayak,_Rasuwa.jpg",
  },
  "rishikesh--river-confluence": {
    image: "/photos/views/boat-on-the-ganges-near-lakshman-jhula-rishikesh-uttarakhand.jpg",
    alt: "River confluence at Rishikesh",
    credit: "\"Boat on the Ganges near Lakshman Jhula, Rishikesh, Uttarakhand, India\" by Dan Searle, CC BY-SA 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Boat_on_the_Ganges_near_Lakshman_Jhula,_Rishikesh,_Uttarakhand,_India.jpg",
  },
  "rupse-jharna--waterfall-in-the-gorge": {
    image: "/photos/views/rupse-fall-myagdi-district-wlv-1457.jpg",
    alt: "Waterfall in the gorge at Rupse Jharna",
    credit: "\"Rupse Fall, Myagdi District-WLV-1457\" by Aasish Shah, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Rupse_Fall,_Myagdi_District-WLV-1457.jpg",
  },
  "sailung--hundred-hills-sunrise": {
    image: "/photos/views/clear-sunrise-at-sailung-nepal.jpg",
    alt: "Hundred hills sunrise at Sailung",
    credit: "\"Clear sunrise at Sailung, Nepal\" by Anupama Pandeya, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Clear_sunrise_at_Sailung,_Nepal.jpg",
  },
  "sailung-ridge--dawn-across-central-nepal": {
    image: "/photos/views/sunpension-bridge-jholujnge-pool-tunitar-khare-gaurishankar-.jpg",
    alt: "Dawn across central Nepal at Sailung ridge",
    credit: "\"Sunpension Bridge Jholujnge Pool Tunitar Khare Gaurishankar VDC Dolakha Nepal Rajesh Dhungana (03)\" by Rajesh Dhungana, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Sunpension_Bridge_Jholujnge_Pool_Tunitar_Khare_Gaurishankar_VDC_Dolakha_Nepal_Rajesh_Dhungana_(03).jpg",
  },
  "sailung-viewpoint--open-ridge-walk": {
    image: "/photos/views/morning-light-over-sailung-hills.jpg",
    alt: "Open ridge walk at Sailung viewpoint",
    credit: "\"Morning Light over Sailung Hills\" by Megaurab09, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Morning_Light_over_Sailung_Hills.jpg",
  },
  "saraswati-and-bhairab-kunda--neighbouring-lakes": {
    image: "/photos/views/lake-gosaikunda.jpg",
    alt: "Neighbouring lakes at Saraswati and Bhairab Kunda",
    credit: "\"Lake Gosaikunda\" by Sergey Pesterev, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Lake_Gosaikunda.jpg",
  },
  "sermathang-road--kathmandu-valley-return": {
    image: "/photos/views/img-3726-sermathang.jpg",
    alt: "Kathmandu valley return at Sermathang road",
    credit: "\"IMG 3726 Sermathang\" by Lauren Gawne, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:IMG_3726_Sermathang.jpg",
  },
  "shanti-stupa--panorama-from-the-ridge": {
    image: "/photos/views/world-peace-pagoda-or-shanti-stupa-pokhra.jpg",
    alt: "Panorama from the ridge at Shanti Stupa",
    credit: "\"World peace pagoda or Shanti Stupa pokhra\" by Goutam1962, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:World_peace_pagoda_or_Shanti_Stupa_pokhra.jpg",
  },
  "sing-gompa--lake-and-monastery-return": {
    image: "/photos/views/ganesh-himal-air-view.jpg",
    alt: "Lake and monastery return at Sing Gompa",
    credit: "\"Ganesh Himal air view\" by Solundir, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ganesh_Himal_air_view.jpg",
  },
  "sing-gompa--yak-cheese-country": {
    image: "/photos/views/travellers-heading-towards-gosainkunda-lake-after-crossing-l.jpg",
    alt: "Yak cheese country at Sing Gompa",
    credit: "\"Travellers heading towards Gosainkunda Lake after crossing Lauri Binayak, Rasuwa. Mountain in the back is Langtang Lirung. (By Saroj Pandey)\" by Saroj Pandey, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Travellers_heading_towards_Gosainkunda_Lake_after_crossing_Lauri_Binayak,_Rasuwa._Mountain_in_the_back_is_Langtang_Lirung._(By_Saroj_Pandey).jpg",
  },
  "sukute-beach--river-recreation": {
    image: "/photos/views/balephi-river-in-balephi-rural-municipality.jpg",
    alt: "River recreation at Sukute Beach",
    credit: "\"Balephi River in Balephi Rural Municipality\" by Saddam19, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Balephi_River_in_Balephi_Rural_Municipality.jpg",
  },
  "tamor-river--tammor-corridor": {
    image: "/photos/views/makalu.jpg",
    alt: "Tammor corridor at Tamor River",
    credit: "\"Makalu\" by Ben Tubby, CC BY 2.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Makalu.jpg",
  },
  "tarkeghyang--helambu-trailhead": {
    image: "/photos/views/tarkeghyang-helambu-road-amayangri-20250502.jpg",
    alt: "Helambu trailhead at Tarkeghyang",
    credit: "\"Tarkeghyang Helambu Road Amayangri 20250502\" by Pratapbaniya, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Tarkeghyang_Helambu_Road_Amayangri_20250502.jpg",
  },
  "tarkeghyang-village--monastery-landscape": {
    image: "/photos/views/amayangri-helambu-langtang-himalayan-range-1-20250503.jpg",
    alt: "Monastery landscape at Tarkeghyang village",
    credit: "\"Amayangri Helambu Langtang Himalayan Range 1 20250503\" by Pratapbaniya, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Amayangri_Helambu_Langtang_Himalayan_Range_1_20250503.jpg",
  },
  "tatopani--hot-spring-valley": {
    image: "/photos/views/160316-031-bridge-near-tatopani.jpg",
    alt: "Hot spring valley at Tatopani",
    credit: "\"160316-031 Bridge near Tatopani\" by Faj2323, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:160316-031_Bridge_near_Tatopani.jpg",
  },
  "thulophedi--pilgrimage-base-camp": {
    image: "/photos/views/taplejung-gumba.jpg",
    alt: "Pilgrimage base camp at Thulophedi",
    credit: "\"Taplejung Gumba\" by Nitesh Verma, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Taplejung_Gumba.jpg",
  },
  "thumka--village-below-the-ridge": {
    image: "/photos/views/thumka-korikha-khola.jpg",
    alt: "Village below the ridge at Thumka",
    credit: "\"Thumka Korikha Khola\" by Anup Sadi, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Thumka_Korikha_Khola.jpg",
  },
  "uttarkashi--uttarkashi-valley": {
    image: "/photos/views/uttarkashi-town-wtk20150914-dsc-0004.jpg",
    alt: "Uttarkashi valley at Uttarkashi",
    credit: "\"Uttarkashi Town WTK20150914-DSC 0004\" by Atudu, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Uttarkashi_Town_WTK20150914-DSC_0004.jpg",
  },
  "vedetar--ridge-top-weather": {
    image: "/photos/views/vedetar-2019-web-small.jpg",
    alt: "Ridge-top weather at Vedetar",
    credit: "\"Vedetar 2019 web small\" by Mithunkunwar9, CC BY-SA 4.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Vedetar_2019_web_small.jpg",
  },
  "yamunotri--yamunotri-shrine": {
    image: "/photos/views/yamunotri-temple-and-ashram.jpg",
    alt: "Yamunotri shrine at Yamunotri",
    credit: "\"Yamunotri temple and ashram\" by Atarax42, CC BY-SA 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Yamunotri_temple_and_ashram.jpg",
  },
  "yangri-ridge--jugal-himal-skyline": {
    image: "/photos/views/dorje-lakpa.jpg",
    alt: "Jugal Himal skyline at Yangri ridge",
    credit: "\"Dorje-lakpa\" by Ahtih ( talk ), CC BY 3.0, via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dorje-lakpa.jpg",
  },
};
