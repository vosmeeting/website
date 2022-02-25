import { Banner, Card, Layout, Page } from '@shopify/polaris'
import { notEmpty, useField, useForm } from '@shopify/react-form'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import createCheckOutSession from '../services/stripe'
import Error from 'next/error'
import ComingSoon from '../components/ComingSoon'

export default function Sponsor() {
  const schema = {
    fullName: useField({
      value: '',
      validates: [notEmpty('company name is required')],
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

  const router = useRouter()

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

  return <ComingSoon />
  return (
    <Page
      subtitle="4th Veterinary	Ophthalmic	Surgery	Meeting	&bull; Jul	22-24, 2022"
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
      narrowWidth
    >
      <Layout>
        <Layout.Section>
          <Card title="Participant information" sectioned>
            <Banner
              status="warning"
              title="This page is work in progress"
              action={{ content: 'Go Home', onAction: () => router.push('/') }}
            ></Banner>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
