import { NextApiHandler } from 'next'
import { stripe } from '../../infra/stripe.instance'
import { db } from '../../infra/db'
const syncSessions: NextApiHandler = async (req, res) => {
  const sessions = await db.getSessions()

  try {
    const results = await Promise.allSettled(
      sessions.data.map(({ session }) =>
        stripe.checkout.sessions.retrieve(session.id)
      )
    )

    const updateResults = await Promise.all(
      results
        .filter((res) => res.status === 'fulfilled')
        //@ts-expect-error
        .map((res) => res.value)
        .map((session) => db.updateCheckoutSession(session))
    )
    res.send(updateResults)
  } catch (err) {
    res.status(500).send(err)
  }
}

export default syncSessions
