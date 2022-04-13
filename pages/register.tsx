import {
  Badge,
  Banner,
  Button,
  Card,
  Checkbox,
  Form,
  FormLayout,
  Heading,
  Icon,
  Layout,
  Page,
  Select,
  TextField,
} from '@shopify/polaris'
import {
  CustomerPlusMajor,
  CustomersMinor,
  MobileCancelMajor,
} from '@shopify/polaris-icons'
import {
  asChoiceField,
  notEmpty,
  useDynamicList,
  useField,
  useForm,
} from '@shopify/react-form'
import axios from 'axios'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import withComingSoon from '../components/hoc/withComingSoon'
import {
  defaultRegistrationType,
  registrationTypes,
} from '../constants/registrationType'
import { useParticipantQuota } from '../hooks/useParticipantQuota'
import { createParticipantsCheckoutSession } from '../services/stripe'
import { ParticipantInformation } from '../types'
import { Price } from '../utils/const'
import { flags } from '../utils/featureFlag'
import { RegistrationTypeList } from './../components/RegistrationType'
import { db } from './api/constants/db'
import { Country } from './api/get-countries'

let num = 2
function personalInformationFactory(
  props: Partial<ParticipantInformation>
): ParticipantInformation {
  return {
    id: (num++).toString(),
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

const emailValidation = (input) => {
  {
    try {
      yup
        .string()
        .required('email is required')
        .email('please provide a valid email')
        .validateSync(input)
    } catch (e) {
      return e.message
    }
  }
}

function Register({ data }) {
  const route = useRouter()
  const [remoteErrors, setRemoteErrors] = useState(null)
  const info = useParticipantQuota(data)
  const count = info?.data

  const { error = '' } = route.query as {
    error: string
  }
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
        {
          id: '1',
          fullName: 'John',
          organization: '',
          email: 'john.doe@mail.com',
          country: 'US',
          registrationType: defaultRegistrationType.value,
        },
      ],
      validates: {
        email: [emailValidation],
        organization: [notEmpty('clinic/school/company name is required')],
        country: [notEmpty('country is required')],
        fullName: [notEmpty('your name is required')],
        registrationType: [notEmpty('Registration type is required')],
      },
    },
    personalInformationFactory
  )
  const registerForSelf = useField(true)
  const firstPersonInformation = personalInformations.fields[0]
  const form = useForm({
    fields: {
      persons: personalInformations.fields,
      registerForSelf,
      registrant: {
        name: useField(
          registerForSelf.value
            ? firstPersonInformation.fullName.value
            : {
                value: '',
                validates: [notEmpty('Registrant name is required')],
              },
          [registerForSelf.value, firstPersonInformation.fullName.value]
        ),
        email: useField(
          registerForSelf.value
            ? firstPersonInformation.email.value
            : {
                value: '',
                validates: [emailValidation],
              },
          [registerForSelf.value, firstPersonInformation.email.value]
        ),
      },
    },
    async onSubmit(form) {
      let remoteErrors = []
      try {
        await createParticipantsCheckoutSession({
          participants: form.persons,
          registrant: form.registrant,
          registerForSelf: form.registerForSelf,
        })
      } catch (e) {
        remoteErrors.push(e)
      }
      if (remoteErrors.length > 0) {
        setRemoteErrors(
          [remoteErrors].map((e) => new Error('there was some network issue'))
        )
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

  // redirection error from Stripe's page
  useEffect(() => {
    if (error) setRemoteErrors([new Error(error)])
    const timeout = setTimeout(() => {
      setRemoteErrors(null)
      route.push(route.pathname)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [error])

  return (
    <Page
      title={`Participant Registration`}
      titleMetadata={
        //@ts-ignore
        <Badge status="success">
          <Icon source={CustomersMinor} />
          {count.count}/{count.maxSeat}
        </Badge>
      }
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
                icon: CustomerPlusMajor,
                onAction: () =>
                  personalInformations.addItem({
                    email: 'participant@domain.com',
                    registrationType: defaultRegistrationType.value,
                    country: 'US',
                  }),
              },
            ]}
          >
            <Form onSubmit={form.submit}>
              {personalInformations.fields.map((field, i, arr) => {
                const isMultipleParticipants = arr.length > 1
                const firsParticipant = i === 0
                const registerForSelf = form.fields.registerForSelf.value
                return (
                  <div
                    className={classNames(
                      'rounded-lg my-6 participant-container relative',
                      {
                        'p-4 shadow-sm border': isMultipleParticipants,
                      }
                    )}
                    key={i}
                  >
                    {isMultipleParticipants && (
                      <div className="absolute top-0 right-0 p-4">
                        <Button
                          onClick={() => personalInformations.removeItem(i)}
                          plain={true}
                          icon={<Icon source={MobileCancelMajor} />}
                        />
                      </div>
                    )}
                    <FormLayout>
                      {isMultipleParticipants && (
                        <Heading>Participant {i + 1}</Heading>
                      )}
                      <RegistrationTypeList
                        choiceList={registrationTypes}
                        selected={field.registrationType.value}
                        onChange={field.registrationType.onChange}
                        errorMessage={field.registrationType.error}
                      />

                      <FormLayout.Group>
                        <TextField
                          autoComplete="fullname"
                          label={
                            registerForSelf === true && !isMultipleParticipants
                              ? 'Name'
                              : 'Participant Name'
                          }
                          {...field.fullName}
                        />
                        <TextField
                          autoComplete="email"
                          label={
                            registerForSelf === true && !isMultipleParticipants
                              ? 'Email'
                              : 'Participant Email'
                          }
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

                      {firsParticipant &&
                        form.fields.registerForSelf.value === false && (
                          <FormLayout.Group
                            //@ts-ignore
                            title={
                              <div className="font-semibold text-base">
                                Registrant Details
                              </div>
                            }
                          >
                            <TextField
                              autoComplete="fullname"
                              label="Name"
                              {...form.fields.registrant.name}
                            />
                            <TextField
                              autoComplete="email"
                              label="Email"
                              {...form.fields.registrant.email}
                            />
                          </FormLayout.Group>
                        )}
                      {firsParticipant && (
                        <FormLayout.Group>
                          <Checkbox
                            label="Register for self"
                            {...asChoiceField(form.fields.registerForSelf)}
                          />
                        </FormLayout.Group>
                      )}
                    </FormLayout>
                  </div>
                )
              })}
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export async function getStaticProps() {
  try {
    const data = await db.getSeatAvailability()
    console.log('data', data)
    return { props: { data } }
  } catch (e) {
    console.error('err', e)
    return { props: { data: { count: 0, maxSeat: 100 } } }
  }
}

export default flags.registration ? Register : withComingSoon(Register)
