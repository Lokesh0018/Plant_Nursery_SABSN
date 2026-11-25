// The two SABSN nurseries: one source for the location pages, the home "Our nursery locations" section, the
// footer, the contact page, map links and the LocalBusiness structured data (vite.config.js).
// Plain data only (the build imports this file). Anything not yet supplied by the owner stays `null` and is
// left out of the pages and the structured data rather than guessed.

export const LOCATIONS = [
  {
    key: 'kadiyam',
    path: '/plant-nursery-rajahmundry/',
    name: 'Sri Ayyappa Bala Sai Nursery (SABSN) – Kadiyam',
    shortName: 'SABSN Kadiyam',
    cardTitle: 'SABSN Kadiyam – Near Rajahmundry',
    cta: 'Explore Kadiyam Nursery',
    market: 'Rajahmundry',              // the nearby city people search for
    streetAddress: 'Jakkampudi Nagar',
    locality: 'Kadiyam',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    postalCode: '533125',
    country: 'IN',
    countryName: 'India',
    // no verified pin has been supplied for this branch: maps and directions search the full address instead
    coordinates: null,
    mapsQuery: 'Sri Ayyappa Bala Sai Nursery, Jakkampudi Nagar, Kadiyam, East Godavari, Andhra Pradesh 533125',
    telephone: null,                    // branch-specific number: awaiting owner confirmation
    openingHours: null,                 // branch-specific hours: awaiting owner confirmation
    // real photographs of this branch only (the first leads the branch card and the home-page card)
    photos: [
      { src: '/images/about/rajahmundry-nursery.webp', srcSet: '/images/about/rajahmundry-nursery-800.webp 800w, /images/about/rajahmundry-nursery.webp 1200w', width: 1200, height: 673,
        alt: 'Glasshouse at the SABSN nursery in Kadiyam, near Rajahmundry, with beds of flowering plants either side of a central path' },
      { src: '/images/gallery/palms-1280.webp', srcSet: '/images/gallery/palms-640.webp 640w, /images/gallery/palms-1280.webp 1280w', width: 1280, height: 720,
        alt: 'Potted palms lined up along a path at the SABSN nursery in Kadiyam' },
      { src: '/images/gallery/ficus-1280.webp', srcSet: '/images/gallery/ficus-640.webp 640w, /images/gallery/ficus-1280.webp 1280w', width: 1280, height: 1707,
        alt: 'Braided ficus standards in pots at the SABSN nursery in Kadiyam' },
    ],
  },
  {
    key: 'visakhapatnam',
    path: '/plant-nursery-visakhapatnam/',
    name: 'Sri Ayyappa Bala Sai Nursery (SABSN) – Visakhapatnam Headquarters',
    headquarters: true,
    shortName: 'SABSN Visakhapatnam',
    cardTitle: 'SABSN Visakhapatnam',
    cta: 'Explore Visakhapatnam Nursery',
    market: 'Visakhapatnam',
    streetAddress: 'D. No. 7-23, Revallapalem Road, Srinivasa Nagar', // as on the headquarters signboard
    locality: 'Madhurawada',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    postalCode: '530048',
    country: 'IN',
    countryName: 'India',
    // the owner's exact headquarters pin (not the Madhurawada locality centre). Do not change without owner approval.
    coordinates: { lat: 17.816097, lng: 83.355248 },
    // the owner's original Google Maps Street View link, kept for reference; navigation uses the coordinates
    referenceMapUrl: 'https://www.google.com/maps/place/17%C2%B048%2758.0%22N+83%C2%B021%2718.9%22E/@17.8163184,83.3552226,63a,75y,181.41h,104.82t/data=!3m7!1e0',
    mapsQuery: null,
    telephone: '+919849936169',         // main nursery contact line
    openingHours: null,
    // real photographs of this branch only (the first leads the branch card and the home-page card)
    photos: [
      { src: '/images/about/visakhapatnam-nursery.webp', srcSet: '/images/about/visakhapatnam-nursery-800.webp 800w, /images/about/visakhapatnam-nursery.webp 1600w', width: 1600, height: 900,
        alt: 'Storefront of Sri Ayyappa Bala Sai Nursery in Madhurawada, Visakhapatnam, with the nursery signboard above potted palms' },
    ],
  },
];

export const LOCATION_BY_KEY = Object.fromEntries(LOCATIONS.map((l) => [l.key, l]));

/** One-line address, e.g. "Jakkampudi Nagar, Kadiyam, East Godavari, Andhra Pradesh, India – 533125" */
export function formatAddress(loc, { country = true } = {}) {
  const line = [loc.streetAddress, loc.locality, loc.district, loc.state].filter(Boolean)
    .filter((p, i, arr) => arr.indexOf(p) === i) // Visakhapatnam is both the district and the city
    .join(', ');
  return `${line}${country ? `, ${loc.countryName}` : ''} – ${loc.postalCode}`;
}

/** Google Maps: the verified pin when there is one, otherwise the full address */
export function mapsQuery(loc) {
  return loc.coordinates ? `${loc.coordinates.lat},${loc.coordinates.lng}` : loc.mapsQuery || formatAddress(loc);
}
export const directionsUrl = (loc) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery(loc))}`;
export const mapsSearchUrl = (loc) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(loc))}`;
export const mapEmbedUrl = (loc) => `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery(loc))}&z=${loc.coordinates ? 16 : 14}&output=embed`;
