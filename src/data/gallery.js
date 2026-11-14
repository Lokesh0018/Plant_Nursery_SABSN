// Gallery photographs, shared by the home-page gallery (the five with a `featured` position, 1-5) and the /gallery page.
// Most come from the nursery's company profile: its own stock, landscapes it maintains, and its
// client meetings and visits (captions follow the profile's own wording). They are phone photos,
// so each is shown at its native size. `pos` keeps faces in frame when a tile crops the photo.

export const GALLERY_GROUPS = [
  { key: 'projects', label: 'Projects', title: 'Landscapes we look after', blurb: 'Public and private landscapes planted and maintained by the nursery.' },
  { key: 'nursery', label: 'Nursery stock', title: 'From our nursery beds', blurb: 'Specimen palms, ornamental standards, flowering and fruit plants grown in Kadiyam.' },
  { key: 'clients', label: 'Clients & meetings', title: 'Clients & meetings', blurb: 'Meetings, site visits and presentations with the clients and partners we work with.' },
];

export const galleryItems = [
  { cat: 'projects', src: '/gallery/avenue.webp', width: 1200, height: 800, tag: 'Maintained Landscape', title: 'Palm Avenue Upkeep',
    alt: 'A landscaped avenue lined with tall palms, flowering trees and clipped hedges.' },
  { featured: 2, cat: 'projects', src: '/gallery/airport.webp', width: 1360, height: 1020, tag: 'Airport Project', title: 'Airport Forecourt Landscaping',
    alt: 'An airport terminal forecourt planted with rounded shrubs, flowering hedges and palms.' },
  { featured: 1, cat: 'nursery', src: '/gallery/palms.webp', width: 1672, height: 941, tag: 'Specimen Stock', title: 'Potted Palm Stock',
    alt: 'A row of young palms in terracotta pots lining a sunlit nursery path.' },
  { cat: 'nursery', src: '/gallery/ficus.webp', width: 900, height: 1200, tag: 'Ornamental Standards', title: 'Braided Ficus Standards',
    alt: 'A row of potted ficus standards with braided lattice trunks and glossy green canopies.' },
  { cat: 'nursery', src: '/gallery/bougainvillea.webp', width: 338, height: 409, tag: 'Flowering Plants', title: 'Multi-Colour Bougainvillea',
    alt: 'A potted bougainvillea standard covered in magenta, red and white bracts in the nursery yard.' },
  { cat: 'nursery', src: '/gallery/coconut.webp', width: 441, height: 424, pos: 'center 40%', tag: 'Fruit Plants', title: 'Laden Coconut Palms',
    alt: 'A dwarf coconut palm heavy with clusters of green coconuts in the nursery.' },
  { featured: 4, cat: 'clients', src: '/gallery/meeting-project.webp', width: 714, height: 536, pos: 'center 35%', tag: 'Client Meeting', title: 'Project Discussion & Coordination',
    alt: 'The nursery team in an office meeting, discussing a landscape project over printed plans.' },
  { featured: 5, cat: 'clients', src: '/gallery/meeting-official.webp', width: 1672, height: 941, pos: 'center 30%', tag: 'Official Meeting', title: 'Official Meeting & Professional Interaction',
    alt: 'The nursery team meeting an official in an office, with colleagues gathered around.' },
  { cat: 'clients', src: '/gallery/presentation-bouquet.webp', width: 687, height: 926, pos: 'center 30%', tag: 'Appreciation', title: 'Plant Presentation & Appreciation',
    alt: 'A flower bouquet being presented to a guest during a visit.' },
  { featured: 3, cat: 'clients', src: '/gallery/visit-airport.webp', width: 1672, height: 941, pos: 'center 45%', tag: 'Site Visit', title: 'Professional Visit & Engagement',
    alt: 'A handshake between the nursery team and an official at an airport forecourt planted by the nursery.' },
  { cat: 'clients', src: '/gallery/visit-client.webp', width: 352, height: 469, pos: 'center 25%', tag: 'Client Visit', title: 'Client & Stakeholder Engagement',
    alt: 'A member of the nursery team with a visiting client in traditional Gulf dress.' },
  { cat: 'clients', src: '/gallery/team.webp', width: 352, height: 469, pos: 'center 25%', tag: 'Our Team', title: 'Team & Stakeholder Interaction',
    alt: 'Three members of the nursery team standing together in an office.' },
];
