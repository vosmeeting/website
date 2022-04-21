import axios from 'axios'
import { useQuery } from 'react-query'

export const getCount = () => axios.get('/api/available-seats')

export const useParticipantQuota = (initialValue) => {
  return useQuery(
    'available_seat',
    () => getCount().then((res) => res.data.count),
    {
      // refetchInterval: 60000,
      initialData: initialValue,
    }
  )
}
