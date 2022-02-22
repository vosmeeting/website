import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(publishableKey);

const createCheckOutSession = async (item: any) => {
  const stripe = await stripePromise;
  const checkoutSession = await axios.post('/api/create-stripe-session', {
    item: item,
  });
  if(!stripe) {
    throw new Error('stripe is not ready')
  }
  const result = await stripe.redirectToCheckout({
    sessionId: checkoutSession.data.id,
  });
  if (result.error) {
    alert(result.error.message);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default createCheckOutSession