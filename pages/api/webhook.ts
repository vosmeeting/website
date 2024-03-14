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

const handler: NextApiHandler = async (request, response) => {
  const buf = await buffer(request);
  const sig = request.headers['stripe-signature'];

  let event: Stripe.Event;

  if (!sig) {
    return response.status(400).send('Webhook Error: Missing Stripe Signature');
  }

  try {
    event = stripeInteractor.constructEvent(buf, sig);
  } catch (e) {
    const err = e as Error;
    logger.error('error', err);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  const sessionData = event.data.object as any;
  let checkoutSession;
  let reservationId;

  checkoutSession = await stripeInteractor.retriveCheckoutSessions(sessionData.id);
  reservationId = checkoutSession ? checkoutSession.metadata?.reservationId : null;

  switch (event.type) {
    case 'checkout.session.expired':
      if (reservationId) {
        await mongoDatabaseService.changeReservationStatus(reservationId, 'released');
      }
      response.status(200).send('Session expired handled');
      break;
    case 'payment_intent.succeeded':
      if (reservationId) {
        await mongoDatabaseService.changeReservationStatus(reservationId, 'paid');
      }
      response.status(200).send('Payment intent succeeded handled');
      break;
    case 'payment_intent.cancelled':
      if (reservationId) {
        await mongoDatabaseService.changeReservationStatus(reservationId, 'cancelled'); // Assuming you have a 'cancelled' status
      }
      response.status(200).send('Payment intent cancelled handled');
      break;
    case 'customer.created':
      // Handle customer creation logic here if necessary
      response.status(200).send('Customer created handled');
      break;
    case 'charge.succeeded':
      // Handle charge succeeded logic here if necessary
      response.status(200).send('Charge succeeded handled');
      break;
    case 'charge.refunded':
      if (reservationId) {
        await mongoDatabaseService.changeReservationStatus(reservationId, 'refunded');
      }
      response.status(200).send('Charge refunded handled');
      break;
    default:
      logger.error('Unhandled event:', event.type);
      response.status(200).send('Unhandled event');
      break;
  }
};

export default handler;
