import { query as q } from 'faunadb';
import { appConfig } from '../../domain/config/appConfig';
import { SessionData } from '../../domain/databaseService';
import Stripe from 'stripe';
import { ParticipantInformationDTO } from '../../types';

import faunadb from 'faunadb';
import { DatabaseService } from '../DatabaseService';

export class VosmFaunaDatabaseService implements DatabaseService {
  private serverClient = new faunadb.Client({
    secret: appConfig.keys.faunaSecret
  });
  getReservedSeats() {
    return this.serverClient
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('checkout_sessions')), {
            size: 99999
          }),
          q.Lambda(
            'cs',
            q.Let(
              {
                session: q.Select(['data'], q.Get(q.Var('cs')))
              },
              {
                session: q.Var('session')
              }
            )
          )
        ),
        { queryTimeout: 2000 }
      )
      .then((result: any) => {
        const sessions: SessionData[] = result?.data.map(
          ({ session }: { session: SessionData }) => session
        );

        const totalParticipantsCount = sessions
          .filter((s) => ['open', 'complete'].includes(s?.status))
          .filter((s) => !s.secretUrlId) // don't count the secret ones
          .reduce((acc, s) => acc + (s?.participants?.length || 0), 0);

        return {
          totalParticipantsCount
        };
      });
  }

  saveRegistrant(registrant: Stripe.Customer) {
    return this.serverClient.query<{
      data: { customerId: string };
    }>(
      q.Let(
        {
          match: q.Match(q.Index('users_by_email'), registrant.email!),
          data: { data: registrant }
        },
        q.If(q.Exists(q.Var('match')), q.Get(q.Var('match')), null)
      )
    );
  }
  saveCheckoutSession(
    checkoutSession: Stripe.Checkout.Session,
    participants: ParticipantInformationDTO[],
    secretUrlId?: string
  ) {
    return this.serverClient.query(
      q.Create(q.Collection('checkout_sessions'), {
        data: secretUrlId
          ? {
              id: checkoutSession.id,
              paymentIntent: checkoutSession.payment_intent,
              status: checkoutSession.status,
              customer: checkoutSession.customer,
              participants,
              secretUrlId
            }
          : {
              id: checkoutSession.id,
              paymentIntent: checkoutSession.payment_intent,
              status: checkoutSession.status,
              customer: checkoutSession.customer,
              participants
            }
      })
    );
  }

  updateCheckoutSession(session: Stripe.Checkout.Session) {
    const payload = {
      id: session.id,
      paymentIntent: session.payment_intent,
      status: session.status,
      customer: session.customer
    };
    return this.serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('checkout_sessions_by_id'), payload.id),
          data: { data: payload }
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    );
  }

  updatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    return this.serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('payment_intents_by_id'), paymentIntent.id),
          data: { data: paymentIntent }
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    );
  }

  updateCharge(charge: Stripe.Charge) {
    return this.serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('charges_by_id'), charge.id),
          data: { data: charge }
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    );
  }

  saveCharge(charge: Stripe.Charge) {
    return this.serverClient.query(q.Create(q.Collection('charges'), { data: charge }));
  }
  savePaymentIntent = (sessionData: any) =>
    this.serverClient.query(q.Create(q.Collection('payment_intents'), { data: sessionData }));
  async getSessions() {
    const sessions: {
      data: { session: { id: string; paymentIntent: string } }[];
    } = await this.serverClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('checkout_sessions')), {
          size: 99999
        }),
        q.Lambda(
          'cs',
          q.Let(
            {
              session: q.Select(['data'], q.Get(q.Var('cs')))
            },
            {
              session: q.Var('session')
            }
          )
        )
      )
    );
    return sessions;
  }
}
