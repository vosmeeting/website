import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CreateParticipantCheckoutSesssionPayloadDTO } from '../../types';
import { stripeInteractor } from '../../infra/StripeInteractor';
import { appConfig } from '../../domain/config/appConfig';
import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body as CreateParticipantCheckoutSesssionPayloadDTO;

    const meeting = await mongoDatabaseService.getLatestMeeting();
    if (!meeting) {
      throw new Error('No meeting found');
    }
    const meetingId = meeting.id;

    const host = req.headers.host!;
    const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:';
    const publicUrl = protocol + '//' + host;
    const successUrl = publicUrl + '/payment-success';
    const cancelUrl = publicUrl + '/register';
    const firstParticipant = payload.participants[0];

    let dbParticipantIds: string[] = [];
    const registrantCreationAttribute =
      'registrant' in payload
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
              name: `Participant Registration As: ${p.registrationType?.toUpperCase()}`,
              description: '5th Veterinary	Ophthalmic	Surgery	Meeting	Jul	19-22, 2024',
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
    const reservation = await mongoDatabaseService.initReservation({
      meetingId: meetingId,
      participantIds: dbParticipantIds,
      heldUntil: new Date(Date.now() + appConfig.paymentWindowMinutes * 60 * 1000)
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
      payload.secretUrlId
    );

    res.status(200).json({ id: checkoutSession.id, reservationId: reservation.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create the session' });
  }
};
