import { query as q } from 'faunadb'
import { SEAT_AVAILABILITY } from './constants'
import { serverClient } from './fauna.instance'
const secretUrls = ['936058d8-eb5e-4d6d-b3dc-af30488859b4']
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
        ),
        { queryTimeout: 2000 }
      )
      .then((result: any) => {
        // I Can't do this operation with Fauna :(
        // using vanilla javascript..
        const sessions = result?.data.map(({ session }) => session)

        const totalParticipantsCount = sessions
          .filter((s) => {
            return ['open', 'complete'].includes(s?.status)
          })
          .filter((s) => !s.secretUrlId) // dont count the secret ones
          .reduce((acc, s) => {
            return acc + (s?.participants?.length || 0)
          }, 0)
        return { count: totalParticipantsCount, maxSeat: SEAT_AVAILABILITY }
      }),
  validateSecretUrl: (url: string) => {
    return new Promise((resolve) => {
      resolve(secretUrls.includes(url))
    })
  },
}
