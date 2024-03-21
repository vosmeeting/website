import axios, { AxiosError } from 'axios';
import {
  CreateParticipantCheckoutSesssionPayloadDTO,
  SeatAvailabilityDTO,
  VendorCheckoutSessionDTO
} from '../types';
import { loadStripe } from '@stripe/stripe-js';
import { appConfig } from '../domain/config/appConfig';

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
    return axios.get<SeatAvailabilityDTO>('/api/available-seats').then((res) => res.data);
  }

  async createVendorCheckoutSession(payload: VendorCheckoutSessionDTO) {
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
    // Load Stripe with the publishable key
    const stripe = await loadStripe(this.publishableKey);
    if (!stripe) {
      throw new Error('Stripe is not ready');
    }

    try {
      // Attempt to create a checkout session with the server-side endpoint
      const checkoutSession = await axios.post('/api/create-stripe-participants-session', payload);

      // Proceed to Stripe's checkout with the session ID
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id
      });

      // Handle possible errors from Stripe's checkout redirection
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (e) {
      const error = e as AxiosError;
      // Check if the error response is from Axios and has the expected format
      if (error.response && error.response.data && error.response.data.message) {
        // Extract and throw the custom error message from the server response
        throw new Error(error.response.data.message);
      } else {
        // Fallback error handling if the error format is not as expected
        throw new Error('An unexpected error occurred');
      }
    }
  }
}

export const apiService = new ApiService(appConfig.keys.stripePublishableKey);
