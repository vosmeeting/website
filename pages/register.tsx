import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Heading,
  Layout,
  Page,
  Select,
  TextField,
} from '@shopify/polaris'
import {
  notEmpty,
  useDynamicList,
  useField,
  useForm,
} from '@shopify/react-form'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import { RegistrationTypeList } from './../components/RegistrationType'
import { Country } from './api/get-countries'
import {
  defaultRegistrationType,
  registrationType as registrationTypes,
} from './constants/registrationType'
import { Price } from '../utils/const'

interface PersonalInformation {
  fullName: string
  organization: string
  country: string
  email: string
  registrationType: string
}

function personalInformationFactory(
  props: Partial<PersonalInformation>
): PersonalInformation {
  return {
    country: props.country || '',
    email: props.email || '',
    fullName: props.fullName || '',
    organization: props.organization || '',
    registrationType: props.registrationType || '',
  }
}

const ErrorBanner = ({ errors }) => {
  return errors.length > 0 ? (
    <Layout.Section>
      <Banner status="critical">
        <p>There were some issues with your form submission:</p>
        <ul>
          {errors.map(({ message }, index) => {
            return <li key={`${message}${index}`}>{message}</li>
          })}
        </ul>
      </Banner>
    </Layout.Section>
  ) : null
}

export default function Register() {
  const [remoteErrors, setRemoteErrors] = useState(null)
  const [countries, setCountries] = useState<Country[]>([
    { country: 'United States', abbreviation: 'US' },
  ])
  useEffect(() => {
    axios.get<Country[]>('/api/get-countries').then((res) => {
      setCountries(res.data)
    })
  }, [])

  const personalInformations = useDynamicList(
    {
      list: [
        personalInformationFactory({
          email: '',
          country: 'US',
          registrationType: defaultRegistrationType.value,
        }),
      ],
      validates: {
        email: [
          (input) => {
            try {
              yup
                .string()
                .required('Company/Contact email is required')
                .email('please provide a valid email')
                .validateSync(input)
            } catch (e) {
              return e.message
            }
          },
        ],
        organization: [notEmpty('clinic/school/company name is required')],
        country: [notEmpty('country is required')],
        fullName: [notEmpty('your name is required')],
        registrationType: [notEmpty('Registration type is required')],
      },
    },
    personalInformationFactory
  )
  const form = useForm({
    fields: {
      persons: personalInformations.fields,
    },
    async onSubmit(form) {
      let remoteErrors = []
      try {
        // call submit service
        await new Promise((resolve, reject) =>
          setTimeout(() => reject(new Error('server error')), 3000)
        )
      } catch (e) {
        remoteErrors.push(e)
      }
      if (remoteErrors.length) {
        setRemoteErrors([remoteErrors])
        return { status: 'fail', errors: remoteErrors }
      }

      return { status: 'success' }
    },
  })
  const totalPrice = useMemo(() => {
    return form.fields.persons.reduce((totalPrice, person) => {
      const price = registrationTypes.find(
        (r) => r.value === person.registrationType.value
      ).price

      return totalPrice + price
    }, 0)
  }, [form.fields.persons])

  return (
    <Page
      title="Participant Registration"
      subtitle="4th Veterinary	Ophthalmic	Surgery	Meeting	&bull; Jul	22-24, 2022"
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
    >
      <Layout>
        {remoteErrors && <ErrorBanner errors={remoteErrors} />}
        <Layout.Section>
          <Card
            sectioned
            title="Personal Information"
            primaryFooterAction={{
              content: 'register ' + new Price(totalPrice).toDollar(),
              onAction: form.submit,
              loading: form.submitting,
              disabled: !form.dirty,
            }}
            secondaryFooterActions={[
              {
                content: 'add more participant',
                onAction: () =>
                  personalInformations.addItem({
                    email: 'person@gmail.com',
                    registrationType: defaultRegistrationType.value,
                  }),
              },
            ]}
          >
            <Form onSubmit={form.submit}>
              {personalInformations.fields.map((field, i) => {
                return (
                  <Card sectioned key={i} footerActionAlignment="left">
                    <FormLayout>
                      <Heading>Person {i + 1}</Heading>
                      <RegistrationTypeList
                        choiceList={registrationTypes}
                        selected={field.registrationType.value}
                        onChange={field.registrationType.onChange}
                        errorMessage={field.registrationType.error}
                      />
                      <FormLayout.Group>
                        <TextField
                          autoComplete="fullname"
                          label="Your name"
                          {...field.fullName}
                        />
                        <TextField
                          autoComplete="email"
                          label="Email address"
                          {...field.email}
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          autoComplete="company"
                          label="Clinic/School/Company"
                          {...field.organization}
                        />

                        <Select
                          label="Country"
                          options={countries.map(
                            ({ country, abbreviation }) => ({
                              label: country,
                              value: abbreviation,
                            })
                          )}
                          {...field.country}
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                )
              })}
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
