import { RegistrationType } from './appConfig';

export const registrationTypes: RegistrationType[] = [
  {
    value: 'avco/ecvo',
    label: `ACVO/ECVO Diplomate/Board Eligible*`,
    price: 450,
    optionalComment: '*actively taking boards at the moment'
  },
  { value: 'speaker', label: 'Speaker', price: 350 },
  {
    value: 'resident/inter',
    label: 'Resident/Ophtalmology Intern',
    price: 250
  },
  { value: 'others', label: 'Others', price: 550 }
];
