import { useQuery } from 'react-query';
import { apiService } from '../../infra/ApiService';
import { SeatAvailabilityDTO } from '../../types';

export const useParticipantQuota = (initialValue: SeatAvailabilityDTO) => {
  return useQuery('available_seat', () => apiService.getParticipantsCount(), {
    refetchInterval: 30000,
    initialData: initialValue
  });
};
