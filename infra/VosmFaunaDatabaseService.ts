import { serverClient } from './fauna.instance'
import { query as q } from 'faunadb'
import { appConfig } from '../domain/appConfig'
import { SessionData } from '../domain/databaseService'

const secretUrls = appConfig.secretUrls

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

  validateSecretUrl(url: string) {
    return new Promise((resolve) => {
      resolve(secretUrls.includes(url))
    })
  }
}

export const dbService = new VosmFaunaDatabaseService()
