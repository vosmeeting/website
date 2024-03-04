import { useQuery } from 'react-query'
import { apiService } from '../infra/ApiService'

type Data = {
  maxSeat: number
  count: number
}
export const useParticipantQuota = (initialValue: Data) => {
  return useQuery(
    'available_seat',
    () => apiService.getCount().then((res) => res.data.count),
    {
      // refetchInterval: 60000,
      initialData: initialValue,
    }
  )
}
