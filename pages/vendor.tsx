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
import {
  getValues,
  notEmpty,
  numericString,
  useField,
  useForm,
} from '@shopify/react-form'
import { omit } from 'lodash'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import Button from '../components/Buttons'
import createVendorCheckoutSession from '../services/stripe'
import { Price } from '../utils/const'

export default function Sponsor() {
  const route = useRouter()
  const {
    companyName = '',
    companyTelephone = '',
    email = '',
    amount = '',
    error = '',
  } = route.query as {
    companyName: string
    companyTelephone: string
    email: string
    amount: string
    error: string
  }
  console.log(route.query)

  const schema = {
    companyName: useField({
      value: companyName,
      validates: [notEmpty('company name is required')],
    }),
    companyTelephone: useField({
      value: companyTelephone,
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
    email: useField({
      value: email,
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
    amount: useField({
      value: amount,
      validates: [
        notEmpty('Donation amount is required!'),
        numericString('must be a valid amount: only numeric is accepted'),
      ],
    }),
  }

  const [remoteErrors, setRemoteErrors] = useState([])

  useEffect(() => {
    if (error) setRemoteErrors([new Error(error)])
  }, [error])

  const { fields, submit, submitting } = useForm({
    fields: schema,
    async onSubmit(form) {
      const item = {
        images: [`${process.env.NEXT_PUBLIC_HOST}/vosm_logo.png`],
        amount: form.amount,
      }
      const vendor = omit(form, 'amount')

      try {
        await createVendorCheckoutSession({
          item,
          vendor,
        })
      } catch (e) {
        setRemoteErrors([e])
        return
      }

      return { status: 'success' }
    },
  })

  const errorBanner =
    remoteErrors.length > 0 ? (
      <Banner status="critical" onDismiss={() => setRemoteErrors([])}>
        <p>There were some issues with your form submission:</p>
        <List>
          {remoteErrors.map(({ message }, index) => {
            return <List.Item key={`${message}${index}`}>{message}</List.Item>
          })}
        </List>
      </Banner>
    ) : null

  return (
    <Page
      title="Application	for	Commercial	Exhibits and	Sponsorship"
      subtitle="4th Veterinary	Ophthalmic	Surgery	Meeting	&bull; Jul	22-24, 2022"
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
      narrowWidth
    >
      <Card title="Company Contact Information" sectioned>
        <Layout>
          <Layout.Section>{errorBanner}</Layout.Section>
          <Layout.Section>
            <Form noValidate onSubmit={submit}>
              <FormLayout>
                <TextField
                  label="Company Name"
                  placeholder="Acme corp"
                  autoComplete="off"
                  {...fields.companyName}
                />
                <FormLayout.Group>
                  <TextField
                    label="Company Telephone"
                    placeholder="202-555-0124"
                    autoComplete="tel"
                    inputMode="tel"
                    {...fields.companyTelephone}
                  />
                  <TextField
                    label="Company/Contact Email"
                    placeholder="john@company.mail.com"
                    autoComplete="email"
                    {...fields.email}
                  />
                </FormLayout.Group>
                <FormLayout.Group></FormLayout.Group>
                <TextField
                  label="Amount"
                  inputMode="numeric"
                  type="number"
                  autoComplete="off"
                  {...fields.amount}
                />
              </FormLayout>
              <div className="mt-10 flex justify-center sm:justify-end">
                <Button
                  type="submit"
                  className="px-10"
                  style={{ minWidth: 150 }}
                  loading={submitting}
                >
                  <b>
                    Proceed to payment{' '}
                    {new Price(getValues(fields).amount).toDollar()}
                  </b>
                </Button>
              </div>
            </Form>
          </Layout.Section>
        </Layout>
      </Card>
    </Page>
  )
}
