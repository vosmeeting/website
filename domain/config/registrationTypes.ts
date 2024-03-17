import { RegistrationType } from './appConfig';

export const registrationTypes: RegistrationType[] = [
  {
    value: 'avco/ecvo',
    label: `ACVO/ECVO Diplomate/Board Eligible*`,
    price: 550,
    optionalComment: '*actively taking boards at the moment'
  },
  { value: 'speaker', label: 'Speaker', price: 450 },
  {
    value: 'resident/inter',
    label: 'Resident/Ophtalmology Intern',
    price: 300
  },
  { value: 'others', label: 'Other Veterinary Ophthalmologists', price: 650 }
  // { value: 'guest', label: 'Guest entry for reception', price: 75 }
];
