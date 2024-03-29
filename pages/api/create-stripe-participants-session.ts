import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CreateParticipantCheckoutSesssionPayloadDTO } from '../../types';
import { stripeInteractor } from '../../infra/StripeInteractor';
import { appConfig } from '../../domain/config/appConfig';
import {
  MongoDatabaseService,
  mongoDatabaseService
} from '../../infra/database/mongo-database-service/MongoDatabaseService';

function buildPublicUrl(hostname: string) {
  // Derive protocol: Use 'https' for all non-localhost environments.
  const isLocalhost = hostname && /^localhost(:\d+)?$/.test(hostname);
  const protocol = isLocalhost ? 'http:' : 'https:';

  // Construct the public base URL.
  const publicUrl = `${protocol}//${hostname}`;
  return publicUrl;
}

async function initReservation(
  db: MongoDatabaseService,
  reservationData: {
    meetingId: string;
    participantIds: string[];
    heldUntil: Date;
    reservationType: 'vip' | 'regular';
  }
) {
  await db.connectPromise;
  const meeting = await db.findMeetingById(reservationData.meetingId);
  const reservedSeatsCount = await db.getRegularReservedSeatsCount(reservationData.meetingId);
  const availableSeats = meeting.maxParticipants - reservedSeatsCount;
  const exceedMaxCapacity = availableSeats < reservationData.participantIds.length;
  if (!meeting) {
    throw new Error('Meeting not found');
  }

  if (reservationData.reservationType === 'vip') {
    // bypass
  } else if (exceedMaxCapacity) {
    throw new Error('Not enough available seats');
  }

  return db.createReservation(reservationData);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body as CreateParticipantCheckoutSesssionPayloadDTO;
    const publicUrl = buildPublicUrl(req.headers.host!);
    const secretUrlId = payload.secretUrlId;
    const meeting = await mongoDatabaseService.getLatestMeeting();
    if (!meeting) {
      throw new Error('No meeting found');
    }

    if (secretUrlId) {
      // validates and throw if not correct
      if (meeting.secretUrlId !== secretUrlId) {
        console.log(meeting);
        console.log('url secretid', secretUrlId);
        throw new Error('invalid secret url!');
      }
    }
    const meetingId = meeting.id;

    // Append paths for specific routes.
    const successUrl = `${publicUrl}/payment-success`;
    const cancelUrl = `${publicUrl}/register`;

    const firstParticipant = payload.participants[0];

    let dbParticipantIds: string[] = [];
    const registrantCreationAttribute =
      'registrant' in payload && payload.registrant
        ? // use the registrant details if provided
          { name: payload.registrant.name, email: payload.registrant.email }
        : // if not, use the first participant details, which most likely are the registrant's
          { name: firstParticipant.fullName, email: firstParticipant.email };

    let registrant = await mongoDatabaseService.findRegistrantByEmail(
      registrantCreationAttribute.email
    );

    if (!registrant) {
      const registrantCust = await stripeInteractor.createCustomer({
        email: registrantCreationAttribute.email,
        name: registrantCreationAttribute.name
      });

      registrant = await mongoDatabaseService.createRegistrant({
        email: registrantCreationAttribute.email,
        name: registrantCreationAttribute.name,
        stripeCustomerId: registrantCust.id
      });
    }

    for (const p of payload.participants) {
      const participantDb = await mongoDatabaseService.createOrUpdateParticipant({
        country: p.country,
        email: p.email,
        meetingId,
        name: p.fullName,
        organization: p.organization
      });

      dbParticipantIds.push(participantDb.id);
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.participants.map(
      (p) => {
        const cents =
          appConfig.registrationTypes.find((r) => r.value === p.registrationType)!.price * 100;
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Participant Registration (${p.registrationType?.toUpperCase()})`,
              description: `5th Veterinary	Ophthalmic	Surgery	Meeting	${appConfig.willHeld}`,
              images: [publicUrl + '/vosm_logo.png'],
              metadata: { test: 'hello world' }
            },

            unit_amount: cents
          },
          quantity: 1
        };
      }
    );

    // create a reservation for the participants
    const reservation = await initReservation(mongoDatabaseService, {
      meetingId: meetingId,
      participantIds: dbParticipantIds,
      heldUntil: new Date(Date.now() + appConfig.paymentWindowMinutes * 60 * 1000),
      reservationType: secretUrlId ? 'vip' : 'regular'
    });

    const today = new Date();
    const expInSeconds = Math.floor(today.getTime() / 1000) + 60 * appConfig.paymentWindowMinutes;
    const checkoutSession = await stripeInteractor.createParticipantCheckoutSession(
      lineItems,
      expInSeconds,
      successUrl,
      cancelUrl,
      registrant.stripeCustomerId,
      reservation.id,
      registrant.id,
      meeting.id,
      payload.secretUrlId
    );

    res.status(200).json({ id: checkoutSession.id, reservationId: reservation.id });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ message: error.message });
  }
};
