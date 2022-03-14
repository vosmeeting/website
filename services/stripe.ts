import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { PersonalInformation } from '../pages/register'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
const stripePromise = loadStripe(publishableKey)

export const createVendorCheckoutSession = async (payload) => {
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

export const createParticipantsCheckoutSession = async (payload: {
  participants: PersonalInformation[]
}) => {
  const stripe = await stripePromise
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
