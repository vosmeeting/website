import { stripeInteractor } from '../../infra/StripeInteractor'
import { db } from '../../infra/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const sessions = await db.getSessions()
      const paymentIntentsResult = await Promise.allSettled(
        sessions.data.map(({ session }) =>
          stripeInteractor.retrivePaymentIntents(session.paymentIntent)
        )
      )

      const updateResults = await Promise.all(
        paymentIntentsResult
          .filter((res) => res.status === 'fulfilled')
          //@ts-expect-error
          .map((res) => res.value)
          .map((pi) => db.updatePaymentIntent(pi))
      )

      res.send(updateResults)
    } catch (e) {
      res.status(500).send(e)
    }
  }
}
