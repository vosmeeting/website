import {
  Banner,
  Card,
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
import { getValues, notEmpty, numericString, useField, useForm } from '@shopify/react-form'
import NextLink from 'next/link'
import * as yup from 'yup'
import Button from '../components/Buttons'
import createCheckOutSession from '../services/stripe'
import { Price } from '../utils/const'

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
		amount: useField({
			value: '',
			validates: [
				notEmpty('Donation amount is required!'), numericString('must be a valid amount: only numeric is accepted')
			]
		})
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

  return (
    <Page
      title="Application	for	Commercial	Exhibits and	Sponsorship"
      subtitle="4th Veterinary	Ophthalmic	Surgery	Meeting	&bull; Jul	22-24, 2022"
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
    >
      <Layout>
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
								<TextField label="Amount" inputMode='numeric' autoComplete='off' {...fields.amount} />
              </FormLayout>
              <div className="flex justify-end mt-10">
                <Button
                  type="submit"
                  className="px-10"
                  style={{ minWidth: 150 }}
                  loading={submitting}
                >
                  <b>Proceed to payment {new Price(getValues(fields).amount).toDollar()}</b>
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
