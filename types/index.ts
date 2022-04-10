export interface ParticipantInformation {
  fullName: string
  organization: string
  country: string
  email: string
  registrationType: string
}

export type CreateParticipantCheckoutSesssionPayload = {
  participants: ParticipantInformation[]
  registrant: {
    email: string
    name: string
  }
  registerForSelf: boolean
}
