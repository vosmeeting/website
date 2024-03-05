import axios from 'axios'
import {
  CreateParticipantCheckoutSesssionPayload,
  VendorCheckoutSessionPayload,
} from '../types'
import { loadStripe } from '@stripe/stripe-js'

class ApiService {
  private publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  private stripePromise = loadStripe(this.publishableKey)
  createStripeCustomer(email: string) {
    return axios.post('/api/create-stripe-customer', { email })
  }
  getCount = () => axios.get('/api/available-seats')

  createVendorCheckoutSession = async (
    payload: VendorCheckoutSessionPayload
  ) => {
    const stripe = await this.stripePromise
    const checkoutSession = await axios.post(
      '/api/create-stripe-session',
      payload
    )
    if (!stripe) {
      throw new Error('stripe is not ready')
    }
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    })
    if (result.error) {
      alert(result.error.message)
    }
  }

  createParticipantsCheckoutSession = async (
    payload: CreateParticipantCheckoutSesssionPayload
  ) => {
    const stripe = await this.stripePromise
    const checkoutSession = await axios.post(
      '/api/create-stripe-participants-session',
      payload
    )
    if (!stripe) {
      throw new Error('stripe is not ready')
    }
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    })
    if (result.error) {
      throw new Error(result.error.message)
    }
  }
}

export const apiService = new ApiService()
