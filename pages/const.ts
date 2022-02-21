export class Price extends Number {
  constructor(private value: number) {
    super()
  }

  toDollar() {
    return this.value.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD',
    })
  }
}

export const BoothLocations = [
  {
    name: 'Lecture Hall Booth',
    price: 1200,
  },
  { name: 'Exhibit Hall Booth', price: 1000 },
  { name: 'Additional rep', price: 350 },
].map((obj) => ({ ...obj, price: new Price(obj.price) }))

export const SponsorshipPreferences = [
  {
    name: 'Prime',
    price: 6000,
    disc: 50,
  },
  {
    name: 'Platinum',
    price: 5000,
    disc: 40,
  },
  {
    name: 'Gold',
    price: 4000,
    disc: 30,
  },
  {
    name: 'Silver',
    price: 3000,
    disc: 20,
  },
  {
    name: 'Bronze',
    price: 2000,
  },
].map((obj) => ({ ...obj, price: new Price(obj.price) }))

export const GeneralSupport = [
  { name: 'Wi-Fi', price: 1000 },
  { name: 'Resident sponsorship (registration for 10) ', price: 2500 },
  { name: 'Sponsored Lecture ', price: 3000 },
  { name: 'A/V Services* ', price: 2000 },
  { name: 'Continental breakfast* ', price: 2000 },
  { name: 'Plated lunch* ', price: 3000 },
  { name: 'Reception JAZZ BAND * ', price: 2000 },
  { name: 'Reception food* ', price: 3000 },
  { name: 'Reception drinks* ', price: 3000 },
].map((obj) => ({ ...obj, price: new Price(obj.price) }))

export const MarketingOpportunities = [
  { name: 'Packet inserts', price: 1000 },
  { name: 'Attendee list', price: 200 },
  { name: 'Meeting bag*', price: 2000 },
  { name: 'Lanyards*', price: 2000 },
  { name: 'Badges*', price: 2500 },
  { name: 'Pen on meeting bags*', price: 1000 },
  { name: 'Proceedings - Full page', price: 1000 },
  { name: 'Proceedings - ½ page', price: 750 },
  { name: 'Proceedings - Back covers', price: 2000 },
].map((obj) => ({ ...obj, price: new Price(obj.price) }))
