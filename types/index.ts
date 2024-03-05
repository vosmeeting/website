export interface ParticipantInformation {
  id: string
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
  secretUrlId?: string
}

type VendorDTO = {
  email: string
  companyName: string
  companyTelephone: string
}

type Item = {
  amount: number // in dollar
}
export type VendorCheckoutSessionPayload = {
  item: Item
  vendor: VendorDTO
}
