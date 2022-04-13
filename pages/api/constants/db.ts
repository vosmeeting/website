import { query as q } from 'faunadb'
import { SEAT_AVAILABILITY } from './constants'
import { serverClient } from './fauna.instance'
export const db = {
  getSeatAvailability: () =>
    serverClient
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
        return { count: totalParticipantsCount, maxSeat: SEAT_AVAILABILITY }
      }),
}
