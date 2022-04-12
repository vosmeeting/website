import { serverClient } from './constants/fauna.instance'
import { query as q } from 'faunadb'
import { NextApiHandler } from 'next'
import { SEAT_AVAILABILITY } from './constants/constants'

const getAvailableSeats: NextApiHandler = (req, res) => {
  if (req.method === 'GET') {
    return serverClient
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('checkout_sessions'))),
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
      .then((result: any) => {
        // I Can't do this operation with Fauna :(
        // using vanilla javascript..
        const sessions = result?.data
        const totalParticipantsCount = sessions
          .filter(({ session: s }) => {
            return ['open', 'complete'].includes(s?.status)
          })
          .reduce((acc, curr) => {
            return acc + (curr?.session?.participants?.length || 0)
          }, 0)
        res.send({ count: totalParticipantsCount, maxSeat: SEAT_AVAILABILITY })
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  }
}

export default getAvailableSeats
