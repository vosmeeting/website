import { NextApiRequest, NextApiResponse } from 'next';
import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';
const notifyUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body;

  try {
    const result = await mongoDatabaseService.createRegistrant({
      email: payload.email,
      name: payload.name,
      notifyMe: true
    });
    return res.status(200).json({ message: 'success', user: result });
  } catch (e) {
    const error = e as Error;
    return res.status(500).send(error);
  }
};
export default notifyUser;
