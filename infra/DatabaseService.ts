import Stripe from 'stripe';
import { ParticipantInformationDTO } from '../types';

export interface DatabaseService {
  getReservedSeats: () => Promise<{ totalParticipantsCount: number }>;
  saveRegistrant: (registrant: Stripe.Customer) => Promise<any>;
  saveCheckoutSession: (
    checkoutSession: Stripe.Checkout.Session,
    participants: ParticipantInformationDTO[],
    secretUrlId?: string
  ) => Promise<any>;
  updateCheckoutSession: (session: Stripe.Checkout.Session) => Promise<any>;
  updatePaymentIntent: (paymentIntent: Stripe.PaymentIntent) => Promise<any>;
  updateCharge: (charge: Stripe.Charge) => Promise<any>;
  saveCharge: (charge: Stripe.Charge) => Promise<any>;
  savePaymentIntent: (sessionData: any) => Promise<any>;
  getSessions: () => Promise<{ data: { session: { id: string; paymentIntent: string } }[] }>;
}
