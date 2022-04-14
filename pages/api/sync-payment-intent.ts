import { query as q } from 'faunadb'
import { serverClient } from './constants/fauna.instance'
import { stripe } from './constants/stripe.instance'
import { updatePaymentIntent } from './webhook'

export default async function handler(req, res) {
  try {
    const sessions: {
      data: { session: { id: string } }[]
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

    const paymentIntentsResult = await Promise.allSettled(
      sessions.data.map(({ session }) =>
        stripe.paymentIntents.retrieve(session.paymentIntent)
      )
    )

    const updateResults = await Promise.all(
      paymentIntentsResult
        .filter((res) => res.status === 'fulfilled')
        .map((res) => res.value)
        .map((pi) => updatePaymentIntent(pi))
    )

    res.send(updateResults)
  } catch (e) {
    res.status(500).send(e)
  }
}
