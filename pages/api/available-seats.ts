import { NextApiRequest, NextApiResponse } from 'next';
import { SeatAvailabilityDTO } from '../../types';
import { getAvailableSeats } from '../../use-cases/getAvailableSeats';

export default async (req: NextApiRequest, res: NextApiResponse<SeatAvailabilityDTO | Error>) => {
  if (req.method === 'GET') {
    try {
      const data = await getAvailableSeats();
      res.send(data);
    } catch (e) {
      const err = e as Error;
      console.error(err);
      res.status(500).send({ message: `Something went wrong: ${err.message}` } as Error);
    }
  }
};
