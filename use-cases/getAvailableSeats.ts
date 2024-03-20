import { SeatAvailabilityData } from '../types';
import { mongoDatabaseService } from '../infra/database/mongo-database-service/MongoDatabaseService';

export const getAvailableSeats = async (): Promise<SeatAvailabilityData> => {
  const latestMeeting = await mongoDatabaseService.getLatestMeeting();
  if (!latestMeeting) {
    throw new Error('no last meeting found');
  }
  return mongoDatabaseService
    .getReservedSeatsCount(latestMeeting.id)
    .then((count) => ({ count, maxSeat: latestMeeting.maxParticipants }));
};
