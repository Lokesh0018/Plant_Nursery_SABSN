// Business details shared by the pages, the footer and the build-time SEO (vite.config.js). Plain data only:
// this file is also imported by the build, so it must not import components, styles or images.

export const SITE_URL = 'https://sabsn.com';

export const BUSINESS = {
  name: 'Sri Ayyappa Bala Sai Nursery',
  shortName: 'SABSN',
  fullName: 'Sri Ayyappa Bala Sai Nursery (SABSN)',
  // the business numbers and email as printed on the headquarters signboard (the first is the main call/WhatsApp line)
  phones: [
    { label: '+91 98499 36169', tel: '+919849936169' },
    { label: '+91 94903 78689', tel: '+919490378689' },
    { label: '+91 98451 18946', tel: '+919845118946' },
    { label: '0891 459 9555', tel: '+918914599555' },
  ],
  whatsapp: '919849936169',
  email: 'sabsnnursery@gmail.com',
  logo: '/images/brand/logo-256.webp',
  // hours as stated on the site today ("Open daily, 7 am – 6 pm"). Not yet confirmed per branch, so the
  // structured data leaves them out until the owner confirms them (see LOCATIONS[].openingHours).
  hoursText: 'Open daily, 7 am – 6 pm',
};

export const waLink = (message) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
