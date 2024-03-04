import { serverClient } from '../../infra/fauna.instance'
import { query as q } from 'faunadb'
import { NextApiHandler } from 'next'
import { stripe } from '../../infra/stripe.instance'
import { updateCheckoutSession } from './webhook'
const syncSessions: NextApiHandler = async (req, res) => {
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

  try {
    const results = await Promise.allSettled(
      sessions.data.map(({ session }) =>
        stripe.checkout.sessions.retrieve(session.id)
      )
    )

    const updateResults = await Promise.all(
      results
        .filter((res) => res.status === 'fulfilled')
        .map((res) => res.value)
        .map((session) => updateCheckoutSession(session))
    )
    res.send(updateResults)
  } catch (err) {
    res.status(500).send(err)
  }
}

export default syncSessions
