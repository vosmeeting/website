import { NextApiRequest, NextApiResponse } from 'next';
import { mongoDatabaseService } from '../../infra/database/mongo-database-service/MongoDatabaseService';
const sanityCheck = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('sanity checking by getting meeting by title');
    const result = await mongoDatabaseService.getLatestMeeting();
    console.log('result', result);

    res.status(200).json({ message: 'Sanity check passed', latestMeeting: result });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};
export default sanityCheck;
