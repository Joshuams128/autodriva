export type PaymentType = 'upfront' | 'post-service' | 'free';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number | null;
  paymentType: PaymentType;
}

export const SERVICES: Service[] = [
  {
    id: 'detailing',
    name: 'Detailing',
    description: 'Full interior and exterior auto detailing.',
    duration: 180,
    price: null,
    paymentType: 'upfront',
  },
  {
    id: 'mobile-mechanic',
    name: 'Mobile Mechanic',
    description: 'On-site mechanical service at your location.',
    duration: 90,
    price: null,
    paymentType: 'post-service',
  },
  {
    id: 'consultant',
    name: 'Consultant',
    description: 'Automotive consulting and advice.',
    duration: 60,
    price: null,
    paymentType: 'post-service',
  },
  {
    id: 'vehicle-viewing',
    name: 'Vehicle Viewing',
    description: 'Free showroom viewing of available inventory.',
    duration: 30,
    price: null,
    paymentType: 'free',
  },
  {
    id: 'custom',
    name: 'Custom/Other',
    description: 'Custom service — described in booking notes.',
    duration: 60,
    price: null,
    paymentType: 'post-service',
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
