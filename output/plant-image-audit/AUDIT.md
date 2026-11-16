# Plant image audit — 16 November 2026

## Scope and outcome
- 146 active catalogue entries inspected, plus 8 legacy product records (154 primary records).
- 15 outdoor mirror records checked and synchronised. The three default indoor component definitions were also inspected; the live page supplies catalogue records.
- 55 active entries had misleading pot-bound landscape/fruiting presentation corrected (48 unique named subjects; repeated entries share replacement frames).
- 8 legacy indoor image assignments corrected to match their named plants, while retaining a container-grown presentation.
- 56 replacement frames delivered in 7 versioned WebP sheets. All original images remain untouched; original data snapshots are in this directory.
- 91 active entries retained in containers. This includes compact stock, trained ornamentals and unresolved nursery identities.
- 35 active entries (29 distinct names) require nursery identity/cultivar review. These are not counted as botanically verified.
- No catalogue record declares actual sale height, container volume or grafting stage. Landscape images are labelled references, not representations of the product size supplied.

## Architecture and all image surfaces
React/Vite uses local data, not an image API or database. src/data/plantCatalogue.json drives PlantsPage → IndoorPlants → PlantFrame for both cards and native detail dialogs. Search filters these same records; there is no separate related-plant image source or individual detail route. PlantFrame preserves shared-sheet caching and lazy loading.
src/data/products.js is legacy data referenced by navbar search; ProductCard/PlantModal can still consume it. Their images were misassigned (e.g. Monstera pointed to a snake plant); their sheet-aware rendering now uses corrected indoor frames.
src/data/outdoorPlants.json is an unused mirrored data source; its presentation metadata and sheet mapping now match the live catalogue. plantCatalogGroups.json stores category/name lists only. plantImageSubjects.json and prompt manifests are generation inputs, not business records.
Home category cards and category dialogs share public/categories/plants-atlas.webp. Its ground-grown shade/native scenes and compact container scenes were retained.
GalleryPage and LivingArchive share src/data/gallery.js: 12 records reviewed, including nursery ficus/bougainvillea stock, palms, coconut and ground-planted avenues. Existing photographed container stock retained; provenance was not independently verified.
AboutPage shares gallery palms, nursery.webp and service atlases. Services uses two illustrative atlases containing ground-grown landscapes, planting and small stock. PlantCare uses four contextual images. Hero uses a grounded banyan composited with ground/foliage layers; no pot. These contextual assets were reviewed in site-contact-sheet.jpg and retained.
About hero desktop/mobile scenes and founder photographs were also reviewed in context-review.jpg; their planted landscapes and small hand-held plants were retained. No image-generation script existed. Replacements used built-in image_gen; full prompt set and source mapping are in replacement-prompts.json. No dependency installation or architecture change.

## Large-tree replacements
Gulmohar, Neem, Kadamba, Badham, Ganuga, Akasamalli, Arjun, Mango, Avocado, Black Jamun, Sapota, Litchi, Red Jackfruit, Tamarind, Banyan, Peepal, Medi, Teak, Jamun

## Palm and tropical replacements
Red Wax Palm, Triangular Palm, Traveller Palm, Royal Palm, Foxtail Palm, Washingtonia Palm, Date Palm, Dismarkia Palm, Green Malayan Coconut, Yellow Malayan Coconut, Malaysian Coconut, Thai Red Papaya, Palmyra

## Fruit-category replacements
Mango, Avocado, Green Malayan Coconut, Yellow Malayan Coconut, Malaysian Coconut, Thai Red Papaya, Amla, Black Jamun, Sapota, Ramaphal, Litchi, Mulberry, Noni, Star Fruit, Pomegranate, Sweet Orange, Milk Fruit, Red Jackfruit, Tamarind, Jammi, Laxman Phal, Anjir, Pamparapanasa

## Other medium/flowering replacements
Temple Tree, White Temple Tree, Temple Tree White, Bauhinia, Amla, Ramaphal, Mulberry, Noni, Star Fruit, Pomegranate, Sweet Orange, Milk Fruit, Jammi, Laxman Phal, Anjir, Pamparapanasa

## Intentionally retained in containers
Mickey Green, Peperomia, Alocasia, Red Bottle Brush, Green Bottle Brush, Ashoka, Multiplex Bamboo, Bamboo, Bougainvillea, White Bougainvillea, Pink Bougainvillea, Red Bougainvillea, Orange Bougainvillea, Yellow Bougainvillea, Hibiscus, Ixora, Zephyr Lily â€“ Pink, Zephyr Lily â€“ Yellow, Iris â€“ White, Caesalpinia, Ficus Multi Balls, Black Ficus, Panda Ficus, Paradox Ficus, Pencil Cut Ficus, Nuda Ficus, Apollo Ficus, Ujjaini Three Step Ficus, Ficus Two Step, Ficus Three Step, Nuda Ficus Triangle, Nuda Ficus Cone, Malpighia Ball, Malpighia Shapes, Spiral, Ball, Heart, Dolphin, Elephant, Giraffe, Peacock, Crane Bird, Lady Doll, Fountain, Shiva Lingam, Deer, Star, Multi-tier, Turai, Gangaravi, Ponna, Philicia, Caesalpinia Yellow, Golden Bottle Brush, Terminalia, Mahogany, Kaya, Bogada, Kesari Mango, Pandure Mamidi, Cotton Jamun, White Jamun, Japanese Jama, Black Jama, Water Apple Red, Bathhai, Yeregate Lemon, Thai Lemon, Apple Bear, Barberry Cherry, Sapedha Jama, Pongamia, Liriope, Ophiopogon, Disodia, Zephyr Lily, Iris White, Duranta, Croton, Snake Plant, Clumping Bamboo

Mahogany is retained as young stock (the existing generation input explicitly describes a sapling), as are compact Pongamia stock and small bamboo clumps. Ficus topiary is classified by its trained form, not converted to a mature tree merely because Ficus can grow large. This avoids changing young nursery products into landscape-tree representations.

## Botanical/manual review
Green Bottle Brush, Ashoka, Black Ficus, Panda Ficus, Paradox Ficus, Nuda Ficus, Apollo Ficus, Ujjaini Three Step Ficus, Turai, Gangaravi, Ponna, Philicia, Golden Bottle Brush, Terminalia, Kaya, Bogada, Kesari Mango, Pandure Mamidi, Cotton Jamun, White Jamun, Japanese Jama, Black Jama, Bathhai, Yeregate Lemon, Thai Lemon, Apple Bear, Barberry Cherry, Sapedha Jama, Disodia

Philicia remains only a possible Filicium decipiens. Kaya, Paradox Ficus and Yeregate Lemon remain unresolved. Cultivar-specific fruit appearance cannot be established by generation alone. No botanical names were changed. Coconut, papaya and fruit varieties are visual references, not cultivar certificates. All generated replacements also need nursery sign-off if used as exact stock identification.

## Classification and framing
Every active entry now has imagePresentation: growthForm, maturity, displayStyle, allowNurseryPot, actualProductSize, identityStatus, cellAspectRatio and label. Decisions consider category, stored descriptions, original subject cues, visible architecture and lack of product-size data; not name matching alone.
Cards and dialogs use a 4:5 outer stage with the entire native cell centred inside it. The inner crop selects the sheet cell only. Width-only image sizing retains intrinsic proportions; the previous forced object-fit:fill and fixed sheet height were removed. Square source frames are letterboxed rather than stretched or zoomed into portrait. Tablet grids use two columns.
Earlier failed replacement drafts with cropped crowns were rejected and are not referenced by the application.

## Sources used for growth-form checks
- https://www.nparks.gov.sg/florafaunaweb/flora/2/8/2899 (banyan)
- https://www.nparks.gov.sg/florafaunaweb/flora/2/6/2682 (royal palm)
- https://www.nparks.gov.sg/florafaunaweb/flora/2/7/2733 (jackfruit)
- https://www.nparks.gov.sg/florafaunaweb/flora/5/6/5618 (coconut)
- https://www.nparks.gov.sg/florafaunaweb/flora/3/0/3013 (mango)
- https://www.kew.org/plants/travellers-palm (traveller's palm)
These support growth forms, not certification of every generated leaf or cultivar.

## Files modified
src/data/plantCatalogue.json; src/data/outdoorPlants.json; src/data/products.js; src/components/PlantFrame.jsx; src/components/IndoorPlants.jsx; src/components/IndoorPlants.css; src/components/Collection.jsx; src/components/PlantModal.jsx. Seven new public/plants/catalogue/*-v2*.webp sheets, plus this audit directory. No existing image files overwritten.

## Validation
Data validation passed for all 146 catalogue entries: IDs/order/names and all non-image business fields unchanged; no records deleted; every referenced sheet decodes; every cell index is valid; presentation policy is internally consistent.
Full record-by-record before/after paths and decisions: record-audit.json.
Build/lint and browser results are recorded in validation-results.txt after final checks. No type-check script is configured.
