import { MumbaiHotel } from '../types';

export const MUMBAI_HOTELS: MumbaiHotel[] = [
  {
    id: 'taj-mahal-palace',
    name: 'The Taj Mahal Palace, Mumbai',
    chain: 'Taj / IHCL',
    neighborhood: 'Colaba, South Mumbai',
    zone: 'South Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India',
    pinCode: '400001',
    phone: '+91 22 6665 3366',
    email: 'reservations.tajmumbai@ihcltata.com',
    rating: 4.9,
    reviewCount: 14280,
    starRating: 5,
    tagline: 'Iconic 1903 heritage palace overlooking the Gateway of India & Arabian Sea',
    startingPrice: 26500,
    featuredTag: 'Iconic Heritage',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Gateway of India View',
      'Arabian Sea Facing',
      'Outdoor Landscaped Pool',
      'Jiva Signature Spa',
      '24/7 Butler Service',
      '9 Fine Dining Venues',
      'Valet Parking',
      'Complimentary High-Speed WiFi',
      'Heritage Palace Tour'
    ],
    diningVenues: [
      { name: 'Wasabi by Morimoto', cuisine: 'Contemporary Japanese', specialty: 'White fish carpaccio, Black Cod miso', timing: '12:30 - 15:00, 19:00 - 23:45' },
      { name: 'Shamiana', cuisine: 'All-Day International & Indian', specialty: 'Taj signature club sandwich, Dum Biryani', timing: '24 Hours' },
      { name: 'Golden Dragon', cuisine: 'Authentic Sichuan & Cantonese', specialty: 'Dim sum lunches, Peking duck', timing: '12:30 - 15:00, 19:00 - 23:30' },
      { name: 'Masala Kraft', cuisine: 'Classic Indian Coastal & Awadhi', specialty: 'Atta Chicken, Tawa Pomfret', timing: '12:30 - 15:00, 19:00 - 23:30' },
      { name: 'Sea Lounge', cuisine: 'High Tea & Afternoon Delights', specialty: 'Artisanal teas, Mumbai street chaat luxury tasting', timing: '11:00 - 23:00' }
    ],
    roomTypes: [
      {
        id: 'taj-sup',
        name: 'Heritage Superior Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 420,
        basePrice: 26500,
        taxRate: 0.18,
        features: ['City View', 'Italian Marble Bathroom', 'Heritage Teak Furnishing', 'Pillow Menu'],
        availableCount: 6,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'taj-deluxe-sea',
        name: 'Deluxe Sea Facing Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 500,
        basePrice: 38000,
        taxRate: 0.18,
        features: ['Unobstructed Arabian Sea View', 'Gateway of India Panorama', 'Deep Soaking Tub', 'Complimentary High Tea'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'taj-club-suite',
        name: 'Taj Club Executive Suite',
        category: 'Executive Suite',
        bedType: '1 Super King Bed',
        capacity: 3,
        sizeSqFt: 850,
        basePrice: 72000,
        taxRate: 0.18,
        features: ['Taj Club Lounge Access', 'Round-trip Airport Chauffeur', 'Dedicated Butler', 'Evening Cocktails'],
        availableCount: 3,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'taj-presidential',
        name: 'Tata Presidential Grand Suite',
        category: 'Presidential Suite',
        bedType: '2 King Master Bedrooms',
        capacity: 4,
        sizeSqFt: 2100,
        basePrice: 195000,
        taxRate: 0.18,
        features: ['360° Arabian Sea View', 'Private Dining Salon', 'Personal Chef on Call', 'Mercedes-Maybach Airport Transfer'],
        availableCount: 1,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Gateway of India', distance: '0.1 km (1 min walk)' },
      { label: 'Colaba Causeway Market', distance: '0.4 km (5 mins walk)' },
      { label: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', distance: '2.8 km (10 mins drive)' },
      { label: 'Mumbai Airport (BOM)', distance: '24 km (45 mins via Coastal Rd)' }
    ]
  },
  {
    id: 'oberoi-mumbai',
    name: 'The Oberoi, Mumbai',
    chain: 'Oberoi Hotels & Resorts',
    neighborhood: 'Nariman Point, Marine Drive',
    zone: 'South Mumbai',
    address: 'Nariman Point, Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra 400021, India',
    pinCode: '400021',
    phone: '+91 22 6632 5757',
    email: 'reservations.mumbai@oberoihotels.com',
    rating: 4.9,
    reviewCount: 9840,
    starRating: 5,
    tagline: 'Modern luxury overlooking the Queen’s Necklace and Marine Drive',
    startingPrice: 23500,
    featuredTag: 'Marine Drive View',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Queen’s Necklace Ocean View',
      'Heated Outdoor Pool',
      'The Oberoi 24-hr Spa',
      '24-hr Personal Butler',
      'Fine Italian & Indian Dining',
      'Fitness Center with Bay View',
      'Luxury Sedan Airport Transfer',
      'Free High-Speed WiFi'
    ],
    diningVenues: [
      { name: 'Ziya', cuisine: 'Innovative Indian by Vineet Bhatia', specialty: 'Koliwada Fish, Wild Mushroom Khichdi', timing: '12:30 - 14:30, 19:00 - 23:30' },
      { name: 'Vetro & Enoteca', cuisine: 'Contemporary Italian & Wine Library', specialty: 'Truffle risotto, Handcrafted pastas', timing: '19:00 - 23:30' },
      { name: 'Fenix', cuisine: 'All-Day World Cuisine', specialty: 'Japanese sushi counter, Woodfired pizzas', timing: '06:30 - 23:30' },
      { name: 'The Eau Bar', cuisine: 'Sunset Cocktails & Jazz', specialty: 'Signature gin cocktails, Sea view terrace', timing: '17:00 - 01:30' }
    ],
    roomTypes: [
      {
        id: 'ob-luxury',
        name: 'Deluxe City View Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 450,
        basePrice: 23500,
        taxRate: 0.18,
        features: ['Floor-to-Ceiling Windows', 'Freestanding Bathtub with Ocean View', 'Bose SoundTouch System'],
        availableCount: 5,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ob-premier-ocean',
        name: 'Premier Ocean View Room',
        category: 'Deluxe King',
        bedType: '1 California King Bed',
        capacity: 2,
        sizeSqFt: 550,
        basePrice: 32000,
        taxRate: 0.18,
        features: ['Full Arabian Sea & Marine Drive Sunset View', 'Electronic Blackout Blinds', 'Marble Shower'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ob-exec-suite',
        name: 'Oberoi Executive Suite',
        category: 'Executive Suite',
        bedType: '1 Super King Bed',
        capacity: 3,
        sizeSqFt: 900,
        basePrice: 62000,
        taxRate: 0.18,
        features: ['Separate Living Room & Dining Area', 'Complimentary Airport Transfer', '24-hr Butler'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Marine Drive Promenade', distance: '0.1 km (Direct walk)' },
      { label: 'Wankhede Cricket Stadium', distance: '1.2 km (5 mins)' },
      { label: 'Nariman Point Business Towers', distance: '0.2 km (2 mins walk)' },
      { label: 'Mumbai Airport (BOM)', distance: '23 km (40 mins drive)' }
    ]
  },
  {
    id: 'st-regis-mumbai',
    name: 'The St. Regis Mumbai',
    chain: 'Marriott Bonvoy / St. Regis',
    neighborhood: 'Lower Parel, Central Mumbai',
    zone: 'Lower Parel & Worli',
    address: '462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013, India',
    pinCode: '400013',
    phone: '+91 22 6162 8000',
    email: 'reservations.mumbai@stregis.com',
    rating: 4.8,
    reviewCount: 8900,
    starRating: 5,
    tagline: 'India’s tallest luxury hotel connected directly to Palladium luxury mall',
    startingPrice: 19500,
    featuredTag: 'Luxury Sky High',
    heroImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Skyline View of Mumbai & Sea Link',
      'Connected to Palladium Mall',
      'The St. Regis Signature Butler Service',
      'Iridium Luxury Spa & Salon',
      'Outdoor 10th Floor Pool',
      'Asilo Level 38 Rooftop Bar',
      '24/7 Concierge & Chauffeur Fleet',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'By The Mekong', cuisine: 'Fine Pan-Asian Level 37', specialty: 'Peking Duck, Dim Sum, Vietnamese Sea Bass', timing: '12:00 - 15:00, 19:00 - 23:45' },
      { name: 'Seven Kitchens', cuisine: 'Grand International Buffet', specialty: 'Live cooking theatres, Seafood Sunday Brunch', timing: '06:30 - 23:30' },
      { name: 'The Sahib Room & Kipling Bar', cuisine: 'Royal Awadhi & Mughlai', specialty: 'Nalli Nihari, Kakori Kebab', timing: '12:30 - 15:00, 19:00 - 23:30' },
      { name: 'Asilo', cuisine: 'Open-Air Rooftop Bar (Level 38)', specialty: 'Signature cocktails, Panoramic Mumbai skyline views', timing: '17:30 - 01:30' }
    ],
    roomTypes: [
      {
        id: 'st-deluxe',
        name: 'Deluxe City View Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 480,
        basePrice: 19500,
        taxRate: 0.18,
        features: ['City Skyline View', 'St. Regis Butler Service', 'Deep Soaking Tub', 'Remède Amenities'],
        availableCount: 7,
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'st-premier-sealink',
        name: 'Premier Sea Link View Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 520,
        basePrice: 28000,
        taxRate: 0.18,
        features: ['Bandra-Worli Sea Link & Ocean View', 'High Floor Guarantee', 'Complimentary Garment Pressing'],
        availableCount: 5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'st-stregis-suite',
        name: 'The St. Regis Grand Suite',
        category: 'Executive Suite',
        bedType: '1 King Bed',
        capacity: 3,
        sizeSqFt: 980,
        basePrice: 58000,
        taxRate: 0.18,
        features: ['Level 32+ Panoramic Views', 'Walk-in Wardrobe', 'Private Dining Nook', 'Airport Luxury Pick-up'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Palladium & High Street Phoenix', distance: 'Direct Internal Access' },
      { label: 'Bandra-Worli Sea Link', distance: '3.5 km (10 mins)' },
      { label: 'Bandra Kurla Complex (BKC)', distance: '9 km (18 mins)' },
      { label: 'Mumbai Airport (BOM)', distance: '15 km (28 mins)' }
    ]
  },
  {
    id: 'jw-marriott-juhu',
    name: 'JW Marriott Mumbai Juhu',
    chain: 'Marriott Bonvoy',
    neighborhood: 'Juhu Beach, Western Suburbs',
    zone: 'Bandra & Juhu Coast',
    address: 'Juhu Tara Road, Juhu Beach, Mumbai, Maharashtra 400049, India',
    pinCode: '400049',
    phone: '+91 22 6693 3000',
    email: 'jwmarriott.juhu@marriott.com',
    rating: 4.8,
    reviewCount: 11200,
    starRating: 5,
    tagline: 'Celebrated beachfront resort directly on Juhu Beach with 3 infinity pools',
    startingPrice: 18000,
    featuredTag: 'Beachfront Resort',
    heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Direct Juhu Beach Access',
      '3 Outdoor Lagoon & Saltwater Pools',
      'Quan Signature Spa',
      'Celebrity Favorite Dining',
      '24-Hour Fitness Centre',
      'Kids Play Club',
      'Beachside Sun Loungers',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'Lotus Cafe', cuisine: 'Famous 24/7 Buffet & Sunday Brunch', specialty: 'Global buffet, Seafood spreads, Live pasta station', timing: '24 Hours' },
      { name: 'Dashanzi', cuisine: 'Progressive Asian & Gin Bar', specialty: 'Handcrafted dim sums, Sashimi platters', timing: '19:00 - 01:00' },
      { name: 'Mezzo Mezzo', cuisine: 'Authentic Italian', specialty: 'Wood-fired Neapolitan pizzas, Truffle pasta', timing: '19:00 - 23:30' },
      { name: 'Saffron', cuisine: 'North Indian & Awadhi Royal', specialty: 'Raan-e-Awadh, Dal Makhani', timing: '12:30 - 15:00, 19:00 - 23:30' }
    ],
    roomTypes: [
      {
        id: 'jw-deluxe',
        name: 'Deluxe City View Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 430,
        basePrice: 18000,
        taxRate: 0.18,
        features: ['City & Palm View', 'Aromatherapy Associates Amenities', 'Work Desk'],
        availableCount: 6,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'jw-ocean',
        name: 'Ocean View Beachfront Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 480,
        basePrice: 26000,
        taxRate: 0.18,
        features: ['Arabian Sea Sunset View', 'Private Balcony Area', 'Deep Soaking Tub'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'jw-suite',
        name: 'Executive Ocean View Suite',
        category: 'Executive Suite',
        bedType: '1 King Bed',
        capacity: 3,
        sizeSqFt: 880,
        basePrice: 52000,
        taxRate: 0.18,
        features: ['Full Juhu Beachfront Panorama', 'Executive Lounge Access', 'Complimentary Airport Transfer'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Juhu Beach Promenade', distance: 'Direct beach gate' },
      { label: 'Prithvi Theatre', distance: '1.1 km (4 mins)' },
      { label: 'Bandra Bandstand & Linking Rd', distance: '7 km (15 mins)' },
      { label: 'Mumbai Airport (BOM)', distance: '6.5 km (15 mins)' }
    ]
  },
  {
    id: 'itc-maratha',
    name: 'ITC Maratha, Mumbai - Luxury Collection',
    chain: 'ITC Hotels / Marriott Luxury Collection',
    neighborhood: 'Andheri East, Airport Area',
    zone: 'Airport & North Mumbai',
    address: 'Sahar Airport Road, Andheri East, Mumbai, Maharashtra 400099, India',
    pinCode: '400099',
    phone: '+91 22 2830 3030',
    email: 'reservations.itcmaratha@itchotels.in',
    rating: 4.8,
    reviewCount: 9400,
    starRating: 5,
    tagline: 'Grand Indo-Saracenic & Maratha royal heritage 5 minutes from Mumbai Airport T2',
    startingPrice: 14500,
    featuredTag: 'Near International Airport',
    heroImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      '5 Minutes from Mumbai Airport T2',
      'Legendary Peshawri & Dum Pukht Dining',
      'Kaya Kalp - The Royal Spa',
      'Outdoor Swimming Pool in Courtyard',
      'Complimentary Airport Shuttle Service',
      'LEED Platinum Certified Green Hotel',
      '24/7 Business Center',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'Peshawri', cuisine: 'North-West Frontier Barbecue', specialty: 'Dal Bukhara (simmered 18 hrs), Sikandari Raan, Tandoori Jhinga', timing: '12:30 - 14:45, 19:00 - 23:45' },
      { name: 'Dum Pukht', cuisine: 'Royal Awadhi Slow-Cooked Cuisine', specialty: 'Dum Biryani, Kakori Kebab, Shahi Tukda', timing: '19:00 - 23:30' },
      { name: 'Dakshin Coastal', cuisine: 'Authentic South Indian & Coastal', specialty: 'Meen Pollichathu, Appam with Stew', timing: '12:30 - 14:45, 19:00 - 23:30' },
      { name: 'The Peshwa Pavilion', cuisine: '24-hr Grand Glass-Ceiling Buffet', specialty: 'International & Mumbai midnight buffets', timing: '24 Hours' }
    ],
    roomTypes: [
      {
        id: 'itc-exec',
        name: 'Executive Club Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 400,
        basePrice: 14500,
        taxRate: 0.18,
        features: ['Soundproof Airport Glazing', 'Kaya Kalp Spa Toiletries', 'High-Speed Wi-Fi'],
        availableCount: 8,
        image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'itc-itc-one',
        name: 'ITC One Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 540,
        basePrice: 21500,
        taxRate: 0.18,
        features: ['Complimentary Airport Luxury Transfer', 'Lounge Hours with Hors d’oeuvres', 'Butler Service'],
        availableCount: 5,
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'itc-suite',
        name: 'Thanjavur & Maratha Royal Suite',
        category: 'Executive Suite',
        bedType: '1 Super King Bed',
        capacity: 3,
        sizeSqFt: 920,
        basePrice: 48000,
        taxRate: 0.18,
        features: ['Handcrafted Indian Antiques', 'Dining Hall', 'Complimentary 24-hr Airport Transfer'],
        availableCount: 2,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Mumbai Airport (Terminal 2 - International)', distance: '1.8 km (5 mins)' },
      { label: 'Mumbai Airport (Terminal 1 - Domestic)', distance: '4.5 km (10 mins)' },
      { label: 'Bandra Kurla Complex (BKC)', distance: '8 km (15 mins via Elevated Road)' },
      { label: 'Powai Business Hub', distance: '6 km (12 mins)' }
    ]
  },
  {
    id: 'taj-lands-end',
    name: 'Taj Lands End, Bandra, Mumbai',
    chain: 'Taj / IHCL',
    neighborhood: 'Bandstand, Bandra West',
    zone: 'Bandra & Juhu Coast',
    address: 'Bandstand, BJ Road, Bandra West, Mumbai, Maharashtra 400050, India',
    pinCode: '400050',
    phone: '+91 22 6668 1234',
    email: 'landsend.mumbai@tajhotels.com',
    rating: 4.8,
    reviewCount: 9100,
    starRating: 5,
    tagline: 'Prime Bandstand location overlooking the Bandra-Worli Sea Link and Arabian Sea',
    startingPrice: 17500,
    featuredTag: 'Sea Link & Sunset',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Direct Bandra Bandstand Oceanfront',
      'Spectacular Bandra-Worli Sea Link View',
      'Outdoor Landscaped Pool',
      'Jiva Spa by Taj',
      'House of Nomad Gastro Bar',
      'Minutes from Bandra Dining & Shopping',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'Ming Yang', cuisine: 'Sichuan & Cantonese Chinese', specialty: 'Crispy aromatic duck, Dim sums with view', timing: '12:30 - 15:00, 19:30 - 23:30' },
      { name: 'Masala Bay', cuisine: 'Contemporary Indian', specialty: 'Raan Masaledar, coastal curry specials', timing: '12:30 - 15:00, 19:30 - 23:30' },
      { name: 'Vista', cuisine: 'All-Day Ocean View Dining', specialty: 'Breakfast buffet, Woodfired pizzas', timing: '24 Hours' }
    ],
    roomTypes: [
      {
        id: 'tajle-deluxe',
        name: 'Deluxe City View Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 410,
        basePrice: 17500,
        taxRate: 0.18,
        features: ['Bandra Suburbs View', 'Taj Jiva Amenities', 'Marble Bath'],
        availableCount: 6,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'tajle-sea-facing',
        name: 'Luxury Sea Facing Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 460,
        basePrice: 25000,
        taxRate: 0.18,
        features: ['Full Arabian Sea & Sunset View', 'Sea Link Panorama', 'Deep Tub'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Bandra Bandstand Promenade', distance: 'Directly outside' },
      { label: 'Bandra-Worli Sea Link Entry', distance: '1.5 km (3 mins)' },
      { label: 'BKC Financial Center', distance: '8 km (15 mins)' },
      { label: 'Mumbai Airport (BOM)', distance: '12 km (25 mins)' }
    ]
  },
  {
    id: 'sofitel-bkc',
    name: 'Sofitel Mumbai BKC',
    chain: 'Accor / Sofitel',
    neighborhood: 'Bandra Kurla Complex (BKC)',
    zone: 'BKC Financial District',
    address: 'C-57, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
    pinCode: '400051',
    phone: '+91 22 6117 5000',
    email: 'h6451-re@sofitel.com',
    rating: 4.7,
    reviewCount: 6200,
    starRating: 5,
    tagline: 'French art de vivre blended with Indian elegance in Mumbai’s prime financial hub',
    startingPrice: 16000,
    featuredTag: 'BKC Financial Hub',
    heroImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Walking Distance to US Consulate & Jio World Centre',
      'SoSPA by Sofitel & Salon',
      'Open-Air Swimming Pool',
      'Indo-French Patisserie & Wine Bar',
      '24/7 Concierge & Executive Club Lounge',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'Jyran - Tandoor Dining & Lounge', cuisine: 'North-West Frontier Royal Cuisine', specialty: 'Galouti Kebab, Dal Jyran, Nihari', timing: '12:30 - 15:00, 19:00 - 23:30' },
      { name: 'Pondichéry Café', cuisine: 'All-Day Indo-French Buffet', specialty: 'French patisserie, Mumbai street breakfast', timing: '24 Hours' },
      { name: 'Tuskers - Speciality Pure Veg', cuisine: 'Authentic Pure Vegetarian Regional', specialty: 'Gujarati, Rajasthani & Marwari thalis', timing: '12:00 - 15:00, 19:00 - 23:00' }
    ],
    roomTypes: [
      {
        id: 'sof-luxury',
        name: 'Luxury King Room',
        category: 'Superior King',
        bedType: '1 Sofitel MyBed King',
        capacity: 2,
        sizeSqFt: 420,
        basePrice: 16000,
        taxRate: 0.18,
        features: ['Signature MyBed Comfort', 'Balmain Paris Amenities', 'Ergonomic Work Desk'],
        availableCount: 7,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sof-club',
        name: 'Club Millésime Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 480,
        basePrice: 23500,
        taxRate: 0.18,
        features: ['Club Millésime Lounge Access', 'Complimentary Evening Cocktails', 'Butler Service'],
        availableCount: 4,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Jio World Convention Centre', distance: '0.5 km (5 mins walk)' },
      { label: 'US Consulate Mumbai', distance: '0.4 km (4 mins walk)' },
      { label: 'Bandra-Kurla Diamond Bourse', distance: '0.8 km (8 mins walk)' },
      { label: 'Mumbai Airport (BOM)', distance: '9 km (18 mins)' }
    ]
  },
  {
    id: 'trident-nariman-point',
    name: 'Trident Hotel, Nariman Point, Mumbai',
    chain: 'Oberoi Group / Trident',
    neighborhood: 'Nariman Point, Marine Drive',
    zone: 'South Mumbai',
    address: 'CR 2, Nariman Point, Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra 400021, India',
    pinCode: '400021',
    phone: '+91 22 6632 4343',
    email: 'reservations.narimanpoint@tridenthotels.com',
    rating: 4.7,
    reviewCount: 7800,
    starRating: 5,
    tagline: 'Premier Marine Drive ocean promenade hotel in Mumbai’s historic financial heart',
    startingPrice: 15500,
    featuredTag: 'Marine Drive Promenade',
    heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Panoramic Marine Drive Ocean View',
      'Outdoor Pool Overlooking Arabian Sea',
      'Trident Signature Spa',
      '24-Hour Business Centre',
      'Walking Distance to NCPA Arts Center',
      'Free High-Speed Wi-Fi'
    ],
    diningVenues: [
      { name: 'Frangipani', cuisine: 'Mediterranean & Indian Bistro', specialty: 'Thin-crust pizzas, Sunday seafood brunch', timing: '07:00 - 23:30' },
      { name: 'India Jones', cuisine: 'Pan-Asian Flavours', specialty: 'Teppanyaki, dim sums, Thai curries', timing: '12:30 - 15:00, 19:30 - 23:45' },
      { name: 'The Opium Den', cuisine: 'Cocktail & Cigar Bar', specialty: 'Single malts, Classic Martinis', timing: '17:00 - 01:30' }
    ],
    roomTypes: [
      {
        id: 'tri-superior',
        name: 'Superior Room',
        category: 'Superior King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 380,
        basePrice: 15500,
        taxRate: 0.18,
        features: ['City View', 'Ergonomic Desk', 'Tea/Coffee Maker'],
        availableCount: 8,
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'tri-ocean',
        name: 'Trident Ocean View Room',
        category: 'Deluxe King',
        bedType: '1 King Bed',
        capacity: 2,
        sizeSqFt: 420,
        basePrice: 22000,
        taxRate: 0.18,
        features: ['Arabian Sea & Queen’s Necklace View', 'Bathtub', 'High-Speed Wi-Fi'],
        availableCount: 5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
      }
    ],
    distanceHighlights: [
      { label: 'Marine Drive Waterfront', distance: 'Directly in front' },
      { label: 'NCPA (National Centre for the Performing Arts)', distance: '0.2 km (2 mins walk)' },
      { label: 'Gateway of India', distance: '3 km (10 mins drive)' },
      { label: 'Mumbai Airport (BOM)', distance: '23 km (40 mins drive)' }
    ]
  }
];
