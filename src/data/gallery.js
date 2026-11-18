// Gallery photographs, shared by the home-page gallery (the five with a `featured` position, 1-5) and the /gallery page.
// Most come from the nursery's company profile: its own stock, landscapes it maintains, and its
// client meetings and visits (captions follow the profile's own wording). They are phone photos,
// so each is shown at its native size. `pos` keeps faces in frame when a tile crops the photo.
// `fixedRow` items start a row of their own and keep one size (the bouquet's portrait shape) instead of stretching to fill it.

export const GALLERY_GROUPS = [
  { key: 'projects', label: 'Projects', title: 'Landscapes we look after', blurb: 'Public and private landscapes planted and maintained by the nursery.' },
  { key: 'nursery', label: 'Nursery stock', title: 'From our nursery beds', blurb: 'Specimen palms, ornamental standards, flowering and fruit plants grown in Kadiyam.' },
  { key: 'clients', label: 'Clients & meetings', title: 'Clients & meetings', blurb: 'Meetings, site visits and presentations with the clients and partners we work with.' },
];

export const galleryItems = [
  { id: 'nursery-moment-0', cat: 'clients', src: '/images/gallery/nursery-moments-sheet-v3.webp', cell: 0, width: 960, height: 540, fit: 'contain', tag: 'Nursery Moments', title: 'Plant Presentation & Appreciation', alt: 'Two men presenting a small tree in an office.' },
  { id: 'nursery-moment-1', cat: 'clients', src: '/images/gallery/nursery-moments-sheet-v3.webp', cell: 1, width: 960, height: 540, fit: 'contain', tag: 'Nursery Moments', title: 'A Gift of Green', alt: 'Three men sharing a potted tree during a plant presentation.' },
  { id: 'nursery-moment-2', cat: 'nursery', src: '/images/gallery/nursery-moments-sheet-v3.webp', cell: 2, width: 960, height: 540, fit: 'contain', tag: 'Nursery Moments', title: 'Our Flowering Bougainvillea', alt: 'A nursery representative beside a large flowering bougainvillea.' },
  { id: 'nursery-moment-3', cat: 'clients', src: '/images/gallery/rajahmundry-airport-portrait.png', width: 1536, height: 1024, fit: 'contain', tag: 'Nursery Moments', title: 'Rajahmundry Airport Visit', alt: 'Retouched airport visit photograph with Telugu, Hindi and English airport signage and added Powered by SABSN branding.' },
  { cat: 'projects', src: '/images/gallery/avenue.webp', width: 960, height: 1280, tag: 'Maintained Landscape', title: 'Palm Avenue Upkeep',
    alt: 'A long road lined on both sides by tall royal palms and shade trees over well-kept lawns.' },
  { featured: 2, cat: 'projects', src: '/images/gallery/airport.webp', width: 3840, height: 2880, tag: 'Airport Project', title: 'Airport Forecourt Landscaping',
    alt: 'An airport terminal forecourt planted with rounded shrubs, flowering hedges and palms.' },
  { featured: 1, cat: 'nursery', src: '/images/gallery/palms.webp', width: 3840, height: 2161, tag: 'Specimen Stock', title: 'Potted Palm Stock',
    alt: 'A row of young palms in terracotta pots lining a sunlit nursery path.' },
  { cat: 'nursery', src: '/images/gallery/ficus.webp', width: 2880, height: 3840, tag: 'Ornamental Standards', title: 'Braided Ficus Standards',
    alt: 'A row of potted ficus standards with braided lattice trunks and glossy green canopies.' },
  { cat: 'nursery', src: '/images/gallery/arch.webp', width: 3840, height: 2560, tag: 'Living Arches', title: 'Trained Topiary Arch',
    alt: 'A living arch of trained green climber rising from two large pots over a mossy path, with clipped topiary trees on either side.' },
  { cat: 'nursery', src: '/images/gallery/coral.webp', width: 2048, height: 1365, tag: 'Flowering Trees', title: 'Indian Coral Tree in Bloom',
    alt: 'A cluster of bright orange-red Indian coral tree flowers against green foliage and a textured trunk.' },
  { cat: 'nursery', src: '/images/gallery/uppada.webp', width: 1672, height: 941, pos: 'center 35%', tag: 'Decorative Planters', title: 'Camel Planters & Garden Statues',
    alt: 'A nursery representative beside camel-shaped terracotta planters and a white Buddha statue holding a potted succulent, under hanging baskets in the shade house.' },
  { featured: 4, cat: 'clients', src: '/images/gallery/meeting-project.webp', width: 3840, height: 2883, pos: 'center 35%', tag: 'Client Meeting', title: 'Project Discussion & Coordination',
    alt: 'The nursery team in an office meeting, discussing a landscape project over printed plans.' },
  { featured: 5, cat: 'clients', src: '/images/gallery/meeting-official.webp', width: 3840, height: 2161, pos: 'center 30%', tag: 'Official Meeting', title: 'Official Meeting & Professional Interaction',
    alt: 'The nursery team meeting an official in an office, with colleagues gathered around.' },
  { featured: 3, cat: 'clients', src: '/images/gallery/visit-airport.webp', width: 3840, height: 2161, pos: 'center 45%', tag: 'Site Visit', title: 'Professional Visit & Engagement',
    alt: 'A handshake between the nursery team and an official at an airport forecourt planted by the nursery.' },
  { cat: 'clients', src: '/images/gallery/sacna.webp', width: 1672, height: 941, tag: 'Association', title: 'Sir Arthur Cotton Nursery Farmers Association',
    alt: 'The Sir Arthur Cotton Nursery Farmers Association building, with an equestrian statue beside the gate and clipped hedges along its railings.' },
  { cat: 'clients', src: '/images/gallery/presentation-bouquet.webp', width: 2849, height: 3840, displayRatio: 2849 / 3840, fixedRow: true, pos: 'center 30%', tag: 'Appreciation', title: 'Plant Presentation & Appreciation',
    alt: 'A flower bouquet being presented to a guest during a visit.' },
  { cat: 'clients', src: '/images/gallery/visit-client.webp', width: 2882, height: 3840, displayRatio: 2849 / 3840, fixedRow: true, pos: 'center 25%', tag: 'Client Visit', title: 'Client & Stakeholder Engagement',
    alt: 'A member of the nursery team with a visiting client in traditional Gulf dress.' },
  { cat: 'clients', src: '/images/gallery/team.webp', width: 2882, height: 3840, displayRatio: 2849 / 3840, fixedRow: true, pos: 'center 25%', tag: 'Our Team', title: 'Team & Stakeholder Interaction',
    alt: 'Three members of the nursery team standing together in an office.' },
];

// Every photo also exists at 640, 1280 and 2400 px wide (as WebP, next to the original, wherever the original
// is wider), so tiles and thumbnails download a size near what they show instead of the 4K original.
const VARIANT_WIDTHS = [640, 1280, 2400];
export function gallerySrcSet(item) {
  if (item.cell !== undefined) return undefined;
  const base = item.src.replace(/\.[a-z]+$/i, '');
  return VARIANT_WIDTHS.filter((w) => w < item.width)
    .map((w) => `${base}-${w}.webp ${w}w`)
    .concat(`${item.src} ${item.width}w`)
    .join(', ');
}
