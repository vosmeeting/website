import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { VendorCheckoutSessionPayload } from '../types'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
const stripePromise = loadStripe(publishableKey)

export const createVendorCheckoutSession = async (
  payload: VendorCheckoutSessionPayload
) => {
  const stripe = await stripePromise
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
