import {
  Banner,
  Card,
  ChoiceList,
  Form,
  FormLayout,
  Heading,
  Layout,
  Link,
  List,
  Page,
  TextContainer,
  TextField,
} from '@shopify/polaris'
import {
  getValues,
  notEmpty,
  numericString,
  useField,
  useForm,
} from '@shopify/react-form'
import NextLink from 'next/link'
import { useMemo } from 'react'
import * as yup from 'yup'
import Button from '../components/Buttons'
import CustomChoiceList from '../components/CustomChoiceList'
import calcPrice from '../services/calc-price'
import createCheckOutSession from '../services/stripe'
import {
  BoothLocations,
  GeneralSupport,
  MarketingOpportunities,
  Price,
  SponsorshipPreferences,
} from '../utils/const'
import Error from 'next/error'
import ComingSoon from '../components/ComingSoon'

export default function Sponsor() {
  const schema = {
    companyName: useField({
      value: '',
      validates: [notEmpty('company name is required')],
    }),
    companyTelephone: useField({
      value: '',
      validates: [
        notEmpty("phone number can't be empty"),
        (input) => {
          const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
          if (!phoneRegex.test(input)) {
            return 'please input a valid phone number'
          }
        },
      ],
    }),
    address: useField({
      value: '',
      validates: [notEmpty('address is required')],
    }),
    fax: useField({
      value: '',
      validates: [numericString('please provide a valid fax number')],
    }),
    contactName: useField({
      value: '',
      validates: [notEmpty('please provide a contact name')],
    }),
    email: useField({
      value: '',
      validates: [
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
    }),
    cityStateZip: useField({
      value: '',
      validates: [notEmpty('City/State/Zip is required')],
    }),
    website: useField({
      value: '',
      validates: [
        (input) => {
          if (!yup.string().url(input).isValidSync) {
            return 'please input a valid url'
          }
        },
      ],
    }),
    boothOption: useField<'1st' | '2nd' | '3rd' | '4th'>({
      value: '1st',
      validates: [notEmpty('Booth Options is required')],
    }),
    boothLocation: useField<
      'Lecture Hall Booth' | 'Exhibit Hall Booth' | 'Additional rep'
    >({
      value: 'Lecture Hall Booth',
      validates: [notEmpty('Booth location is required')],
    }),
    sponsorshipPreferrence: useField<
      'Prime' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze'
    >({
      value: 'Prime',
      validates: [notEmpty('Booth Options is required')],
    }),

    generalSupports: useField<
      (
        | 'wi-fi'
        | 'resident sponsorship'
        | 'sponsored lecture'
        | 'av services'
        | 'continental breakfast'
        | 'plated lunch'
        | 'reception jazz band'
        | 'reception food'
        | 'reception drinks'
      )[]
    >({
      value: ['wi-fi'],
      validates: [notEmpty('Booth Options is required')],
    }),

    marketingOpportunities: useField<
      (
        | 'Packet inserts'
        | 'Attendee list'
        | 'Meeting bag'
        | 'Lanyards'
        | 'Badges'
        | 'Pen on meeting bags'
        | 'Proceedings - Full page'
        | 'Proceedings - ½ page'
        | 'Proceedings - Back covers'
      )[]
    >({
      value: ['Packet inserts'],
      validates: [notEmpty('Booth Options is required')],
    }),
  }

  const { fields, submit, submitting, submitErrors } = useForm({
    fields: schema,
    async onSubmit(form) {
      let remoteErrors = []

      try {
        await createCheckOutSession({
          ...form,
          images: [`${process.env.NEXT_PUBLIC_HOST}/vosm_logo.png`],
        })
      } catch (e) {
        remoteErrors.push(e) // your API call goes here
      }

      if (remoteErrors.length > 0) {
        return { status: 'fail', errors: remoteErrors }
      }

      return { status: 'success' }
    },
  })

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null

  const totalPrice = useMemo(() => {
    const values = getValues(fields)
    const total = calcPrice({ ...values })
    return new Price(total)
  }, [fields])

  return <ComingSoon />
  return (
    <Page
      title="Application	for	Commercial	Exhibits and	Sponsorship"
      subtitle="4th Veterinary	Ophthalmic	Surgery	Meeting	&bull; Jul	22-24, 2022"
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
    >
      <Layout>
        <Layout.Section>
          <Banner
            status="warning"
            title="This is work in progress page"
          ></Banner>
        </Layout.Section>
        <Layout.Section>
          <Card title="Company Contact Information and Selections" sectioned>
            <Form noValidate onSubmit={submit}>
              {errorBanner}
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    label="Company Name"
                    placeholder="Acme corp"
                    autoComplete="off"
                    {...fields.companyName}
                  />
                  <TextField
                    label="Company Telephone"
                    placeholder="202-555-0124"
                    autoComplete="tel"
                    inputMode="tel"
                    {...fields.companyTelephone}
                  />
                  <TextField label="Fax" autoComplete="fax" {...fields.fax} />
                  <TextField
                    label="Contact name"
                    autoComplete="fullName"
                    placeholder="John Anderson"
                    {...fields.contactName}
                  />
                  <TextField
                    label="Company/Contact Email"
                    placeholder="john@company.mail.com"
                    autoComplete="off"
                    {...fields.email}
                  />

                  <TextField
                    label="City/State/Zip"
                    autoComplete="off"
                    {...fields.cityStateZip}
                  />

                  <TextField
                    multiline={2}
                    label="Company Address"
                    autoComplete="address"
                    {...fields.address}
                  />

                  <TextField
                    placeholder="www.company.com"
                    label="Company Website"
                    autoComplete="off"
                    {...fields.website}
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <TextContainer>
                    <Heading>Booth layout options</Heading>
                    <List>
                      <List.Item>
                        Previous sponsors have priority in choosing booth space
                      </List.Item>
                      <List.Item>
                        Companies exhibiting at the exhibitor hall can get 2
                        booths max
                      </List.Item>
                      <List.Item>
                        Companies exhibiting in the lecture hall can get 1 booth
                        max
                      </List.Item>
                      <List.Item>Companies cannot share booths</List.Item>
                      <List.Item>
                        Registration fee is per booth and includes only one
                        representative; additional representative = $350
                        [includes daily breakfast+ lunch and reception with hors
                        D'oeuvres].
                      </List.Item>
                      <List.Item>
                        Booths are small. The limit is 2 reps per booth
                      </List.Item>
                    </List>
                  </TextContainer>
                </FormLayout.Group>
                <FormLayout.Group>
                  <CustomChoiceList
                    title="Booth option"
                    subTitle="*refer to booth floor layout sent over email"
                    choices={['1st', '2nd', '3rd', '4th'].map((c) => ({
                      label: `${c} option`,
                      value: c,
                    }))}
                    field={fields.boothOption}
                  />

                  <CustomChoiceList
                    title={'Locations'}
                    field={fields.boothLocation}
                    choices={BoothLocations.map(({ name, price }, i) => ({
                      label: name,
                      helpText: new Price(price).toDollar(),
                      value: name,
                    }))}
                  />
                </FormLayout.Group>

                <FormLayout.Group condensed>
                  <CustomChoiceList
                    title="Sponsorship preferrence"
                    choices={SponsorshipPreferences.map((s, i) => {
                      return {
                        label: s.name,
                        helpText:
                          `${new Price(s.price).toDollar()}` +
                          (s.disc ? `, ${s.disc}% booth disc` : ''),
                        value: s.name,
                      }
                    })}
                    field={fields.sponsorshipPreferrence}
                  />
                  <ChoiceList
                    title="General Support"
                    allowMultiple
                    selected={fields.generalSupports.value}
                    onChange={fields.generalSupports.onChange}
                    choices={GeneralSupport.map((s, i) => {
                      return {
                        disabled: s.label.includes('*'), // disable exclusive package for now
                        label: s.label,
                        helpText: new Price(s.price).toDollar(),
                        value: s.name,
                      }
                    })}
                  />

                  <ChoiceList
                    allowMultiple
                    title={'Marketing Opportunities'}
                    onChange={fields.marketingOpportunities.onChange}
                    selected={fields.marketingOpportunities.value}
                    choices={MarketingOpportunities.map((o, i) => {
                      return {
                        disabled: o.name.includes('*'), // disable exclusive package for now
                        label: o.name,
                        helpText: new Price(o.price).toDollar(),
                        value: o.name,
                      }
                    })}
                  />
                </FormLayout.Group>
              </FormLayout>

              <TextContainer>
                <p className="text-right italic text-slate-600">
                  *=exclusive sponsorship
                </p>
              </TextContainer>
              <div className="mt-10 flex justify-end">
                <Button
                  type="submit"
                  className="px-10"
                  style={{ minWidth: 150 }}
                  disabled
                  // disabled={!dirty}
                  loading={submitting}
                >
                  <b> Proceed to payment {totalPrice.toDollar()}</b>
                </Button>
              </div>
            </Form>
            <TextContainer>
              <Heading>More information:</Heading>
              <List>
                <List.Item>
                  <NextLink href={'/application-guide#marketing-opportunities'}>
                    <Link>Marketing and Sponsorship Opportunities</Link>
                  </NextLink>
                  <p>
                    Refer to this page for registration packet for marketing
                    options, sponsorship levels and general support categories
                  </p>
                </List.Item>
                <List.Item>
                  <NextLink href={'/application-guide'}>
                    <Link>Application Guide</Link>
                  </NextLink>
                  <p>
                    Full payment is required for registration. Fees are due
                    immediately upon registration. Please refer to this{' '}
                    <NextLink href="/application-guide#important-dates">
                      <Link>section</Link>
                    </NextLink>{' '}
                    for remaining due dates. If an invoice or W-9 is needed,
                    please let us know
                  </p>
                </List.Item>
              </List>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

type Props = { host: string | null }
