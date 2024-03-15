import { NextApiRequest, NextApiResponse } from 'next';
import { SeatAvailabilityData } from '../../domain/databaseService';
import { getAvailableSeats } from '../../use-cases/getAvailableSeats';

export default async (req: NextApiRequest, res: NextApiResponse<SeatAvailabilityData | Error>) => {
  if (req.method === 'GET') {
    try {
      const data = await getAvailableSeats();
      res.send(data);
    } catch (e) {
      const err = e as Error;
      res.status(500).send(err);
    }
  }
};
