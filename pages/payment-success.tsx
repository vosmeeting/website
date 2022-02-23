/* eslint-disable react/no-unescaped-entities */
import { Banner, Card, Layout, Page } from '@shopify/polaris'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PaymentSuccess: NextPage = () => {
  const router = useRouter()
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Banner
            title="Your payment was succesfull!"
            status="success"
            action={{
              content: 'Go Back',
              onAction: () => router.push('/vendor'),
            }}
          >
            <p>Your submission is received and we will contact you soon.</p>
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default PaymentSuccess
