// "Why grow it" points shown in the plant details dialog on the Plants page.
// Specific benefits are listed only for plants we can describe with confidence; every other catalogue entry
// (local names, topiary shapes) falls back to the general benefits of its category. Keys match catalogue names.

const byName = {
  // indoor
  'Mickey Green': ['Compact and tidy on shelves and desks', 'Copes well with indoor light', 'Needs only light, occasional watering'],
  Peperomia: ['Thick leaves store water, so it forgives missed waterings', 'Stays small for desks and windowsills', 'Generally regarded as pet-friendly'],
  Alocasia: ['Bold, sculptural leaves make an instant focal point', 'Brings a lush tropical look indoors', 'Keep away from children and pets: the sap irritates'],

  // palms
  'Red Wax Palm': ['Striking red stems for a colourful tropical accent', 'Slow, upright clumps suit feature beds', 'Thrives in warm, humid conditions'],
  'Triangular Palm': ['Unusual three-sided crown makes a landmark specimen', 'Tolerates heat and sun well', 'Low maintenance once established'],
  'Traveller Palm': ['Dramatic fan of leaves for open lawns', 'Strong focal point for entrances and campuses', 'Fast to establish in warm climates'],
  'Royal Palm': ['Tall, stately trunks line grand avenues', 'Clean, formal look for large landscapes', 'Handles heat and coastal conditions'],
  'Foxtail Palm': ['Soft, bushy fronds for a lush tropical look', 'Fast-growing and low maintenance', 'Tolerates sun and drier spells once established'],
  'Washingtonia Palm': ['Very hardy and fast-growing', 'Handles heat, sun and drought well', 'Tall, slim trunks for avenues and boundaries'],
  'Date Palm': ['Produces edible dates on fruiting trees', 'Very tolerant of heat and dry conditions', 'Classic look for avenues and resorts'],

  // flowering shrubs and trees
  'Red Bottle Brush': ['Bright red brush-like flowers for much of the year', 'Attracts bees, birds and butterflies', 'Hardy and drought tolerant once settled'],
  'Green Bottle Brush': ['Graceful weeping foliage with brush-like blooms', 'Attracts pollinators and birds', 'Hardy, low-maintenance screening tree'],
  'Golden Bottle Brush': ['Golden-yellow foliage brightens a planting scheme', 'Compact, neat habit for borders and hedges', 'Hardy and easy to maintain'],
  Ashoka: ['Tall, narrow form for screens and boundaries', 'Helps reduce dust and noise along roads', 'Evergreen and low maintenance'],
  'Temple Tree': ['Fragrant flowers over a long season', 'Very drought tolerant once established', 'Sculptural branching even when leafless'],
  'White Temple Tree': ['Fragrant white flowers over a long season', 'Very drought tolerant once established', 'Traditional favourite for temples and gardens'],
  'Temple Tree White': ['Fragrant white flowers over a long season', 'Very drought tolerant once established', 'Traditional favourite for temples and gardens'],
  Bougainvillea: ['Masses of colourful bracts for months', 'Thrives in full sun and heat', 'Drought tolerant; great for fences, arches and hedges'],
  'White Bougainvillea': ['Clean white bracts brighten walls and arches', 'Thrives in full sun and heat', 'Drought tolerant once established'],
  'Pink Bougainvillea': ['Long-lasting pink colour for fences and pergolas', 'Thrives in full sun and heat', 'Drought tolerant once established'],
  'Red Bougainvillea': ['Vivid red colour for fences and pergolas', 'Thrives in full sun and heat', 'Drought tolerant once established'],
  'Orange Bougainvillea': ['Warm orange colour for walls and arches', 'Thrives in full sun and heat', 'Drought tolerant once established'],
  'Yellow Bougainvillea': ['Bright yellow colour for walls and arches', 'Thrives in full sun and heat', 'Drought tolerant once established'],
  Hibiscus: ['Large blooms through most of the year', 'Flowers traditionally used in hair care and offerings', 'Attracts butterflies and bees'],
  Ixora: ['Dense clusters of flowers almost all year', 'Neat, compact shrub for hedges and borders', 'Attracts butterflies'],
  Caesalpinia: ['Showy flowers on a fast-growing shrub', 'Handles heat and poor soils', 'Attracts butterflies and birds'],
  'Caesalpinia Yellow': ['Bright yellow flowers on a fast-growing plant', 'Handles heat and poor soils', 'Attracts butterflies and birds'],
  Bauhinia: ['Orchid-like flowers and distinctive twin-lobed leaves', 'Good medium-sized tree for gardens and avenues', 'Attracts bees and birds'],
  Gulmohar: ['Spectacular red-orange canopy in summer', 'Wide, spreading crown for shade', 'Iconic avenue and campus tree'],

  // bamboo
  Bamboo: ['Very fast-growing green screen', 'Helps hold soil and control erosion', 'Useful as a natural windbreak'],
  'Multiplex Bamboo': ['Dense, clumping growth for living screens', 'Clumping habit stays where it is planted', 'Fast to establish and low maintenance'],
  'Clumping Bamboo': ['Forms dense privacy screens', 'Clumping habit stays where it is planted', 'Fast-growing and low maintenance'],

  // shade and native trees
  Neem: ['Dense, cooling shade', 'Leaves traditionally used as a natural insect repellent', 'Very hardy and drought tolerant'],
  Kadamba: ['Fast-growing shade tree', 'Fragrant ball-shaped flowers', 'Sacred tree in Indian tradition'],
  Mahogany: ['Tall, long-lived avenue tree', 'Valued for high-quality timber', 'Broad crown gives good shade'],
  Arjun: ['Large, long-lived shade tree', 'Bark valued in traditional Ayurveda', 'Grows well along water bodies and avenues'],
  Terminalia: ['Tiered branches give layered shade', 'Fast-growing for avenues and campuses', 'Hardy in warm climates'],
  Banyan: ['Huge, spreading canopy for deep shade', 'Supports birds and wildlife with its figs', 'Sacred, very long-lived tree'],
  Peepal: ['Sacred tree in Indian tradition', 'Supports birds and wildlife with its figs', 'Large, long-lived shade tree'],
  Pongamia: ['Hardy, fast-growing shade tree', 'Seeds yield oil used traditionally', 'Fixes nitrogen and improves the soil'],
  Teak: ['Valued for durable, high-quality timber', 'Tall, straight trunk', 'Long-term investment tree for farms and estates'],
  Palmyra: ['Very hardy and drought tolerant', 'Provides fruit, sap and leaves for many traditional uses', 'Iconic tree of the Andhra landscape'],

  // fruit
  Mango: ['Delicious seasonal fruit', 'Large, evergreen tree with good shade', 'Long-lived and productive for decades'],
  'Kesari Mango': ['Prized, aromatic Kesar mangoes', 'Large, evergreen tree with good shade', 'Long-lived and productive for decades'],
  Avocado: ['Nutritious fruit rich in healthy fats', 'Evergreen tree with glossy foliage', 'Grows well in warm climates with good drainage'],
  'Green Malayan Coconut': ['Tender coconut water and coconuts', 'Dwarf variety that bears early', 'Every part of the palm has a use'],
  'Yellow Malayan Coconut': ['Tender coconut water and coconuts', 'Dwarf variety that bears early', 'Golden fronds and nuts look ornamental'],
  'Malaysian Coconut': ['Coconut water and coconuts', 'Productive palm for home gardens and farms', 'Every part of the palm has a use'],
  'Thai Red Papaya': ['Sweet, red-fleshed fruit', 'Fruits within about a year of planting', 'Fruit rich in vitamins A and C'],
  Amla: ['Fruit is one of the richest natural sources of vitamin C', 'Widely used in Ayurveda', 'Hardy and drought tolerant'],
  'Black Jamun': ['Seasonal purple fruit', 'Fruit and seeds used in traditional remedies', 'Large, evergreen shade tree'],
  'White Jamun': ['Unusual pale, juicy fruit', 'Evergreen tree with dense foliage', 'Attracts birds'],
  Jamun: ['Seasonal purple fruit', 'Fruit and seeds used in traditional remedies', 'Large, evergreen shade tree'],
  'Water Apple Red': ['Crisp, juicy, bell-shaped fruit', 'Ornamental red fruit and glossy leaves', 'Compact tree for home gardens'],
  Sapota: ['Sweet, caramel-flavoured fruit', 'Evergreen tree that fruits more than once a year', 'Hardy in warm climates'],
  Ramaphal: ['Sweet, custardy fruit', 'Hardy, low-maintenance fruit tree', 'Suits home gardens and orchards'],
  'Laxman Phal': ['Distinctive fruit traditionally valued in India', 'Evergreen tree with glossy leaves', 'Suits home gardens and orchards'],
  Litchi: ['Sweet, fragrant seasonal fruit', 'Handsome evergreen canopy', 'Long-lived, productive tree'],
  Mulberry: ['Sweet berries for fresh eating and jams', 'Fast-growing and hardy', 'Leaves are the food of silkworms'],
  Noni: ['Fruit used in traditional health drinks', 'Hardy, evergreen shrub-tree', 'Tolerates poor and salty soils'],
  'Star Fruit': ['Star-shaped, tangy fruit', 'Fruits more than once a year', 'Compact, ornamental tree'],
  Pomegranate: ['Juicy, nutritious fruit', 'Handles heat and dry conditions', 'Ornamental orange-red flowers'],
  'Sweet Orange': ['Juicy citrus fruit rich in vitamin C', 'Fragrant white blossom', 'Glossy evergreen foliage'],
  'Thai Lemon': ['Juicy lemons for the kitchen', 'Bears well in containers and gardens', 'Fragrant blossom and evergreen leaves'],
  'Yeregate Lemon': ['Lemons for the kitchen', 'Fragrant blossom and evergreen leaves', 'Suits home gardens'],
  'Milk Fruit': ['Sweet, milky-fleshed fruit', 'Attractive two-toned leaves', 'Evergreen ornamental tree'],
  'Red Jackfruit': ['Large, sweet fruit with red-toned flesh', 'Big shade-giving evergreen tree', 'Highly productive once mature'],
  Tamarind: ['Tangy pods used widely in Indian cooking', 'Long-lived, wind-firm shade tree', 'Very drought tolerant'],
  Anjir: ['Sweet figs, fresh or dried', 'Compact tree for home gardens', 'Handles heat and dry spells'],
  'Barberry Cherry': ['Small, tangy fruits', 'Compact plant for home gardens', 'Attracts birds'],
  'Apple Bear': ['Small, sweet fruits', 'Hardy and drought tolerant', 'Compact plant for home gardens'],
};

// general benefits for each catalogue category (used when a plant has no entry above)
const byCategory = {
  'indoor-plants': ['Brings greenery to indoor spaces', 'Suited to indoor light', 'Easy care with regular light watering'],
  'plants-with-decorative-stands': ['Several potted plants in one compact display', 'Decorative lighting makes it an evening feature', 'Pots lift out, so plants can be changed with the season'],
  'outdoor-plants': ['Adds structure and greenery to gardens', 'Suited to outdoor sun and heat', 'Low maintenance once established'],
  'flowering-plants': ['Seasonal colour for beds and borders', 'Attracts bees and butterflies', 'Brightens entrances and pathways'],
  'ornamental-topiary-plants': ['Living sculpture that stays green year-round', 'Instant focal point for entrances and formal gardens', 'Shape is kept with regular trimming'],
  'avenue-shade-trees': ['Dense shade that cools streets and buildings', 'Helps filter dust and reduce noise', 'Shelter for birds and wildlife'],
  'fruit-plants': ['Home-grown fruit in season', 'Shade and greenery for the garden', 'Attracts birds and pollinators'],
  'native-forest-trees': ['Native tree suited to the local climate', 'Supports local birds and wildlife', 'Long-lived, shade-giving canopy'],
  'ground-cover-landscape-plants': ['Covers bare soil and suppresses weeds', 'Softens edges, borders and slopes', 'Low maintenance once established'],
};

export function plantBenefits(name, categorySlug) {
  return byName[name] || byCategory[categorySlug] || [];
}

// "Care at a glance" in the plant dialog: general sunlight and watering guidance for each category, with a
// few plants that clearly differ listed by name, plus the plant's form from the catalogue's growthForm field.
const careByCategory = {
  'indoor-plants': { sun: 'Bright, indirect light', water: 'When the topsoil feels dry' },
  // a stand holds a mix of potted plants, so the guidance is per pot rather than for one species
  'plants-with-decorative-stands': { sun: 'Bright light with some morning sun', water: 'Each pot when its topsoil feels dry' },
  'outdoor-plants': { sun: 'Full sun to light shade', water: 'Regular until established' },
  'flowering-plants': { sun: 'Full sun for best flowers', water: 'Regular; let the topsoil dry' },
  'ornamental-topiary-plants': { sun: 'Full sun to partial shade', water: 'Regular, evenly moist soil' },
  'avenue-shade-trees': { sun: 'Full sun', water: 'Regular until established' },
  'fruit-plants': { sun: 'Full sun', water: 'Regular, more when fruiting' },
  'native-forest-trees': { sun: 'Full sun', water: 'Regular until established' },
  'ground-cover-landscape-plants': { sun: 'Sun to partial shade', water: 'Regular, evenly moist soil' },
};
const careByName = {
  'Snake Plant': { sun: 'Low to bright light', water: 'Sparingly; let the soil dry out' },
  Peperomia: { water: 'Sparingly; let the soil dry out' },
  Alocasia: { water: 'Keep lightly moist, never soggy' },
  'Temple Tree': { water: 'Sparingly once established' },
  'White Temple Tree': { water: 'Sparingly once established' },
  'Temple Tree White': { water: 'Sparingly once established' },
  Palmyra: { water: 'Very little once established' },
  'Date Palm': { water: 'Light; drought tolerant once established' },
  'Washingtonia Palm': { water: 'Light; drought tolerant once established' },
};
for (const n of ['Bougainvillea', 'White Bougainvillea', 'Pink Bougainvillea', 'Red Bougainvillea', 'Orange Bougainvillea', 'Yellow Bougainvillea']) {
  careByName[n] = { water: 'Sparingly once established' };
}

const FORM_LABELS = {
  palm: 'Palm',
  'large-tree': 'Large tree',
  'medium-tree': 'Medium tree',
  'tree-identity-unconfirmed': 'Tree',
  'shrub-or-herb': 'Shrub',
  'trained-ornamental': 'Trained ornamental',
  'indoor-ornamental': 'Indoor foliage plant',
  'clumping-grass': 'Clumping grass',
  'large-tropical-herb': 'Large tropical plant',
  'fruiting-herb': 'Fruiting plant',
  'mixed-plant-arrangement': 'Potted plants on a stand',
};

export function plantCare(plant, categorySlug) {
  const base = careByCategory[categorySlug] || {};
  const own = careByName[plant.name] || {};
  return {
    sun: own.sun || base.sun,
    water: own.water || base.water,
    form: FORM_LABELS[plant.imagePresentation?.growthForm],
  };
}
