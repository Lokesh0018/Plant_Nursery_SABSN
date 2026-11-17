// Frequently asked questions, written for answer engines: each answer opens with the direct answer
// ("Yes." / the place / the list) and stays self-contained. One source for both the home-page FAQ
// section (Faq.jsx) and the FAQPage JSON-LD that vite.config.js writes into index.html at build time.

export const FAQS = [
  {
    q: 'Where is SABSN Plant Nursery located?',
    a: 'Sri Ayyappa Bala Sai Nursery (SABSN) serves customers in Rajahmundry and Visakhapatnam, Andhra Pradesh, offering a wide range of plants and landscaping solutions.',
  },
  {
    q: 'What types of plants are available at SABSN Nursery?',
    a: 'SABSN offers a diverse collection of indoor plants, outdoor plants, flowering plants, ornamental plants, fruit plants, avenue trees, native trees, and landscaping plants.',
  },
  {
    q: 'Does SABSN provide landscaping services?',
    a: 'Yes. SABSN provides landscaping services for residential and commercial spaces, helping customers explore suitable plants for gardens, outdoor areas, and green spaces.',
  },
  {
    q: 'Does SABSN Nursery provide plant delivery?',
    a: 'Yes. SABSN provides plant delivery services. Customers can contact the nursery to confirm delivery locations, transportation arrangements, availability, and applicable charges.',
  },
  {
    q: 'Can I order plants in bulk from SABSN?',
    a: 'Yes. SABSN accepts bulk plant orders for landscaping projects, commercial properties, residential developments, and plantation requirements. Contact the nursery with your plant varieties and quantity requirements.',
  },
  {
    q: 'Which plants are best for home gardens in Andhra Pradesh?',
    a: 'Flowering plants, ornamental shrubs, palms, fruit plants, and selected shade trees are popular choices for home gardens in Andhra Pradesh. Selection depends on sunlight, soil, available space, and maintenance requirements.',
  },
  {
    q: 'Where can I buy indoor and outdoor plants in Rajahmundry and Visakhapatnam?',
    a: 'Customers can contact SABSN to explore indoor and outdoor plant varieties in Rajahmundry and Visakhapatnam. Plant availability, sizes, and prices can be confirmed directly with the nursery.',
  },
  {
    q: 'Can I visit SABSN Nursery to select plants?',
    a: 'Yes. Customers are welcome to visit SABSN Nursery to explore available plant varieties and discuss their gardening or landscaping requirements. Contact the nursery beforehand to confirm visiting details.',
  },
];

// schema.org FAQPage, for the <script type="application/ld+json"> in index.html
export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});
