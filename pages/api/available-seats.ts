import { NextApiHandler } from 'next'
import { db } from '../../infra/db'
import { appConfig } from '../../domain/appConfig'

const getAvailableSeats: NextApiHandler = (req, res) => {
  if (req.method === 'GET') {
    return db
      .getSeatAvailability()
      .then((count) => res.send({ count, maxSeat: appConfig.seatAvailability }))
      .catch((e) => {
        res.status(500).send(e)
      })
  }
}

export default getAvailableSeats
