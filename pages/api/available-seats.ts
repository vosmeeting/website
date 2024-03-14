import { NextApiRequest, NextApiResponse } from 'next';
import { SeatAvailabilityData } from '../../domain/databaseService';
import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse<SeatAvailabilityData>) => {
  if (req.method === 'GET') {
    const latestMeeting = await mongoDatabaseService.getLatestMeeting();
    if (!latestMeeting) {
      return res.status(500).send('No meeting found' as any);
    }
    return mongoDatabaseService
      .getReservedSeatsCount(latestMeeting.id)
      .then((count) =>
        res.send({
          count: count,
          maxSeat: latestMeeting.maxParticipants
        })
      )
      .catch((e) => {
        res.status(500).send(e);
      });
  }
};
