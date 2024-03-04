import axios from 'axios'

class ApiService {
  createStripeCustomer(email: string) {
    return axios.post('/api/create-stripe-customer', { email })
  }
  getCount = () => axios.get('/api/available-seats')
}

export const apiService = new ApiService()
