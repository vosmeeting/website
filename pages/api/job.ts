import { NextApiHandler } from 'next'
import { db } from '../../infra/db'
import { stripeInteractor } from '../../infra/StripeInteractor'

/**
 * I believe this endpoint is to manually sync stalled data from the DB with stripe's data
 */
const syncSessions: NextApiHandler = async (req, res) => {
  const sessions = await db.getSessions()

  try {
    const results = await Promise.allSettled(
      sessions.data.map(({ session }) =>
        stripeInteractor.retriveCheckoutSessions(session.id)
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
