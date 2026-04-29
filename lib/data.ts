export interface SubService {
  title: string;
  img: string;
  desc: string;
  included: string[];
  bookingUrl?: string;
  hideServicesList?: boolean;
}

export const SUB_SERVICES: Record<string, SubService> = {
  'oil-change': {
    title: 'Oil Service',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    desc: "Fast and professional oil changes with high-quality oil and filters — essential for maintaining engine health and performance.",
    included: [
      'Fast and professional oil changes with high-quality oil and filters — essential for maintaining engine health and performance.',
      'CA$55.00 • 30 min',
      'We value your time and ours. To ensure fairness, any appointment cancelled with less than 24 hours\' notice will be subject to a $25 mechanic service cancellation fee.',
    ],
    bookingUrl: 'https://book.squareup.com/appointments/wazwjp7f3hixp6/location/L3JJQK4G945KD/services/6H2UNZ33IRZT4XDVEPKVRXLZ?savt=f018e636-7543-48b6-a3c9-8b0eb905198e',
    hideServicesList: true,
  },
  'tire-care': {
    title: 'Tire Care',
    img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80',
    desc: "Your tires are the only contact between your vehicle and the road — don't neglect them. Our mobile tire care service includes seasonal changeover, repairs, inspection, rotation, balancing, and pressure optimization to extend tire life and improve handling. We come to you and get it done fast.",
    included: [
      'Tire Service (on rims) - ~$40–80 (approx. $10–20/tire) • 30 min - Seasonal tire changeover with inspection and proper torque — stay safe and ready for any weather.',
      'Tire Repair - Quoted locally; not standardized • 30 min - Professional tire repair service with specialized assessment and repair.',
      'Tire Inspection & Rotation - Add-on • 30 min - ADD-ON TO TIRE SERVICE. Inspection and rotation service to keep your tires in optimal condition.',
    ],
    bookingUrl: 'https://book.squareup.com/appointments/aufyywl5cmmzqn/location/L3JJQK4G945KD/services',
  },
  'brakes-service': {
    title: 'Brakes Service',
    img: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=1600&q=80',
    desc: "Ensure your safety with professional brake inspections, repairs, and replacements. We keep your braking system responsive and reliable for every stop.",
    included: [
      'Ensure your safety with professional brake inspections, repairs, and replacements. We keep your braking system responsive and reliable for every stop.',
      'Price varies • 1 hr 15 min',
      'We value your time and ours. To ensure fairness, any appointment cancelled with less than 24 hours\' notice will be subject to a $25 mechanic service cancellation fee.',
    ],
    bookingUrl: 'https://book.squareup.com/appointments/opfnn7sfjwyixt/location/L3JJQK4G945KD/services/7YK4RLD4NVIAIUSFLPHR467N?savt=f018e636-7543-48b6-a3c9-8b0eb905198e',
    hideServicesList: true,
  },
  'diagnostic-service': {
    title: 'Diagnostic Service',
    img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&q=80',
    desc: "Full computer scan of your vehicle to identify engine codes, warning lights, and performance issues with clear repair recommendations.",
    included: [
      'Full computer scan of your vehicle. Identifies engine codes, warning lights, and performance issues. Clear repair recommendations based on findings.',
      'Price varies • 30 min',
      'We value your time and ours. To ensure fairness, any appointment cancelled with less than 24 hours\' notice will be subject to a $25 mechanic service cancellation fee.',
    ],
    hideServicesList: true,
  },
  'fluid-services': {
    title: 'Fluid Services',
    img: '/imgs/fluid.jpg',
    desc: "Your vehicle relies on a variety of fluids to operate safely and efficiently. Over time, these fluids degrade and can cause serious damage if neglected. Our mobile fluid service covers everything under the hood — inspected, flushed, and refilled at your convenience.",
    included: [
      'Power Steering Fluid Exchange - Flushes old power steering fluid and refills with fresh fluid to maintain smooth, responsive steering. Price: (In-store quote)',
      'Differential / Transfer Case Fluid Service - Replaces worn fluid in your drivetrain to protect gears and maintain proper function in AWD or 4×4 systems. Price: (In-store quote)',
      'Transmission Fluid Exchange - Replaces worn fluid in your drivetrain to protect gears and maintain proper function in AWD or 4×4 systems. Price: (In-store quote)',
      'Coolant / Radiator Flush - Removes old coolant and replaces it to help prevent overheating and protect the engine\'s cooling system. Price: (In-store quote)',
    ],
    bookingUrl: 'https://book.squareup.com/appointments/h51s4wa6kn4y5h/location/L3JJQK4G945KD/services',
  },
  'filter-services': {
    title: 'Filter Services',
    img: '/imgs/filter.jpg',
    desc: "Clean filters mean a healthier engine, better air quality inside your cabin, and improved fuel efficiency. We inspect and replace all major filters on your vehicle, using high-quality replacements that meet or exceed OEM specifications.",
    included: [
      'Engine Air Filter - Keeps dust and debris out of the engine, improving performance and fuel efficiency. (In-store quote)',
      'Cabin Air Filter - Filters air entering the vehicle\'s cabin to maintain fresh, clean air for passengers. (In-store quote)',
      'Fuel Filter - Prevents contaminants from reaching your engine through the fuel system, helping ensure reliable performance. (In-store quote)',
    ],
    bookingUrl: 'https://book.squareup.com/appointments/48da9bxyqpvh1b/location/L3JJQK4G945KD/services',
  },
};

export interface Package {
  name: string;
  tag: string;
  price: string;
  items: string[];
  featured: boolean;
  bookingUrl?: string;
}

export const PKGS: Package[] = [
  {
    name: 'Basic',
    tag: 'Sedan $80–$120, SUV $120–$140 (based on vehicle condition)',
    price: 'Starting at $80',
    featured: false,
    bookingUrl: 'https://book.squareup.com/appointments/325xcdqpna1ef5/location/L3JJQK4G945KD/services/6SETKZ6OR7IDYB3E2AENRXGE?savt=f018e636-7543-48b6-a3c9-8b0eb905198e',
    items: [
      'Hand wash & rinse',
      'Wheel & tire cleaning',
      'Vacuum seats, floor & trunk',
      'Wipe down interior surfaces',
      'Interior window cleaning',
      'Tire shine',
    ],
  },
  {
    name: 'Premium',
    tag: 'Sedan $150, SUV $180',
    price: 'Starting at $150',
    featured: true,
    bookingUrl: 'https://book.squareup.com/appointments/325xcdqpna1ef5/location/L3JJQK4G945KD/services/3XXEGAYL6KN7RLMMWWZR2EIX',
    items: [
      'Everything in the Basic Package',
      'Floor mat & carpet cleaning',
      'Leather cleaning & conditioning',
      'Interior protectant',
      'Vents & console wipe-down',
      'Door jamb cleaning',
      'Interior dressing',
    ],
  },
  {
    name: 'Platinum',
    tag: 'Sedan $240–$260, SUV $260–$280 (based on vehicle condition)',
    price: 'Starting at $240',
    featured: false,
    bookingUrl: 'https://book.squareup.com/appointments/325xcdqpna1ef5/location/L3JJQK4G945KD/services/B533NIG56N5A7XWSGLE2ZHDE?savt=f018e636-7543-48b6-a3c9-8b0eb905198e',
    items: [
      'Everything in the Premium Package',
      'Steam cleaning for interior surfaces',
      'Clay bar treatment',
      'Paint sealant or wax',
      'Polishing or buffing',
      'Windshield rain repellent',
      'Engine bay cleaning',
      'Headlight restoration',
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
