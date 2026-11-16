import { Trees, Shovel, Scissors, Flower2, FlaskConical, Layers, Recycle, Amphora, BrickWall, LayoutGrid } from 'lucide-react';

// The nursery's ten services, each with a relevant local image.
export const SERVICES = [
  { title: 'Garden Design & Landscaping', text: 'Professional garden planning, landscape development and ongoing garden care for institutional, commercial and residential spaces.', Icon: Trees },
  { title: 'Plant Supply & Installation', text: 'Supply and professional planting of trees, shrubs, ornamental plants and garden materials tailored to project requirements.', Icon: Shovel },
  { title: 'Lawn Development & Maintenance', text: 'Lawn planning, ground preparation, grass installation, routine maintenance and upkeep of established green spaces.', Icon: Scissors },
  { title: 'Flowers, Shrubs & Ornamental Plants', text: 'Supply of flowering plants, ornamental shrubs, seasonal annuals and decorative plant varieties for gardens and landscapes.', Icon: Flower2 },
  { title: 'Plant Research, Breeding & Development', text: 'Research, testing and development of new plant varieties, cultivation techniques and improved nursery growing practices.', Icon: FlaskConical },
  { title: 'Cocopeat & Coco Fibre Supply', text: 'Quality growing media and coco-based products for nursery propagation, potting applications and professional soil-mix preparation.', Icon: Layers },
  { title: 'Organic Compost & Soil Conditioner Supply', text: 'Supply of organic compost and soil-enrichment materials to improve soil structure, planting conditions and plant growth.', Icon: Recycle },
  { title: 'Plant Pots, Planters & Containers', text: 'Wide selection of indoor and outdoor pots, decorative planters and functional containers in different materials, designs and sizes.', Icon: Amphora },
  { title: 'Landscape Civil Works & Infrastructure', text: 'Execution of landscape-related civil works, including pathways, paving, garden edging, raised planters, site preparation and supporting infrastructure.', Icon: BrickWall },
  { title: 'Vertical Garden Design, Installation & Maintenance', text: 'Customized vertical garden planning, installation, planting arrangements, irrigation integration and ongoing maintenance.', Icon: LayoutGrid },
];

// Original generated service illustrations, stored in two local image atlases.
export const SERVICE_IMAGES = [
  { atlas: 'landscape', sheet: 'six', alt: 'Illustration of a designed tropical garden with curved beds and a seating area', category: 'Design & build' },
  { atlas: 'planting', sheet: 'six', alt: 'Illustration of a gardener planting a young tree beside nursery shrubs', category: 'Plants & planting' },
  { atlas: 'lawn', sheet: 'six', alt: 'Illustration of a lawnmower maintaining a neatly edged green lawn', category: 'Garden care' },
  { atlas: 'flowers', sheet: 'six', alt: 'Illustration of flowering hibiscus, bougainvillea, marigolds and ornamental crotons', category: 'Plants & planting' },
  { atlas: 'research', alt: 'Illustration of seedling trials and plant tissue-culture vessels in a greenhouse', category: 'Research & growing' },
  { atlas: 'cocopeat', alt: 'Illustration of compressed cocopeat bricks and loose coconut fibres', category: 'Growing essentials' },
  { atlas: 'compost', sheet: 'six', alt: 'Illustration of organic compost in a burlap sack with a soil scoop', category: 'Growing essentials' },
  { atlas: 'planters', sheet: 'six', alt: 'Illustration of terracotta, ceramic and stone planters in a range of sizes', category: 'Garden essentials' },
  { atlas: 'civil', alt: 'Illustration of a stone garden pathway, masonry edging and raised planting beds', category: 'Design & build' },
  { atlas: 'vertical', alt: 'Illustration of a vertical garden filled with ferns and trailing foliage', category: 'Design & build' },
];


// More about each service, shown in its detail window on the Services page (same order as SERVICES).
// kind: 'project' services run as site work; 'supply' services are materials and plants supplied to order.
export const SERVICE_DETAILS = [
  { kind: 'project', includes: ['Site survey and layout planning', 'A plant palette chosen for the site', 'Beds, lawns, hedges and features', 'Handover and ongoing garden care'], idealFor: ['Campuses & institutions', 'Offices & hotels', 'Homes & villas'] },
  { kind: 'project', includes: ['Trees, shrubs and ornamentals from our nursery', 'Bulk supply for large projects', 'Pit preparation and planting', 'Staking, mulching and first watering'], idealFor: ['Landscape contractors', 'Avenues & campuses', 'Housing layouts'] },
  { kind: 'project', includes: ['Ground levelling and soil preparation', 'Grass planting or turf laying', 'Mowing, edging and feeding', 'Weed control and patch repair'], idealFor: ['Schools & sports grounds', 'Gated communities', 'Home gardens'] },
  { kind: 'supply', includes: ['Seasonal annuals and bedding plants', 'Flowering shrubs and climbers', 'Crotons and foliage ornamentals', 'Picks matched to sun and season'], idealFor: ['Beds & borders', 'Entrances & medians', 'Events & festivals'] },
  { kind: 'project', includes: ['Trials of new plant varieties', 'Propagation and growing techniques', 'Improved nursery practices', 'Healthy, acclimatised stock'], idealFor: ['Nurseries & growers', 'Research partners', 'Plantation projects'] },
  { kind: 'supply', includes: ['Cocopeat blocks and loose media', 'Coco fibre for mixes and mulch', 'For propagation and potting', 'Bulk and retail quantities'], idealFor: ['Nurseries & growers', 'Terrace & kitchen gardens', 'Hydroponic setups'] },
  { kind: 'supply', includes: ['Organic and vermi compost', 'Soil conditioners and enrichers', 'Advice on mix and quantity', 'Bagged and bulk supply'], idealFor: ['Farms & orchards', 'Landscape projects', 'Home gardeners'] },
  { kind: 'supply', includes: ['Indoor and outdoor pots', 'Terracotta, ceramic and more', 'Large containers for landscapes', 'Sizes from tabletop to statement'], idealFor: ['Homes & balconies', 'Offices & lobbies', 'Hotels & restaurants'] },
  { kind: 'project', includes: ['Pathways and paving', 'Garden edging and kerbs', 'Raised planters and beds', 'Site preparation and groundwork'], idealFor: ['Parks & campuses', 'Commercial sites', 'Residential layouts'] },
  { kind: 'project', includes: ['Custom wall design and layout', 'Plants chosen for light and wall', 'Irrigation built into the system', 'Regular trimming and plant care'], idealFor: ['Office lobbies & façades', 'Balconies & terraces', 'Hotels & cafés'] },
];
