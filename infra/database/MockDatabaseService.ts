import Stripe from 'stripe';
import { ParticipantInformationDTO } from '../../types';
import { DatabaseService } from '../DatabaseService';

export class MockDatabaseService implements DatabaseService {
  getReservedSeats() {
    return Promise.resolve({ totalParticipantsCount: 30 });
  }
  saveRegistrant(registrant: Stripe.Customer) {
    return Promise.resolve({ data: { customerId: registrant.id } });
  }
  saveCheckoutSession(
    checkoutSession: Stripe.Checkout.Session,
    participants: ParticipantInformationDTO[],
    secretUrlId?: string
  ) {
    return Promise.resolve();
  }
  updateCheckoutSession(session: Stripe.Checkout.Session) {
    return Promise.resolve({});
  }
  updatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    return Promise.resolve({});
  }
  updateCharge(charge: Stripe.Charge) {
    return Promise.resolve({});
  }
  saveCharge(charge: Stripe.Charge) {
    return Promise.resolve({});
  }
  savePaymentIntent = (sessionData: any) => Promise.resolve({});
  async getSessions() {
    return { data: [] };
  }
}
