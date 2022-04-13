import { NextApiHandler } from 'next'
import { SEAT_AVAILABILITY } from './constants/constants'
import { db } from './constants/db'

const getAvailableSeats: NextApiHandler = (req, res) => {
  if (req.method === 'GET') {
    return db
      .getSeatAvailability()
      .then((count) => res.send({ count, maxSeat: SEAT_AVAILABILITY }))
      .catch((e) => {
        res.status(500).send(e)
      })
  }
}

export default getAvailableSeats
