export interface SessionData {
  status?: string
  secretUrlId?: string
  participants?: Array<any>
}

export interface SeatAvailability {
  count: number
  maxSeat: number
}

// Define the interface
export interface IDatabaseService {
  getSeatAvailability(): Promise<SeatAvailability>
  validateSecretUrl(url: string): Promise<boolean>
}
