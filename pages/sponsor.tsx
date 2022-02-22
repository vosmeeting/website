import {
  Banner,
  Button,
  Card,
  ChoiceList,
  Form,
  FormLayout,
  Heading,
  Layout,
  List,
  Page,
  RadioButton,
  Stack,
  TextContainer,
  TextField,
} from '@shopify/polaris'
import {
  asChoiceField,
  lengthMoreThan,
  notEmpty,
  numericString,
  useChoiceField,
  useField,
  useForm,
} from '@shopify/react-form'
import * as yup from 'yup'
import {
  GeneralSupport,
  MarketingOpportunities,
  SponsorshipPreferences,
} from './const'

export default function Sponsor() {
  const schema = {
    companyName: useField({
      value: '',
      validates: [
yup.string().required('this is required').validateSync
      ],
    }),
    companyTelephone: useField({
      value: '',
      validates: [
        yup
          .string()
          .required('please provide a company telephone number')
          .matches(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            'phone number is invalid'
          ).validateSync,
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
      validates: [
        yup.string().required('please provide a contact name')
          .validateSync,
      ],
    }),
    email: useField({
      value: '',
      validates: [
        (input) =>
          yup
            .string()
            .required('this is required')
            .email('please provide a valid email')
            .validateSync(input),
      ],
    }),
    cityStateZip: useField({
      value: '',
      validates: [yup.string().required('this is required').validateSync],
    }),
    website: useField({
      value: '',
      validates: [yup.string().url('must be a valid url').validateSync],
    }),
    boothOption: useField<'1st'| '2nd'|'3rd' |'4th'>({
      value: '1st',
      validates: [
        yup.string().required('this fields is required').validateSync,
      ],
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

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Online store dashboard" sectioned>
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
                <FormLayout.Group
                  title={
                    'Booth Options (refer to booth floor layout sent over email)'
                  }
                >
                  <Stack vertical>
                    {['1st', '2nd', '3rd', '4th'].map(choice => {
                      return <RadioButton key={choice} label={`${choice} Options`} {...asChoiceField(fields.boothOption, choice)} />
                    })}
                  </Stack>
                </FormLayout.Group>
                <FormLayout.Group condensed>
                  <ChoiceList
                    selected={['0']}
                    title={<b>Sponsorship Prefferences</b>}
                    choices={SponsorshipPreferences.map(
                      (s, i) => {
                        return {
                          label: s.name,
                          helpText:
                            `${s.price.toDollar()}` +
                            (s.disc
                              ? `, ${s.disc}% booth disc`
                              : null),
                          value: i.toString(),
                        }
                      }
                    )}
                  />
                  <ChoiceList
                    selected={['0']}
                    title={<b>General support</b>}
                    choices={GeneralSupport.map((s, i) => {
                      return {
                        disabled: s.name.includes('*'), // disable exclusive package for now
                        label: s.name,
                        helpText: s.price.toDollar(),
                        value: i.toString(),
                      }
                    })}
                  />

                  <ChoiceList
                    title={<b>Marketing Opportunities</b>}
                    selected={['0']}
                    choices={MarketingOpportunities.map(
                      (o, i) => {
                        return {
                          disabled: o.name.includes(
                            '*'
                          ), // disable exclusive package for now
                          label: o.name,
                          helpText: o.price.toDollar(),
                          value: i.toString(),
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
              <Button
                submit
                // disabled={!dirty}
                loading={submitting}
              >
                Proceed to payment
              </Button>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
