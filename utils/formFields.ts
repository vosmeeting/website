import { TextFieldProps } from '@shopify/polaris'

export const fields = [
    { name: 'companyName', label: 'Company Name', autoComplete: 'off' },
    {
        name: 'companyTelephone',
        label: 'Company Telephone',
        type: 'number',
        autoComplete: 'tel',
    },
    { name: 'contactName', label: "Contact's Name" },
    { name: 'fax', label: 'Fax', type: 'number' },
    { name: 'telephone', label: 'Telephone', type: 'number' },
    {
        name: 'companyTelephone',
        label: 'Company Telephone',
        type: 'number',
    },
    { label: 'City/State/Zip', name: 'cityState' },
    {
        label: 'Website Address',
        placeholder: 'www.example.com',
        type: 'url',
				name: 'websiteAddress'
    },
    { name: 'address', label: 'Address', multiline: 4 },
]
