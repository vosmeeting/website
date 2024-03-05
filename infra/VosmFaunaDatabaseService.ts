import { query as q } from 'faunadb'
import { appConfig } from '../domain/appConfig'
import { SessionData } from '../domain/databaseService'
import Stripe from 'stripe'
import { ParticipantInformation } from '../types'

import faunadb from 'faunadb'

// general use
export const serverClient = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET!,
})
const secretUrls = appConfig.secretUrls

type CheckoutSessionData = {
  id: string
  paymentIntent: string
  status: string // should be enum
  customer: string
  participants: string
  secretUrlId: string
}

export class VosmFaunaDatabaseService {
  getSeatAvailability() {
    return serverClient
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('checkout_sessions')), {
            size: 99999,
          }),
          q.Lambda(
            'cs',
            q.Let(
              {
                session: q.Select(['data'], q.Get(q.Var('cs'))),
              },
              {
                session: q.Var('session'),
              }
            )
          )
        ),
        { queryTimeout: 2000 }
      )
      .then((result: any) => {
        const sessions: SessionData[] = result?.data.map(
          ({ session }: { session: SessionData }) => session
        )

        const totalParticipantsCount = sessions
          .filter((s) => ['open', 'complete'].includes(s?.status))
          .filter((s) => !s.secretUrlId) // don't count the secret ones
          .reduce((acc, s) => acc + (s?.participants?.length || 0), 0)

        return {
          count: totalParticipantsCount,
          maxSeat: appConfig.seatAvailability,
        }
      })
  }

  validateSecretUrl(url: any) {
    return new Promise((resolve) => {
      resolve(secretUrls.includes(url))
    })
  }
  saveRegistrant(registrant: { email: string; name: string }) {
    return serverClient.query<{
      data: { customerId: string }
    }>(
      q.Let(
        {
          match: q.Match(q.Index('users_by_email'), registrant.email),
          data: { data: registrant },
        },
        q.If(q.Exists(q.Var('match')), q.Get(q.Var('match')), null)
      )
    )
  }
  saveCheckoutSession(
    checkoutSession: Stripe.Checkout.Session,
    participants: ParticipantInformation[],
    secretUrlId?: string
  ) {
    return serverClient.query(
      q.Create(q.Collection('checkout_sessions'), {
        data: secretUrlId
          ? {
              id: checkoutSession.id,
              paymentIntent: checkoutSession.payment_intent,
              status: checkoutSession.status,
              customer: checkoutSession.customer,
              participants,
              secretUrlId,
            }
          : {
              id: checkoutSession.id,
              paymentIntent: checkoutSession.payment_intent,
              status: checkoutSession.status,
              customer: checkoutSession.customer,
              participants,
            },
      })
    )
  }

  updateCheckoutSession(session: Stripe.Checkout.Session) {
    const payload = {
      id: session.id,
      paymentIntent: session.payment_intent,
      status: session.status,
      customer: session.customer,
    }
    return serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('checkout_sessions_by_id'), payload.id),
          data: { data: payload },
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    )
  }

  updatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    return serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('payment_intents_by_id'), paymentIntent.id),
          data: { data: paymentIntent },
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    )
  }

  updateCharge(charge: Stripe.Charge) {
    return serverClient.query(
      q.Let(
        {
          match: q.Match(q.Index('charges_by_id'), charge.id),
          data: { data: charge },
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
          null
        )
      )
    )
  }

  saveCharge(charge: Stripe.Charge) {
    return serverClient.query(
      q.Create(q.Collection('charges'), { data: charge })
    )
  }
  savePaymentIntent = (sessionData: any) =>
    serverClient.query(
      q.Create(q.Collection('payment_intents'), { data: sessionData })
    )
  async getSessions() {
    const sessions: {
      data: { session: { id: string; paymentIntent: string } }[]
    } = await serverClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('checkout_sessions')), {
          size: 99999,
        }),
        q.Lambda(
          'cs',
          q.Let(
            {
              session: q.Select(['data'], q.Get(q.Var('cs'))),
            },
            {
              session: q.Var('session'),
            }
          )
        )
      )
    )
    return sessions
  }
}

export const dbService = new VosmFaunaDatabaseService()
