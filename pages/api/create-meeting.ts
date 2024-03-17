import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';
import { NextApiRequest, NextApiResponse } from 'next';

const createMeeting = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body;
  const meeting = await mongoDatabaseService.createMeeting({
    date: new Date(),
    description: payload.description,
    title: payload.title,
    maxParticipants: payload.maxParticipants
  });
  res.status(200).send({
    message: 'Meeting created successfully',
    meeting
  });
};

export default createMeeting;
