export type RegistrationType = {
  value: string
  label: string
  price: number
}
export const registrationTypes = [
  {
    value: 'avco/evco',
    label: `ACVO/EVCO Diplomate/Board Eligible*`,
    price: 450,
    optionalComment: '*actively taking boards at the moment',
  },
  { value: 'speaker', label: 'Speaker', price: 350 },
  {
    value: 'resident/inter',
    label: 'Resident/Ophtalmology Intern',
    price: 250,
  },
  { value: 'non-diplomates', label: 'Non-Diplomates', price: 600 },
]

export const defaultRegistrationType = registrationTypes[0]
