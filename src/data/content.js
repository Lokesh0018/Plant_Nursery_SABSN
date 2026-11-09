const IMG = 'https://lh3.googleusercontent.com/aida-public/'

export const contact = {
  phones: ['+91 9849936169', '+91 9490378689'],
  email: 'uppadakumaraswamy@gmail.com',
  whatsapp: '919849936169',
  address: 'Kadiam Mandalam, East Godavari, Andhra Pradesh, India',
  hours: 'Open Daily 8:00 AM – 6:30 PM',
}

export const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`
export const whatsappHref = (text) =>
  `https://wa.me/${contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const logo = `${IMG}AB6AXuB4w89T3ZJby1yB4C9dX_97URvJB0SnnTlNGoBW3bgZ94qLwipZSQkNx4kihoHKPrhot90lPrBZL3qv6YHfJIEKuBFCzvqHPXBbgzflzXL_ldfxxH6CuoG_Tdd_QuNKcKBcMUeEFvo0Xxlcrk3sx5Oow45uT_SCAxyf8hjIpgMqoOH1Qt3PNaBeEVTDXEwxb9kEyjtJt2jsFZpmsP7hIuQcEZMEjFoZsKJoYcw7tc4E`

export const navItems = [
  { id: 'home', label: 'Home', footer: 'Home Specimen Overview' },
  { id: 'about', label: 'About', footer: 'Heritage & Sanctuary Archive' },
  { id: 'collections', label: 'Our Plants', footer: 'Botanical Flora Catalog' },
  { id: 'services', label: 'Services', footer: 'Landscape & Estate Consultancy' },
  { id: 'gallery', label: 'Gallery', footer: 'Conservatory Gallery' },
  { id: 'contact', label: 'Contact', footer: 'Direct Nursery Communications' },
]

export const heroImage = {
  src: `${IMG}AB6AXuBygyQtzoEjuI-br1wVdc8wsLHY38pEcNG27P7dilHy6VirdejTQGEU59bGseev7FwhVZdJ3p2nVqCS8Gg8CgLgqWgH655GXCjW2zOD5MbUr-HaFvuzFA4DEXx9SCglllaF2QZ4sutbZlFdUFcg_ZZAXbVyntgnk5WAyOqpQ12gwy-wXC1haV06SDeCTpTMwZLP7E471INMzGiFYgKyWVsRrcPVjkHMO57zyqI6y_1X`,
  alt: 'Monstera Deliciosa and Ficus plants in an ivory ceramic planter inside a sunlit nursery conservatory.',
}

export const heroStats = [
  { value: '06', label: 'Horticultural Disciplines', note: 'Fruit, Flora, Timber, Lawn & Exotics' },
  { value: '100%', label: 'Acclimatized Stock', note: 'Certified root systems & grafting' },
]

export const categories = [
  {
    tag: 'Seasonal & Perennial',
    title: 'Flowering Plants',
    desc: 'Colorful blooms that bring life and beauty to every space. Featuring Hybrid Rose, Hibiscus, Bougainvillea, and Jasmine varieties.',
    enquiry: 'Flowering Plants',
    src: `${IMG}AB6AXuAch8rrzMb5FLn9-XJDLx6piphOL-2vlLj27ogD-TW6DZ_Pcbcf7i1eNhGht_tLnBTktE-To5rtIurQuEc4eAIp5npMdYJS4_z8VupfXcRHvyMSZ9Roh4EgLDUnNopd8T2mfsUyQDgK8tUXncw0Ci-3CZXJ-15wfzPQDRG4GUUj1wxKvQSB_XudHNwwztePyOzIB8qSbbblev74_63jz-zmWvyHCFAGvW-GukfTLe15`,
    alt: 'Flowering shrubs with hibiscus, bougainvillea and jasmine in morning sunlight at the nursery.',
  },
  {
    tag: 'High-Yield Grafted',
    title: 'Fruit Plants',
    desc: 'Healthy saplings for growing your own fresh fruits. Premium Grafted Mango, Taiwan Pink Guava, Cricket Ball Sapota, and Pomegranate.',
    enquiry: 'Fruit Plants',
    src: `${IMG}AB6AXuA27PZqbiIDwo6ufQuow_e5SUOZQnGmEMhg9Xu1lY6SAIGTm-Yp9jEYnqxPImbs24lxY7mhsMBdXLK9buKRFdadwdgyJffXgoCvtUxQ16A3tkh8q9N98vN_EZp8MRi291H0D8_p0psVxS2DLSS88G5KdCnoi_DVOhKwI9FNkOy6DY5IhJdcF2p8lSkza0YlHQnBAHbrcaaLH7DIc9Rykf0_Qd5QJTGsLR1n9C7CSELJ`,
    alt: 'Rows of grafted mango, guava, sapota and pomegranate saplings.',
  },
  {
    tag: 'Estate & Patio Foliage',
    title: 'Ornamental Plants',
    desc: 'Beautiful greenery for homes, gardens, and landscapes. Robust Areca Palms, variegated Dracaena, and colorful Crotons.',
    enquiry: 'Ornamental & Indoor',
    src: `${IMG}AB6AXuBEIFHtw36nCubXNVXsuvm8e1Hqzypi3cPYc4fcYwkGJhD5ZwHAA6HTaqZjxUwCzQX-Q1iLnkNz0WPFM_I65g2IrNAu-r9bp453njd1TD_YJ6MQoBPfYsovngidIPOKV8Rv8ieiZkheo1abWj_XuhBbuLbVmCGfnABhCycvZjYGft-_Fsj-YcTvYXJtv5Q9KVLtNxKQiaLXSoz6mtP1Pw514kU7g8kTov_SDXje_Td6`,
    alt: 'Variegated Aglaonema, Areca palms and Dracaena in a garden setting.',
  },
  {
    tag: 'Commercial Agro-Forestry',
    title: 'Revenue Plants',
    desc: 'Quality timber and commercial species grown for agricultural investment. Teak, Red Sanders (Rakta Chandanam), Bamboo, and Melia Dubia.',
    enquiry: 'Revenue & Agro-Forestry',
    src: `${IMG}AB6AXuC3eFUbm6vGXlR940lggLVliAx7XtQ7CNEbYaHwjaRLJ2K4FqvHctzPV0Xxk_cXgbSiyVX1EvBuT2cQAq4g-X1g2oa1f4ZAWtRuI80kP5WG6ywyT4CWr9-FX1UXhptIjEWGgIPFe4BOOZ-LymjVCeNsS7bsc7NGtfgDPYMIl3Dg16yahjujMo1bQycP5G1ABDFEqqfKg3Yp3iRpSkwaM0tQiI42NC2SmuHT1OvvWC0u`,
    alt: 'Teak, Red Sanders and bamboo saplings standing in nursery beds.',
  },
  {
    tag: 'Low-Light Interiors',
    title: 'Indoor Plants',
    desc: 'Bring a refreshing touch of nature into your interiors. Resilient Peace Lily, Sansevieria Snake Plant, ZZ Plant, and creeping Philodendrons.',
    enquiry: 'Ornamental & Indoor',
    src: `${IMG}AB6AXuAjPzpAHwGo-j7SasGhqWBl00LjshBRUS1-9Xsr3-bGm-gVfDyelQ1WsX7WkHA2wth942mQkOMATqbdDocUU0K7yA5diKdtF25l-kneJP2hKH7DtXgI6KDpi72csZESchRfuByv6FArtrapnZ93RxdjkZLathqAuiAV3ds5ncvHflVrMwaIJul0OqzyPS-DZBp7OosWnscH1zIBEKbQn-DLB6lI_RawHac3pueJGuS7`,
    alt: 'Peace lilies, snake plants and philodendrons arranged in a sunlit interior.',
  },
  {
    tag: 'Turf & Groundcovers',
    title: 'Lawn & Garden Plants',
    desc: 'Everything needed to create pristine outdoor grounds. Mexican Grass carpets, Bermuda lawn rolls, Mondo Grass, and flowering borders.',
    enquiry: 'Lawn Development',
    src: `${IMG}AB6AXuCQiWcWGjAIicr-JYipHQT4T9_KLlHg5Sr9YkT3lF-dQyJ5OuZ5fdoifiYv_3laNPzhFzj4lOJrzxdDYdvoElnDTVMEC93esLU447mKTtNkc2HfE6K9DCee3Hmf4A30Gchgz-dL0ngyhfRYCJ5pPZT76XMOYHYUdxk9aumI1EYhHx4j5T-q3wfc_ONOocfhS-zFe6Gkwlok3cUAvMoYVtwBlpMF5mC_qw-lLQfLFBCt`,
    alt: 'Lawn turf rolls and carpet grass in golden afternoon light.',
  },
]

export const aboutImage = {
  src: `${IMG}AB6AXuCWsVAYWmbuoHbnVhf2EgGlg3ScX_r3o4vMZEe66AR5VWonpvyoCklLK9MfS_i4w5t4J-0gF1OTWuIqVw__ZYa_uVfgiHCKd-jMpDM_ju46WzNIWMZr6cQ9XCd-IJkP1xH5g-ENzb_Eh-oVVt4Nv-EFPX3yuxUYz318zDY8l8AUbLPMc7BKuGMQ8g3Cg4wBZ6FNFjfa3FzW8bzKlhOVj260No8AGvj3sEnT-uLv59nH`,
  alt: 'Greenhouse interior in Kadiam with rows of potted plants and mist in the sunbeams.',
}

export const pillars = [
  {
    icon: 'verified',
    title: 'Quality Plant Varieties',
    desc: 'Every sapling is propagated from healthy parent stock with established root systems suited for diverse regional soils.',
  },
  {
    icon: 'favorite',
    title: 'Passion for Growing',
    desc: 'Horticultural care rooted in generational knowledge, attentive watering, soil feeding, and natural growth stewardship.',
  },
  {
    icon: 'nature_people',
    title: 'Nature-Focused Approach',
    desc: 'Promoting sustainable greening, biodiversity enrichment, and carbon-capturing endemic shade tree multiplication.',
  },
  {
    icon: 'local_shipping',
    title: 'Reliable Plant Supply',
    desc: 'Dependable bulk order logistics, careful packing, and direct transportation to estates, farmhouses, and nurseries nationwide.',
  },
]

export const favorites = [
  {
    short: 'Ficus Lyrata',
    enquiry: 'Ornamental & Indoor',
    name: 'Ficus Lyrata (Fiddle Leaf)',
    desc: 'Celebrated for its broad, violin-shaped foliage and striking architectural upright silhouette. Acclimatized in semi-shade shade-houses for vigorous indoor transition.',
    family: 'Moraceae',
    sun: 'Bright Indirect Light',
    soil: 'Aerated Loam / Peat',
    growth: 'Architectural Upright',
    image: `${IMG}AB6AXuCDjyeokEBKz0T5XobqiQBuLSLJNPy5_xKzXMbIFUAnmdW71xNDcqxUif7W0jkqB4Ht95L4PMq8qp8grnolGzcLhuD7x7wARS92MJxm0x6NcVEqP8jNsYjjqHMIi8v7o1iC7xGgveB3izMHoKppWT3M8eNdZZ3r_EHonBZds2H4CdYEFBiAlPVPZz93f4dXoMf8_s5mDWo6hm7LNYVYloWfwra05DRHBFlV-w0N_RbM`,
    thumb: `${IMG}AB6AXuDMjt_ca8GwZphLMCvv9ynbKmvbRYkCFNoGOYZarBZU5R8jSmqrOR_Gogqf4_JJ3Izp5rTPEv_9MwSYvysQWzpZT_nW7j2DNz84eBM7Es0C8VYQbome5K-P2Lr2C1OGoW0ww5EhM8SERDtm57fLjpUgrJntnh73pm3anLYQE-YiLqeLjU9C1NOpJVXKmlRvZvernRqU2uTWcYq4LWFxO32U0Xml6ru-NfA5y9yVRPM_`,
    alt: 'Fiddle-leaf fig in a tall terracotta pot against an ivory wall in warm side light.',
  },
  {
    short: 'Alphonso Graft',
    enquiry: 'Fruit Plants',
    name: 'Grafted Alphonso & Banganapalli',
    desc: 'Superior nursery-grafted mango saplings grown from authentic scion wood. Exhibits rapid initial branching and early fruiting within 2 to 3 seasons.',
    family: 'Anacardiaceae',
    sun: 'Full Radiant Sunlight',
    soil: 'Well-Drained Red Soil',
    growth: 'Spreading Orchard Canopy',
    thumb: `${IMG}AB6AXuAVavxETzrxgZKdxqBqLXdOnekTWYX7jk0OlUfzUmUDY4wjsh5E-eH4Xy9mmDx6lTBt0vaIwM735LIBG95W-kqdWw01A6OcSdI9s_Zi983NnxgVm0ZogxRV2kdd-4yTcdxrmkTfm5i2DUFK2IRB0FxSGzn1eVKKQp9gVIjwQ0n6mvPMKdLHhv311Sua2HBvfORfWldptm60fWgxAEfcjspbu9JIdy3p_ZKhWR1wIwkM`,
    alt: 'Grafted mango sapling in a terracotta planter with fresh new-growth leaves.',
  },
  {
    short: 'Imperial Rosea',
    enquiry: 'Flowering Plants',
    name: 'Imperial Hybrid Bougainvillea',
    desc: 'Drought-hardy, perpetual flowering climber trained into bushy specimens. Produces cascading clusters of vivid papery bracts from autumn through summer.',
    family: 'Nyctaginaceae',
    sun: 'Direct Full Sun (6+ hrs)',
    soil: 'Porous Sandy-Loam',
    growth: 'Trailing Climber / Shrub',
    thumb: `${IMG}AB6AXuAiUGY06J4anCNSdjjsMC4wmb3qfxuMgqaEi9rbDu-bo3Nf9rNQfIRIQVZU0V6xAtXGp14Dkm-Ak4O38QQoHbVV-F_Tw_Q6tlVe6DKT_aKPTdcYIfscn0TafU3uMJDRbkLaFbnsneWten9q4e2B_RGbsDWDHMwIFLqkbzsraW4codL1lqsZ58pi2pJBsSf4uvPoK4Kj1hffY01YvOEnRxdx36qDXmhgaMWkA_WRZiTC`,
    alt: 'Hot-pink bougainvillea in full bloom in a ceramic courtyard planter.',
  },
  {
    short: 'Velvet Turf',
    enquiry: 'Lawn Development',
    name: 'Mexican Velvet Lawn Carpet',
    desc: 'Dense, fine-bladed natural turf grass forming an immaculate green carpet. Highly tolerant of coastal humidity and heat, perfect for villas and farmhouses.',
    family: 'Poaceae',
    sun: 'Full Sun to Light Shade',
    soil: 'Sandy Loam + Compost',
    growth: 'Creeping Dense Mat',
    thumb: `${IMG}AB6AXuD23cU2KmO92OeuIVCqVDf-gV2EiZya0ZUtOtcZiXTXoxKFFADxJYz2LDIsOOltUgJafIkGVuirU7G45RZx3aAKK0-U63V9dEcBHzOBORWNZP2gJA8piQveggLxlyfqoiZIwyIJCFYgfR_yD12YBCkVz6aR1dmZNdf0VAQ8x7P_Eg07_tmbf70C5oO3-7wVHRqhIKLx_r10w5SXpdeXs2em96LaOAKSA7_LeXJFedy4`,
    alt: 'Unrolled Mexican lawn grass turf showing its velvety texture.',
  },
]

export const services = [
  {
    title: 'Hybrid Flower Plant Growing',
    desc: 'Cultivating resilient, high-yield blooming varieties acclimated for intense tropical sunlight and rich petal density across seasons.',
    highlight: 'Bougainvillea, Hybrid Hibiscus & Exotic Jasmine',
  },
  {
    title: 'Fruit Plant Supply',
    desc: 'Certified grafted saplings ready for domestic kitchen gardens, agricultural orchards, and farm estates with verified rootstock vitality.',
    highlight: 'Grafted Mango varieties, Guava, Sweet Lime & Sapota',
  },
  {
    title: 'Natural Plant Supply',
    desc: 'Endemic native species, ecological boundary foliage, and broad shade-canopy trees to support healthy regional ecosystems and estates.',
    highlight: 'Neem, Badam, Gulmohar & Windbreak Specimen Trees',
  },
  {
    title: 'Revenue Plant Supply',
    desc: 'High-value timber, agro-forestry investments, and agro-commercial crops cultivated in bulk with rigorous clonal selection.',
    highlight: 'Burma Teak, Red Sanders, Bamboo & Malabar Neem',
  },
  {
    title: 'Lawn Development',
    desc: 'Natural turf grass installation, specialized sub-base soil enrichment, carpet grass laying, and rapid root establishment for pristine green lawns.',
    highlight: 'Mexican Grass, Korean Grass & Bermuda Groundcover',
  },
  {
    title: 'Gardening & Landscaping',
    desc: 'Comprehensive plant layout planning, organic soil conditioning, and horticultural advice for private estates, institutions, and farm villas.',
    highlight: 'Plant Selection, Placement Architecture & Growth Care',
  },
]

export const greenhouseImage = `${IMG}AB6AXuAXDtM39rTjzFZGxrB6OTkVIALUD_GJwrSINv7tiFSf0w0LHByURsRcFTfD1tGGdKxEjAS9DzRE8KjKAogG35uBnYXIBvv-P-j4qeqXiYXi1Nkkw4G7vWp--pmiE3YqJDB1bU5O9933jKPclkefTgzTM5lRwdJ_ojbYdn4NNtFmJ5pAlSFJhLoV9vhLx2vCT4oudByJ93cDqlmM1pb8FUVhEOdvdkJRBqKLRIojcHmN`

export const founder = {
  name: 'Uppada Kumaraswamy',
  src: `${IMG}AB6AXuD9tud5HjbmzyDT3rD8XZGP3ugsBkSaWfSlzjXCDNO3JC-2-tT_uYfdN4VIMYfDiGaDYXkskk40kaM1A0utpBhH73qdqiX64Ixxf58nhMran330AgN6-V-0F_U3NYbTuKCPwmc5Uqn_rGJlHwN8hlcZ5DiqhrbjRBFiThC7EhhiEqRVvLzj_K3rj0nbWS28Rh23JjAvGBXuNIkOYOuBdeaUrMRRCtykOl6GvFcB0Y23`,
  alt: 'Portrait of the nursery founder in warm daylight with a greenhouse in the background.',
}

export const gallery = [
  {
    span: 'lg:col-span-7 h-80',
    tag: 'Flowering Sanctuary',
    caption: 'Hybrid Bougainvillea Cultivars',
    src: `${IMG}AB6AXuBnhYoXANOvPV6SJ2fOOC5zjFcEHoMl_ROfODEyx12Q_yqQEtJbk4Iq9yiakxXafq1YgnkNJQD22eiTIKqnyrDNDpv1AUBLOaj8X3pIFpjhOC0UzmOjzyaaBgEIg1hco5WThjVwunziV3D1VKsFUuIxuPUo5Hrfk6U3XjTn8vMmay5NEQf7HLccHui2Xx2uehpVQ3vfCmqeJc-Jyihcg2yD_xhIyYQjlpbPs3DhaeXH`,
    alt: 'Bougainvillea arches covered in crimson and magenta flowers.',
  },
  {
    span: 'lg:col-span-5 h-80',
    tag: 'Field Rows',
    caption: 'Acclimatized Grafted Fruit Saplings',
    src: `${IMG}AB6AXuC16KQ_09b7pypraODBcnhGsjgs9hYlAnNCWmkURWmocVZ_mQZsREfim7i6vDnX2CARN9iTvLsNInF2fjdLGGNqZlEN9S75MGpcnWdewQrv_T9yQlT-Gs0NdwKSNOdkyeJGcSYEwJf2Xd7QG4FuOSbW6vJXBd6TKozN8oLRh9pD1xjRC-hd2cr3b1oQBJNxQyA_VYDttHd2DCjuy7VEC6wdKwLHG2zPvDNsR9HgkUpU`,
    alt: 'Grafted fruit saplings in black polybags under green shade netting.',
  },
  {
    span: 'lg:col-span-4 h-72',
    tag: 'Microclimate',
    caption: 'Sunbeams through Glasshouse',
    src: `${IMG}AB6AXuAmGBODH4vbisU71guaj5pk5Cey4Y3GoulLLpGuNhPOQaV0fSI2qesG7CeoQ6G8SgMGL9vk5yLN-vvF9_zB7qe9rVJ7xg03UDGebd9cBhjKYtkf_jA5pTFirK-xTCj43qH4OKXuyhoREUQ0T4dtodboRMd4v3sIlqOc66I8wkX_014EjXWygk7JXtWXPVZd-KktKEDf_e2QQ35IsI6Ekj53Fm5dhc3fyKbE_xv4bry4`,
    alt: 'Afternoon sunbeams through greenhouse glass lighting monsteras and palms.',
  },
  {
    span: 'lg:col-span-4 h-72',
    tag: 'Turf Development',
    caption: 'Natural Lawn Installation',
    src: `${IMG}AB6AXuCowZQWaYNChjLZykAgbK-NKFnxNnBS_nNDAeywyA6nofY1rIoUKuMqtRkk6z6RTxvmpuW4zAtVbNpU1miyesxwyojb6C3xIKPfEq3XT6oUSEJ1tT43X9irqF3PP3sNTiQD4wOCD1qyKIEQNYJv9QnI3Wu9XxUbow91u1mbNb-j5jrqBFk_C4udEk40UFWXwuSn1ZlEm-GiZyWKS6AsAN_svf4TAF0JoGuRlca77FLp`,
    alt: 'Manicured garden lawn framed by landscaped borders.',
  },
  {
    span: 'h-72 sm:col-span-2 lg:col-span-4',
    tag: 'Macro Detail',
    caption: 'Dewdrops on Ornamental Foliage',
    src: `${IMG}AB6AXuBMzRvUnK6i0FGvsKHVnRXOB3qkFSKBQcn2TnKqTMcaDZggSmkUzGUdEiTSqZLbbBi9wOnJ9SqPOm5EaEG7mmaBfok7iYwJuc-LXVEA568gaZCag_9PpHTtRTVMLkWKnSAgIYUqcsFHlIvRMj_iX9Sw2LrkZUNwZE-6lR0s9hMNq_qorqm98sMKIO8jrDsj6lEcUrpr8V2eu17dzxn_U9YX9fS7TL3YZn_oEYS0Nv1T`,
    alt: 'Close-up of morning dewdrops on deep green leaf veins.',
  },
]

export const enquiryOptions = [
  { value: 'Flowering Plants', label: 'Flowering Plants (Roses, Bougainvillea, Hibiscus)' },
  { value: 'Fruit Plants', label: 'Fruit Plants (Grafted Mango, Guava, Sapota)' },
  { value: 'Ornamental & Indoor', label: 'Ornamental & Indoor Plants' },
  { value: 'Revenue & Agro-Forestry', label: 'Revenue Plants (Teak, Red Sanders, Bamboo)' },
  { value: 'Lawn Development', label: 'Lawn Development & Turf Supply' },
  { value: 'Bulk Wholesale', label: 'Bulk Wholesale Nursery Supply' },
]
