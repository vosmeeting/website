export interface ParticipantInformationDTO {
  id: string;
  fullName: string;
  organization: string;
  country: string;
  email: string;
  registrationType: string;
}

export interface RegistrantInformationDTO {
  name: string;
  email: string;
}

export type CreateParticipantCheckoutSesssionPayloadDTO =
  | {
      participants: ParticipantInformationDTO[];
      registrant: RegistrantInformationDTO;
      secretUrlId?: string;
    }
  | {
      participants: ParticipantInformationDTO[];
      secretUrlId?: string;
    };

type VendorDTO = {
  email: string;
  companyName: string;
  companyTelephone: string;
};

type Item = {
  amount: number; // in dollar
};
export type VendorCheckoutSessionPayload = {
  item: Item;
  vendor: VendorDTO;
};
