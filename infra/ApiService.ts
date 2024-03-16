import axios from 'axios';
import {
  CreateParticipantCheckoutSesssionPayloadDTO,
  VendorCheckoutSessionPayload
} from '../types';
import { loadStripe } from '@stripe/stripe-js';
import { appConfig } from '../domain/config/appConfig';
import { SeatAvailabilityData } from '../domain/databaseService';

class ApiService {
  constructor(private publishableKey: string) {
    this.getParticipantsCount = this.getParticipantsCount.bind(this);
    this.createVendorCheckoutSession = this.createVendorCheckoutSession.bind(this);
    this.createParticipantsCheckoutSession = this.createParticipantsCheckoutSession.bind(this);
  }
  saveUserToBeNotified(email: string, name: string) {
    return axios.post('/api/notify-user', { email, name }).then((res) => res.data);
  }
  getParticipantsCount() {
    return axios.get<SeatAvailabilityData>('/api/available-seats').then((res) => res.data);
  }

  async createVendorCheckoutSession(payload: VendorCheckoutSessionPayload) {
    const stripe = await loadStripe(this.publishableKey);
    const checkoutSession = await axios.post('/api/create-stripe-session', payload);
    if (!stripe) {
      throw new Error('stripe is not ready');
    }
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  async createParticipantsCheckoutSession(payload: CreateParticipantCheckoutSesssionPayloadDTO) {
    const stripe = await loadStripe(this.publishableKey);
    const checkoutSession = await axios.post('/api/create-stripe-participants-session', payload);
    if (!stripe) {
      throw new Error('stripe is not ready');
    }
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}

export const apiService = new ApiService(appConfig.keys.stripePublishableKey);
