import { registrationTypes } from './registrationTypes';

export type RegistrationType = {
  value: string;
  label: string;
  price: number;
  optionalComment?: string;
};

export const appConfig = {
  registrationTypes,
  defaultRegistrationType: registrationTypes[0],
  paymentWindowMinutes: 30,
  keys: {
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    faunaSecret: process.env.FAUNA_SERVER_SECRET!,
    mongoUri: process.env.MONGO_URI!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripeWebhookSecret: process.env.WEBHOOK_SECRET!
  },
  ff: {
    registration: true,
    sponsors: true
  },
  seatAvailability: 200,
  secretUrls: ['936058d8-eb5e-4d6d-b3dc-af30488859b4'],
  boothLocations: [
    {
      name: 'Lecture Hall Booth',
      price: 1200
    },
    { name: 'Exhibit Hall Booth', price: 1000 },
    { name: 'Additional rep', price: 350 }
  ],
  sponsorshipPreferences: [
    {
      name: 'Prime',
      price: 6000,
      disc: 50
    },
    {
      name: 'Platinum',
      price: 5000,
      disc: 40
    },
    {
      name: 'Gold',
      price: 4000,
      disc: 30
    },
    {
      name: 'Silver',
      price: 3000,
      disc: 20
    },
    {
      name: 'Bronze',
      price: 2000
    }
  ],
  generalSupport: [
    { name: 'wi-fi', label: 'Wi-Fi', price: 1000 },
    {
      name: 'resident sponsorship',
      label: 'Resident sponsorship (registration for 10)',
      price: 2500
    },
    { name: 'sponsored lecture', label: 'Sponsored Lecture ', price: 3000 },
    { name: 'av services', label: 'A/V Services*', price: 2000 },
    { name: 'continental breakfast', label: 'Continental breakfast* ', price: 2000 },
    { name: 'plated lunch', label: 'Plated lunch* ', price: 3000 },
    { name: 'reception jazz band', label: 'Reception JAZZ BAND*', price: 2000 },
    { name: 'reception food', label: 'Reception food*', price: 3000 },
    { name: 'reception drinks', label: 'Reception drinks* ', price: 3000 }
  ],
  marketingOpportunities: [
    { name: 'Packet inserts', price: 1000 },
    { name: 'Attendee list', price: 200 },
    { name: 'Meeting bag*', price: 2000 },
    { name: 'Lanyards*', price: 2000 },
    { name: 'Badges*', price: 2500 },
    { name: 'Pen on meeting bags*', price: 1000 },
    { name: 'Proceedings - Full page', price: 1000 },
    { name: 'Proceedings - ½ page', price: 750 },
    { name: 'Proceedings - Back covers', price: 2000 }
  ]
};
