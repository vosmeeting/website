import {
  Banner,
  Card,
  ChoiceList,
  Form,
  FormLayout,
  Heading,
  Layout,
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
import { useMemo } from 'react'
import * as yup from 'yup'
import Button from '../components/Buttons'
import CustomChoiceList from '../components/CustomChoiceList'
import {
  BoothLocations,
  GeneralSupport,
  MarketingOpportunities,
  Price,
  SponsorshipPreferences,
  SponsorshipPreferences as SponsorshipPreferrences,
} from './const'

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
            yup.string()
              .required('Company/Contact is required')
              .email('please provide a valid email')
              .validateSync(input)
          } catch (e: any) {
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

    generalSupports: useField<(
      | 'wi-fi'
      | 'resident sponsorship'
      | 'sponsored lecture'
      | 'av services'
      | 'continental breakfast'
      | 'plated lunch'
      | 'reception jazz band'
      | 'reception food'
      | 'reception drinks')[]
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
      value:['Packet inserts'],
      validates: [notEmpty('Booth Options is required')],
    }),
  }

  const { fields, submit, submitting, dirty, submitErrors } = useForm({
    fields: schema,
    async onSubmit(form) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(form)
      const remoteErrors: any = [] // your API call goes here
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
    const { boothLocation, sponsorshipPreferrence, marketingOpportunities, generalSupports, } = getValues(fields)

    const boothPrice = BoothLocations.find(e => e.name === boothLocation)?.price as number
    const boothDisc = SponsorshipPreferrences.find(s => s.name === sponsorshipPreferrence)?.disc  as number
    const sponsorshipPrice = SponsorshipPreferrences.find(s => s.name === sponsorshipPreferrence)?.price as number

    const marketingPrices = MarketingOpportunities.filter(value => marketingOpportunities.includes(value.name)).reduce((acc, v) => v.price + acc, 0)
    const generalSupportPrices = GeneralSupport.filter(value => generalSupports.includes(value.name)).reduce((acc, v) => v.price + acc, 0)

    console.log({marketingPrice: marketingPrices, generalSupportPrice: generalSupportPrices});
    
    const total = (1 - boothDisc / 100) * boothPrice + sponsorshipPrice + marketingPrices + generalSupportPrices

    return new Price(total)
  }, [fields])

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card
            title="Online store dashboard"
            sectioned
            actions={[
              { content: 'Proceed to payment', onAction: submit },
            ]}
          >
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
                  <TextField
                    label="Fax"
                    autoComplete="fax"
                    {...fields.fax}
                  />
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
                    placeholder="www.company.com"
                    label="Company Website"
                    autoComplete="off"
                    {...fields.website}
                  />
                  <TextField
                    multiline={4}
                    label="Company Address"
                    autoComplete="address"
                    {...fields.address}
                  />
                </FormLayout.Group>

                <TextContainer>
                  <Heading>Booth layout options</Heading>
                  <List>
                    <List.Item>
                      Previous sponsors have priority in
                      choosing booth space
                    </List.Item>
                    <List.Item>
                      Companies exhibiting at the
                      exhibitor hall can get 2 booths max
                    </List.Item>
                    <List.Item>
                      Companies exhibiting in the lecture
                      hall can get 1 booth max
                    </List.Item>
                    <List.Item>
                      Companies cannot share booths
                    </List.Item>
                    <List.Item>
                      Registration fee is per booth and
                      includes only one representative;
                      additional representative = $350
                      [includes daily breakfast+ lunch and
                      reception with hors D'oeuvres].
                    </List.Item>
                    <List.Item>
                      Booths are small. The limit is 2
                      reps per booth
                    </List.Item>
                  </List>
                </TextContainer>
                <FormLayout.Group>
                  <CustomChoiceList
                    title="Booth option"
                    subTitle="*refer to booth floor layout sent over email"
                    choices={[
                      '1st',
                      '2nd',
                      '3rd',
                      '4th',
                    ].map((c) => ({
                      label: `${c} option`,
                      value: c,
                    }))}
                    field={fields.boothOption}
                  />

                  <CustomChoiceList
                    title={'Locations'}
                    field={fields.boothLocation}
                    choices={BoothLocations.map(
                      ({ name, price }, i) => ({
                        label: name,
                        helpText: new Price(price).toDollar(),
                        value: name,
                      })
                    )}
                  />
                </FormLayout.Group>

                <FormLayout.Group condensed>
                  <CustomChoiceList
                    title="Sponsorship preferrence"
                    choices={SponsorshipPreferences.map(
                      (s, i) => {
                        return {
                          label: s.name,
                          helpText:
                            `${new Price(s.price).toDollar()}` +
                            (s.disc
                              ? `, ${s.disc}% booth disc`
                              : ''),
                          value: s.name,
                        }
                      }
                    )}
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
                    choices={MarketingOpportunities.map(
                      (o, i) => {
                        return {
                          disabled: o.name.includes(
                            '*'
                          ), // disable exclusive package for now
                          label: o.name,
                          helpText: new Price(o.price).toDollar(),
                          value: o.name,
                        }
                      }
                    )}
                  />
                </FormLayout.Group>
              </FormLayout>

              <TextContainer>
                <p className="text-right italic text-slate-600">
                  *=exclusive sponsorship
                </p>
              </TextContainer>
              <div className="flex justify-end mt-10">
                <Button
                  primary
                  type="submit"
                  className='px-10'
                  style={{ minWidth: 150 }}
                  // disabled={!dirty}
                  loading={submitting}
                >

                  <b> Proceed to payment {totalPrice.toDollar()}</b>
                </Button>
              </div>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
