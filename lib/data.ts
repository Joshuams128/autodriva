export interface SubService {
  title: string;
  img: string;
  desc: string;
  included: string[];
}

export const SUB_SERVICES: Record<string, SubService> = {
  'oil-change': {
    title: 'Oil Service',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    desc: "Keep your engine running smooth with a professional oil change performed at your location. We use manufacturer-recommended oil grades and genuine filters to protect your engine for the miles ahead. Whether you drive a daily commuter or a performance vehicle, we have you covered.",
    included: [
      'Drain & replace engine oil (conventional, synthetic, or high-mileage)',
      'Genuine OEM or equivalent oil filter replacement',
      'Multi-point visual inspection (belts, hoses, fluid levels)',
      'Top-off washer fluid & tire pressure check',
    ],
  },
  'tire-care': {
    title: 'Tire Care',
    img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80',
    desc: "Your tires are the only contact between your vehicle and the road — don't neglect them. Our mobile tire care service includes rotation, balancing, and pressure optimization to extend tire life and improve handling. We come to you and get it done fast.",
    included: [
      'Tire rotation (all 4 tires, torqued to spec)',
      'Wheel balance check and correction',
      'Tire pressure inflation to OEM specs',
      'Tread depth & sidewall condition inspection',
    ],
  },
  'brakes-service': {
    title: 'Brakes Service',
    img: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=1600&q=80',
    desc: "Don't wait until you hear the squeal. Our mobile brake service covers everything from pad replacement to rotor inspection — keeping your stopping power at 100%. Safety is our top priority, and we make brake service as convenient as possible.",
    included: [
      'Brake pad inspection and replacement (front and/or rear)',
      'Rotor thickness measurement and resurfacing recommendation',
      'Brake fluid level check and flush if needed',
      'Caliper slide pin lubrication and brake hardware inspection',
    ],
  },
  'diagnostic-service': {
    title: 'Diagnostic Service',
    img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&q=80',
    desc: "Check engine light on? Don't guess — let us diagnose it properly. We use professional-grade OBD-II scanners to read fault codes across all major vehicle systems. You'll get a clear, honest report and recommended next steps — no upselling, no jargon.",
    included: [
      'Full OBD-II system scan across all modules',
      'Fault code retrieval, analysis, and explanation',
      'Live data monitoring (engine, transmission, emissions)',
      'Written diagnostic report with recommended service plan',
    ],
  },
  'fluid-services': {
    title: 'Fluid Services',
    img: 'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=1600&q=80',
    desc: "Your vehicle relies on a variety of fluids to operate safely and efficiently. Over time, these fluids degrade and can cause serious damage if neglected. Our mobile fluid service covers everything under the hood — inspected, flushed, and refilled at your convenience.",
    included: [
      'Transmission fluid flush and refill',
      'Coolant (antifreeze) drain and fill',
      'Power steering fluid inspection and top-off',
      'Brake fluid flush and replacement to DOT spec',
    ],
  },
  'filter-services': {
    title: 'Filter Services',
    img: 'https://images.unsplash.com/photo-1551522435-a13538f08ae1?w=1600&q=80',
    desc: "Clean filters mean a healthier engine, better air quality inside your cabin, and improved fuel efficiency. We inspect and replace all major filters on your vehicle, using high-quality replacements that meet or exceed OEM specifications.",
    included: [
      'Engine air filter inspection and replacement',
      'Cabin air filter replacement (improves AC & heat quality)',
      'Oil filter replacement (included with oil service)',
      'Fuel filter inspection and replacement where applicable',
    ],
  },
};

export interface Package {
  name: string;
  tag: string;
  price: string;
  items: string[];
  featured: boolean;
}

export const PKGS: Package[] = [
  {
    name: 'Basic',
    tag: 'A solid refresh',
    price: 'Starting at $99',
    featured: false,
    items: [
      'Exterior hand wash & dry',
      'Interior vacuum & wipe-down',
      'Window cleaning (in & out)',
      'Tire shine & dressing',
    ],
  },
  {
    name: 'Premium',
    tag: 'Deep interior detail with added protection',
    price: 'Starting at $199',
    featured: true,
    items: [
      'Everything in Basic',
      'Clay bar decontamination',
      'Deep interior steam clean',
      'Leather conditioning',
      'Paint sealant application',
    ],
  },
  {
    name: 'Platinum',
    tag: 'A full top-to-bottom transformation',
    price: 'Starting at $349',
    featured: false,
    items: [
      'Everything in Premium',
      'Machine polish & paint correction',
      'Ceramic coating prep',
      'Engine bay detailing',
      'Odor elimination treatment',
      'Full interior protection package',
    ],
  },
];

export interface CarCard {
  make: string;
  model: string;
  year: number;
  color: string;
}

export const CAR_CARDS: CarCard[] = [
  { make: 'Mercedes-Benz', model: 'C-Class AMG',    year: 2022, color: '#c9a84c' },
  { make: 'BMW',           model: 'M4 Competition', year: 2023, color: '#2c5f9e' },
  { make: 'Audi',          model: 'RS6 Avant',      year: 2022, color: '#2a2a2a' },
  { make: 'Porsche',       model: 'Cayenne GTS',    year: 2023, color: '#8b2a2a' },
  { make: 'Lexus',         model: 'IS 500 F Sport', year: 2023, color: '#2a5c2a' },
  { make: 'Tesla',         model: 'Model S Plaid',  year: 2024, color: '#1a1a1a' },
];
