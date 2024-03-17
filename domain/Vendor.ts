export class Vendor {
  constructor(
    public email: string,
    public companyName: string,
    public companyTelephone: string
  ) {}
}

export class Attendee {
  constructor(public email: string, public name: string) {}
}
