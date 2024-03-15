import { useQuery } from 'react-query';
import { apiService } from '../../infra/ApiService';
import { SeatAvailabilityData } from '../../domain/databaseService';

export const useParticipantQuota = (initialValue: SeatAvailabilityData) => {
  return useQuery('available_seat', () => apiService.getParticipantsCount(), {
    refetchInterval: 30000,
    initialData: initialValue
  });
};
