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

