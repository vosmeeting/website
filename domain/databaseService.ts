export interface SessionData {
  status: string
  secretUrlId?: string
  participants?: Array<any>
}

export interface SeatAvailabilityData {
  count: number
  maxSeat: number
}

// Define the interface
export interface IDatabaseService {
  getSeatAvailability(): Promise<SeatAvailabilityData>
  validateSecretUrl(url: string): Promise<boolean>
}
