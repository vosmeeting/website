/* eslint-disable no-case-declarations */
import { NextApiHandler } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { logger } from '../../utils/logger';
import { stripeInteractor } from '../../infra/StripeInteractor';
import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';

// Disable the Next.js body parser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const reservationId = paymentIntent.metadata?.reservationId;
  if (reservationId) {
    await mongoDatabaseService.alterFromReserved(reservationId, 'paid');
    logger.info(`Payment intent succeeded for reservation ${reservationId}`);
  }
}

async function handlePaymentIntentCancelled(paymentIntent: Stripe.PaymentIntent) {
  const reservationId = paymentIntent.metadata?.reservationId;
  if (reservationId) {
    await mongoDatabaseService.alterFromReserved(reservationId, 'cancelled');
    logger.info(`Payment intent succeeded for reservation ${reservationId}`);
  }
}

const handler: NextApiHandler = async (request, response) => {
  const buf = await buffer(request);
  const sig = request.headers['stripe-signature'];

  if (!sig) {
    logger.error('Webhook Error: Missing Stripe Signature');
    return response.status(400).send('Webhook Error: Missing Stripe Signature');
  }

  let event: Stripe.Event;

  try {
    event = stripeInteractor.constructEvent(buf, sig);
    logger.info(`Received webhook event for even type ${event.type} with data`, event.data);
    //@ts-expect-error
    logger.info(`metadata for event type: ${event.type}`, event.data.object.metadata);
  } catch (e) {
    const err = e as Error;
    logger.error('Error constructing event:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle payment intent success
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.canceled':
        const paymentIntentCancelled = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentCancelled(paymentIntentCancelled);
        break;
      // Add more case handlers for different event types as needed
      default:
        logger.warn('Unhandled event type:', event.type);
    }
  } catch (e) {
    const err = e as Error;
    logger.error('Error handling event:', err.message);
    return response.status(500).send('Internal Server Error');
  }

  response.status(200).send({ received: true });
};

export default handler;
