// Extra detail shown in the category modals on the homepage, keyed by category title.
// Every plant entry uses the same shape (light, care, sizes) and every pot entry uses
// (placement, weight, sizes), so the modals stay consistent across a section.

export const plantCategoryDetails = {
  'Indoor Plants': {
    intro: 'Easy-going foliage that settles happily into homes and offices. We grow shade-tolerant varieties that cope with indoor light, fans and air conditioning, and pot them ready to place.',
    facts: { light: 'Low to bright indirect', care: 'Easy', sizes: 'Table-top to 5 ft' },
    varieties: ['Snake Plant', 'Money Plant', 'Peace Lily', 'ZZ Plant', 'Areca Palm', 'Rubber Plant', 'Monstera'],
    bestFor: 'Living rooms, bedrooms, desks, reception areas and bright corridors.',
    tips: ['Water only when the top inch of soil is dry.', 'Rotate the pot every few weeks for even growth.', 'Wipe leaves occasionally to keep them glossy and dust-free.'],
  },
  'Outdoor Plants': {
    intro: 'Hardy foliage and garden favourites raised in the open, so they are already used to sun, rain and wind when they reach your garden, terrace or balcony.',
    facts: { light: 'Full sun to part shade', care: 'Easy to moderate', sizes: '1 ft to 8 ft' },
    varieties: ['Croton', 'Areca Palm', 'Dracaena', 'Ixora', 'Golden Cypress', 'Foxtail Palm', 'Duranta'],
    bestFor: 'Gardens, terraces, balconies, entrances and boundary planting.',
    tips: ['Water deeply in the morning during hot months.', 'Feed with compost every 6–8 weeks in the growing season.', 'Allow new plants a week of part shade before full sun.'],
  },
  'Flowering Plants': {
    intro: 'Seasonal colour and fragrance for every corner of the garden, from climbers that cover a wall to compact bloomers that brighten a balcony.',
    facts: { light: 'Full sun', care: 'Moderate', sizes: 'Bedding plants to 6 ft climbers' },
    varieties: ['Hibiscus', 'Bougainvillea', 'Jasmine', 'Rose', 'Ixora', 'Adenium', 'Plumeria'],
    bestFor: 'Garden beds, pergolas, walls, balconies and festive displays.',
    tips: ['Most bloom best with at least 5–6 hours of sun.', 'Deadhead spent flowers to encourage new buds.', 'Use a bloom-boosting feed before the flowering season.'],
  },
  'Ornamental & Topiary Plants': {
    intro: 'Sculpted shapes and striking foliage that bring structure to a space, from formal ball and spiral topiaries to colourful accent shrubs.',
    facts: { light: 'Full sun to part shade', care: 'Moderate, regular trimming', sizes: '2 ft to 7 ft forms' },
    varieties: ['Ball Topiary', 'Spiral Topiary', 'Ficus Panda', 'Murraya', 'Golden Cypress', 'Bonsai Ficus'],
    bestFor: 'Entrances, formal gardens, driveways, lobbies and event décor.',
    tips: ['Trim lightly and often to hold the shape.', 'Keep soil evenly moist but never waterlogged.', 'Turn potted topiaries for an even, balanced form.'],
  },
  'Avenue & Shade Trees': {
    intro: 'Well-rooted trees that grow into generous canopies, raised for avenues, campuses, layouts and larger gardens that need shade for years to come.',
    facts: { light: 'Full sun', care: 'Low once established', sizes: 'Saplings to 12 ft+' },
    varieties: ['Neem', 'Rain Tree', 'Gulmohar', 'Pongamia', 'Tabebuia', 'Peltophorum', 'Bottle Brush'],
    bestFor: 'Avenues, campuses, layouts, farmhouses, parking areas and parks.',
    tips: ['Plant at the start of the monsoon for the best establishment.', 'Stake young trees until the roots take hold.', 'Water weekly through the first two summers.'],
  },
  'Fruit Plants': {
    intro: 'Healthy grafted and seedling fruit plants for a backyard tree, a terrace orchard or a full farm planting, chosen to suit local growing conditions.',
    facts: { light: 'Full sun', care: 'Moderate', sizes: 'Grafts to fruiting-size plants' },
    varieties: ['Mango', 'Guava', 'Sapota', 'Lemon', 'Pomegranate', 'Jamun', 'Custard Apple'],
    bestFor: 'Home gardens, terraces, farmhouses and orchards.',
    tips: ['Grafted plants fruit sooner than seedlings.', 'Mulch around the base to hold moisture.', 'Prune after harvest to keep trees productive.'],
  },
  'Native & Forest Trees': {
    intro: 'Indigenous trees that support birds, pollinators and healthy soil, ideal for afforestation, woodland planting and natural landscapes.',
    facts: { light: 'Full sun', care: 'Low once established', sizes: 'Saplings to 10 ft' },
    varieties: ['Peepal', 'Banyan', 'Teak', 'Arjuna', 'Indian Rosewood', 'Jamun', 'Mahua'],
    bestFor: 'Afforestation drives, farm boundaries, institutions and green belts.',
    tips: ['Native trees adapt well to local rainfall.', 'Plant in groups to create a woodland effect.', 'Protect young saplings from grazing animals.'],
  },
  'Ground Cover & Landscape Plants': {
    intro: 'Low greenery, grasses and edging plants that knit a landscape together, cover bare soil and give beds a finished look.',
    facts: { light: 'Sun to part shade', care: 'Easy', sizes: 'Plugs, trays and pots' },
    varieties: ['Mexican Grass', 'Wedelia', 'Purple Heart', 'Liriope', 'Fountain Grass', 'Portulaca', 'Mondo Grass'],
    bestFor: 'Lawns, borders, slopes, pathways and large landscape beds.',
    tips: ['Plant closely for quicker, even coverage.', 'Keep watering steady until runners spread.', 'Trim edges to keep borders crisp.'],
  },
};

export const potCategoryDetails = {
  'Plastic Pots': {
    intro: 'Lightweight, durable and budget-friendly planters for daily use, available in a wide range of shapes, colours and sizes.',
    facts: { placement: 'Indoor & outdoor', weight: 'Very light', sizes: '4 in to 24 in' },
    styles: ['Round', 'Square', 'Self-watering', 'Window boxes', 'Nursery pots', 'Matching saucers'],
    bestFor: 'Balconies, windowsills, terraces and frequently moved plants.',
    tips: ['Check for drainage holes before planting.', 'Choose lighter colours for sunny spots to keep roots cool.', 'Easy to clean and stack when not in use.'],
  },
  'Ceramic Pots': {
    intro: 'Glazed planters with smooth finishes and timeless forms that turn a favourite plant into a feature piece.',
    facts: { placement: 'Mostly indoor', weight: 'Medium to heavy', sizes: '4 in to 18 in' },
    styles: ['Glossy glaze', 'Matte finish', 'Hand-painted', 'Table-top', 'With saucer', 'Bowl planters'],
    bestFor: 'Living rooms, offices, gifting and table-top styling.',
    tips: ['Use a saucer to protect floors and furniture.', 'Add a layer of pebbles at the base for drainage.', 'Wipe with a damp cloth to keep the glaze bright.'],
  },
  'Cement Pots': {
    intro: 'Heavy, weather-resistant planters with solid textures and architectural shapes, made to stay put outdoors for years.',
    facts: { placement: 'Outdoor', weight: 'Heavy', sizes: '12 in to 36 in' },
    styles: ['Square', 'Cylinder', 'Bowl', 'Pedestal', 'Textured', 'Washed stone'],
    bestFor: 'Gardens, entrances, driveways, courtyards and large plants.',
    tips: ['Position before filling, as they are heavy to move.', 'Ideal for trees and tall plants that need a stable base.', 'Seal the inside to reduce moisture loss.'],
  },
  'Terracotta / Clay Pots': {
    intro: 'Breathable, earthy classics in natural clay that keep roots cool and healthy, with the warm character of traditional pottery.',
    facts: { placement: 'Indoor & outdoor', weight: 'Medium', sizes: '4 in to 20 in' },
    styles: ['Classic round', 'Rimmed', 'Bowls', 'Hanging', 'Saucers', 'Handcrafted'],
    bestFor: 'Herbs, succulents, flowering plants and kitchen gardens.',
    tips: ['Clay breathes, so plants may need watering a little more often.', 'Soak new pots in water before planting.', 'A natural patina forms over time and adds character.'],
  },
  'Fibre Pots': {
    intro: 'Contemporary FRP planters that look substantial yet stay light, finished to hold their colour outdoors.',
    facts: { placement: 'Indoor & outdoor', weight: 'Light', sizes: '12 in to 48 in' },
    styles: ['Tall tapered', 'Cube', 'Rectangular trough', 'Round', 'Glossy', 'Matte'],
    bestFor: 'Lobbies, patios, entrances, offices and statement planting.',
    tips: ['Large sizes stay easy to move and rearrange.', 'Use a false bottom in tall pots to save soil.', 'Clean with mild soap and water.'],
  },
  'Designer & Decorative Pots': {
    intro: 'Sculptural planters with patterns, textures and finishes chosen to complement your interiors and make a statement.',
    facts: { placement: 'Mostly indoor', weight: 'Varies by design', sizes: '4 in to 24 in' },
    styles: ['Geometric', 'Fluted', 'Metallic', 'Hand-painted', 'Pedestal', 'Figurine'],
    bestFor: 'Living spaces, shelves, gifting, cafés and hospitality.',
    tips: ['Pair bold pots with simple foliage plants.', 'Use an inner nursery pot for easy watering.', 'Group three sizes together for a styled look.'],
  },
  'Hanging Pots': {
    intro: 'Suspended planters that lift trailing greenery to eye level and make the most of balconies, verandas and small spaces.',
    facts: { placement: 'Balconies & verandas', weight: 'Light', sizes: '6 in to 12 in' },
    styles: ['Chain hangers', 'Macramé', 'Coir baskets', 'Railing planters', 'Wall-mounted', 'Self-watering'],
    bestFor: 'Trailing plants, ferns, flowering annuals and compact spaces.',
    tips: ['Hang at a height that is easy to water.', 'Hanging pots dry faster, so check them often.', 'Use secure hooks rated for wet soil weight.'],
  },
  'Grow Bags & Nursery Bags': {
    intro: 'Practical, breathable containers for raising saplings, vegetables and nursery stock, with excellent drainage and root health.',
    facts: { placement: 'Terraces & farms', weight: 'Very light', sizes: '4 in to 24 in' },
    styles: ['Black poly bags', 'HDPE grow bags', 'Fabric grow bags', 'Rectangular beds', 'Bulk packs'],
    bestFor: 'Terrace farming, kitchen gardens, saplings and nursery planting.',
    tips: ['Fabric bags air-prune roots for stronger plants.', 'Fill with a light potting mix, not garden soil.', 'Fold and store neatly between seasons.'],
  },
};
